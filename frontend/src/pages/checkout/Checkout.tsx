import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { MapPin, Clock, CreditCard } from "lucide-react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAddresses } from "@/api/address";
import { useState } from "react";
import AddressForm from "@/components/address/AddressForm";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { placeOrder } from "@/api/order";
import { useNavigate } from "react-router";
import { clearCart } from "@/store/cartSlice";

interface SavedAddress {
    _id: string;
    type: string;
    address: string;
    phoneNumber: string;
    isDefault: boolean;
    receiverName: string
}

interface CartItem {
    item: {
        _id: string;
        name: string;
        price: number;
    };
    quantity: number;
}

// Define OrderPayload
interface OrderPayload {
    addressId: string;
    deliveryTime: string;
    deliveryInstructions: string;
    menuItems: CartItem[];
    totalAmount: number;
    paymentMethod: string;
}


export default function Checkout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const [openAddressForm, setOpenAddressForm] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [deliveryInstructions, setDeliveryInstructions] = useState("");
    const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string | null>(null);
    const [selectedPayment, setSelectedPayment] = useState("Cash on Delivery");

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError: isAddressError,
        error,
    } = useInfiniteQuery({
        queryKey: ["addresses"],
        queryFn: ({ pageParam = 1 }) => fetchAddresses(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
        },
        retry: false,
        staleTime: 1000 * 60 * 5
    });

    const addresses = data?.pages.flatMap((page) => page.addresses) || [];

    const { mutate, isPending: isOrderPending } = useMutation<OrderPayload, Error, OrderPayload>({
        mutationKey: ["orders"],
        mutationFn: placeOrder,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Order placed successfully!");
            dispatch(clearCart())
            console.log(data)
            // Optionally, navigate to order confirmation page
            navigate(`/order-confirmation/${data?.order?._id}`)
        },
        onError: (error) => {
            toast.error("Uh oh! Something went wrong.", {
                description: error.message || "Failed to place order. Please try again.",
            });
        },
    });

    const handlePlaceOrder = () => {
        if (items.length === 0) {
            toast.error("Uh oh! Something went wrong.", {
                description: "Your cart is empty. Please add items before placing an order.",
            });
            return;
        }
        if (!selectedAddressId) {
            toast.error("Uh oh! Something went wrong.", {
                description: "Please select a delivery address.",
            });
            return;
        }
        if (!selectedDeliveryTime) {
            toast.error("Uh oh! Something went wrong.", {
                description: "Please select a delivery time.",
            });
            return;
        }

        mutate({
            addressId: selectedAddressId,
            deliveryTime: selectedDeliveryTime,
            deliveryInstructions,
            menuItems: items,
            totalAmount: totalAmount + 40, // Including delivery fee
            paymentMethod: selectedPayment,
        });
    };


    return (
        <div className="container max-w-6xl mx-auto lg:w-6xl w-dvw md-p-0 p-4">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Delivery Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Saved Addresses */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Delivery Address</h2>
                        </div>
                        {isLoading ? (
                            <p>Loading addresses...</p>
                        ) : isAddressError ? (
                            <p className="text-red-500">{error.message}</p>
                        ) : (
                            <div className="space-y-4">
                                {addresses.map((address: SavedAddress) => (
                                    <div
                                        key={address._id}
                                        className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary transition-colors"
                                    >
                                        <Checkbox id={`address-${address._id}`}
                                            checked={selectedAddressId === address._id}
                                            onCheckedChange={() => setSelectedAddressId(address._id)}
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor={`address-${address._id}`}
                                                className="flex items-center gap-2 font-medium cursor-pointer"
                                            >
                                                {address?.type}
                                                {address.isDefault && (
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </label>
                                            <h3 className="font-semibold">{address.receiverName}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{address.address}</p>
                                            <p className="text-sm text-muted-foreground mt-1">Phone: {address.phoneNumber}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {hasNextPage && (
                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? "Loading more..." : "Load More Addresses"}
                            </Button>
                        )}
                        <Button className="w-full mt-6" onClick={() => setOpenAddressForm(true)}>
                            Add New Address
                        </Button>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Delivery Instructions</h2>
                        </div>
                        <Textarea
                            placeholder="E.g., Leave at the doorstep, call upon arrival..."
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            className="w-full"
                        />
                    </Card>

                    {/* Delivery Time */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Delivery Time</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {["ASAP", "30-45 min", "45-60 min"].map((time) => (
                                <Button
                                    key={time}
                                    variant={selectedDeliveryTime === time ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => setSelectedDeliveryTime(time)}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </Card>
                    <AddressForm openAddressForm={openAddressForm} setOpenAddressForm={setOpenAddressForm} />
                    {/* Payment Method */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Payment Method</h2>
                        </div>
                        <div className="space-y-3">
                            {["Credit/Debit Card", "UPI", "Cash on Delivery"].map((method) => (
                                <div
                                    key={method}
                                    className="flex items-center gap-4 p-4 border rounded-lg hover:border-primary transition-colors"
                                >
                                    <Checkbox id={`payment-${method}`}
                                        checked={selectedPayment === method}
                                        disabled={method !== "Cash on Delivery"}
                                        onCheckedChange={() => setSelectedPayment(method)}
                                    />
                                    <label
                                        htmlFor={`payment-${method}`}
                                        className="font-medium cursor-pointer"
                                    >
                                        {method}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.item._id}
                                    className="flex justify-between items-start py-2 border-b"
                                >
                                    <div className="flex gap-2 flex-col items-start">
                                        <div className="flex justify-start items-center gap-2">
                                            <div className="font-medium">{item.quantity}x</div>
                                            <p className="font-medium">{item.item.name}</p>
                                        </div>
                                        <div className="flex justify-start items-center gap-2">
                                            <p className="text-sm text-muted-foreground">{item.restaurant.name} -</p>
                                            <p className="text-sm text-muted-foreground">
                                                ₹{item.item.price} each
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-medium">
                                        ₹{item.item.price * item.quantity}
                                    </p>
                                </div>
                            ))}

                            <div className="space-y-2 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span>₹40</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                                    <span>Total</span>
                                    <span>₹{totalAmount + 40}</span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full mt-6" size="lg" onClick={handlePlaceOrder}>
                            {isOrderPending ? (
                                <span className="flex gap-1 items-center">
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce"></span>
                                </span>
                            ) : (
                                `Place Order • ₹${totalAmount + 40}`
                            )}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}