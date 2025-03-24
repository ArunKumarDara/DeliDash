import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MapPin, Clock, CreditCard } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAddresses } from "@/api/address";
import { useState } from "react";
import AddressForm from "@/components/address/AddressForm";
import { Textarea } from "@/components/ui/textarea";

interface SavedAddress {
    _id: string;
    type: string;
    address: string;
    phoneNumber: string;
    isDefault: boolean;
    receiverName: string
}

export default function Checkout() {
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
        isError,
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
                        ) : isError ? (
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
                                    <div className="flex gap-2">
                                        <div className="font-medium">{item.quantity}x</div>
                                        <div>
                                            <p className="font-medium">{item.item.name}</p>
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

                        <Button className="w-full mt-6" size="lg">
                            Place Order • ₹{totalAmount + 40}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}