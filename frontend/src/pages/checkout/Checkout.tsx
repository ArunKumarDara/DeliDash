import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MapPin, Clock, CreditCard } from "lucide-react";

interface SavedAddress {
    id: string;
    name: string;
    address: string;
    phone: string;
    isDefault: boolean;
}

// Mock data for saved addresses
const savedAddresses: SavedAddress[] = [
    {
        id: "1",
        name: "Home",
        address: "123 Main Street, Apartment 4B, City, State 12345",
        phone: "+91 9876543210",
        isDefault: true,
    },
    {
        id: "2",
        name: "Office",
        address: "456 Work Avenue, Floor 3, City, State 12345",
        phone: "+91 9876543211",
        isDefault: false,
    },
];

export default function Checkout() {
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);

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

                        <div className="space-y-4">
                            {savedAddresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary transition-colors"
                                >
                                    <Checkbox id={`address-${address.id}`} defaultChecked={address.isDefault} />
                                    <div className="flex-1">
                                        <label
                                            htmlFor={`address-${address.id}`}
                                            className="flex items-center gap-2 font-medium cursor-pointer"
                                        >
                                            {address.name}
                                            {address.isDefault && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                    Default
                                                </span>
                                            )}
                                        </label>
                                        <p className="text-sm text-muted-foreground mt-1">{address.address}</p>
                                        <p className="text-sm text-muted-foreground mt-1">Phone: {address.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" className="mt-4 w-full">
                            Add New Address
                        </Button>
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
                                    variant="outline"
                                    className="w-full"
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </Card>

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
                                    <Checkbox id={`payment-${method}`} />
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