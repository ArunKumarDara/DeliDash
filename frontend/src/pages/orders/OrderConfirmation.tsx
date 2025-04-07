import { CheckCircle2, Clock, MapPin, Phone, MessageSquare, CreditCard, ChefHat, Truck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router";
import { getOrderById } from "@/api/order";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import DeliverySpinner from "@/components/spinner/DeliverySpinner";

interface MenuItem {
    _id: string;
    item: {
        _id: string;
        name: string;
        price: number;
        isVeg?: boolean;
    };
    quantity: number;
    restaurant: {
        _id: string;
        name: string;
        address: string;
        phoneNumber: string;
    };
}

interface Payment {
    _id: string;
    status: string;
    paymentMethod: string;
}
interface Order {
    _id: string;
    status: string;
    totalAmount: number;
    menuItems: MenuItem[];
    addressId: {
        address: string;
        phoneNumber: string;
        receiverName?: string;
    };
    deliveryTime: string;
    deliveryInstructions?: string;
    paymentId: string;
    createdAt: string;
    payment: Payment;
    updatedAt: string;
    confirmedAt?: string;
    preparingAt?: string;
    outForDeliveryAt?: string;
    deliveredAt?: string;
}

export default function OrderConfirmation() {
    const params = useParams();
    const navigate = useNavigate();
    const orderId = params.orderId ?? "";

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["orderDetails", orderId],
        queryFn: () => getOrderById(orderId),
        enabled: !!orderId,
        retry: false,
        refetchInterval: 30000,
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'placed':
                return <Badge variant="outline" className="border-blue-500 text-blue-500">Placed</Badge>;
            case 'confirmed':
                return <Badge variant="outline" className="border-green-500 text-green-500">Confirmed</Badge>;
            case 'preparing':
                return <Badge variant="outline" className="border-orange-500 text-orange-500">Preparing</Badge>;
            case 'on the way':
                return <Badge variant="outline" className="border-purple-500 text-purple-500">On the way</Badge>;
            case 'delivered':
                return <Badge variant="outline" className="border-green-600 text-green-600">Delivered</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="border-red-500 text-red-500">Cancelled</Badge>;
            default:
                return <Badge variant="outline" className="border-gray-500 text-gray-500">Processing</Badge>;
        }
    };

    const getProgressPercentage = (status: string) => {
        switch (status) {
            case 'placed': return 10;
            case 'confirmed': return 30;
            case 'preparing': return 50;
            case 'on the way': return 80;
            case 'delivered': return 100;
            case 'cancelled': return 0;
            default: return 10;
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 max-w-4xl h-screen flex items-center justify-center">
                <DeliverySpinner />
            </div >
        );
    }

    if (isError || !data) {
        toast.error("Failed to fetch order details. Please try again.");
        return (
            <div className="container mx-auto py-8 max-w-4xl text-center">
                <h2 className="text-2xl font-bold mb-4">Error Loading Order</h2>
                <p className="text-muted-foreground mb-6">
                    {error?.message || "Something went wrong."}
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }



    const order: Order = data?.order
    const progressPercentage = getProgressPercentage(order.status);
    const isCancelled = order.status === 'cancelled';

    // Group menu items by restaurant
    const restaurantsMap = new Map<string, MenuItem[]>();
    order.menuItems.forEach(item => {
        if (!restaurantsMap.has(item.restaurant._id)) {
            restaurantsMap.set(item.restaurant._id, []);
        }
        restaurantsMap.get(item.restaurant._id)?.push(item);
    });

    const amount = order.menuItems.reduce((sum, { item: { price }, quantity }) =>
        sum + (price * quantity), 0);

    const deliveryFee = 20

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            {/* Confirmation Header */}
            <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        {isCancelled ? (
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            </div>
                        ) : (
                            <>
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                                <div className="absolute inset-0 bg-green-100 rounded-full opacity-0 animate-ping-slow" />
                            </>
                        )}
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    {isCancelled ? "Order Cancelled" : order.status === 'delivered' ? "Order Delivered!" : "Order Placed!"}
                </h1>

                {/* Order Summary Chip */}
                <div className="mt-6 inline-flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                    <span className="font-medium">₹{order.totalAmount}</span>
                    <span>•</span>
                    <span>{order.menuItems.length} {order.menuItems.length === 1 ? 'item' : 'items'}</span>
                    {restaurantsMap.size > 1 && (
                        <>
                            <span>•</span>
                            <span>{restaurantsMap.size} restaurants</span>
                        </>
                    )}
                </div>
            </div>

            {/* Progress Timeline */}
            {!isCancelled && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Order Status</h2>
                        {getStatusBadge(order.status)}
                    </div>

                    <div className="relative">
                        {/* Timeline */}
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ height: `${progressPercentage}%` }}
                            />
                        </div>

                        {/* Steps */}
                        <div className="space-y-8 pl-10">
                            {/* Step 1 - Order Placed */}
                            <div className="relative">
                                <div className={`absolute -left-10 top-0 flex h-6 w-6 items-center justify-center rounded-full ${progressPercentage >= 10 ? 'bg-green-500 text-white' : 'bg-gray-200'
                                    }`}>
                                    {progressPercentage >= 10 ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">Order Placed</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 - Order Confirmed */}
                            <div className="relative">
                                <div className={`absolute -left-10 top-0 flex h-6 w-6 items-center justify-center rounded-full ${progressPercentage >= 30 ? 'bg-green-500 text-white' : 'bg-gray-200'
                                    }`}>
                                    {progressPercentage >= 30 ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">Order Confirmed</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {order.confirmedAt
                                            ? new Date(order.confirmedAt).toLocaleString()
                                            : 'Waiting for confirmation'}
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 - Preparing */}
                            <div className="relative">
                                <div className={`absolute -left-10 top-0 flex h-6 w-6 items-center justify-center rounded-full ${progressPercentage >= 50 ? 'bg-green-500 text-white' : 'bg-gray-200'
                                    }`}>
                                    {progressPercentage >= 50 ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <ChefHat className="h-4 w-4 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">Preparing Your Order</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {order.preparingAt
                                            ? new Date(order.preparingAt).toLocaleString()
                                            : 'Restaurant will start soon'}
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 - On The Way */}
                            <div className="relative">
                                <div className={`absolute -left-10 top-0 flex h-6 w-6 items-center justify-center rounded-full ${progressPercentage >= 80 ? 'bg-green-500 text-white' : 'bg-gray-200'
                                    }`}>
                                    {progressPercentage >= 80 ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <Truck className="h-4 w-4 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">On The Way</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {order.outForDeliveryAt
                                            ? `Started at ${new Date(order.outForDeliveryAt).toLocaleTimeString()}`
                                            : 'Waiting for delivery'}
                                    </p>
                                </div>
                            </div>

                            {/* Step 5 - Delivered (only show if delivered) */}
                            {order.status === 'delivered' && (
                                <div className="relative">
                                    <div className="absolute -left-10 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Delivered</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {order.deliveredAt
                                                ? new Date(order.deliveredAt).toLocaleString()
                                                : 'Order completed'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Summary Card */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-6">
                        {Array.from(restaurantsMap.entries()).map(([restaurantId, items]) => {
                            const restaurant = items[0].restaurant;
                            return (
                                <div key={restaurantId} className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Store className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="font-medium">{restaurant.name}</h3>
                                    </div>
                                    {items.map((item) => (
                                        <div key={item._id} className="flex justify-between items-center py-2 border-b">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-start">
                                                    <div className="flex gap-2">
                                                        <span className="font-medium text-muted-foreground">{item.quantity}x</span>
                                                        <span>{item.item.name}</span>
                                                        {item.item.isVeg ? (
                                                            <Badge variant="outline" className="border-green-600 text-green-600 px-1">
                                                                Veg
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="border-red-600 text-red-600 px-1">
                                                                Non-Veg
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="font-medium">₹{item.item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Delivery Charges</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxes & Charges + Delivery Fee</span>
                            <span>₹{Math.round(amount * 0.05)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t">
                            <span>Total</span>
                            <span>₹{order.totalAmount}</span>
                        </div>
                    </div>
                </Card>

                {/* Delivery Details Card */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Delivery Address</h3>
                                    <p className="text-muted-foreground">{order.addressId?.address}</p>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Phone: {order.addressId?.phoneNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Delivery Time</h3>
                                    <p className="text-muted-foreground">
                                        {order.deliveryTime}
                                    </p>
                                </div>
                            </div>

                            {order.deliveryInstructions && (
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 flex items-center justify-center text-muted-foreground mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Delivery Instructions</h3>
                                        <p className="text-muted-foreground">
                                            {order.deliveryInstructions}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Restaurants Info Cards */}
                    {Array.from(restaurantsMap.entries()).map(([restaurantId, items]) => {
                        const restaurant = items[0].restaurant;
                        return (
                            <Card key={restaurantId} className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium">{restaurant.name}</h3>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            {restaurant.address}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" className="shrink-0" disabled>
                                        {/* <a href={`tel:${restaurant.phoneNumber}`}> */}
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call
                                        {/* </a> */}
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Payment Method */}
            <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{order.payment.paymentMethod}</span>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-500">
                        {order.payment.status}
                    </Badge>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </Button>
                {!isCancelled && (
                    <>
                        {/* <Button
                            className="flex-1"
                            onClick={() => navigate(`/restaurant/${order.menuItems[0]?.restaurant._id}`)}
                        >
                            Order Again
                        </Button> */}
                        <Button
                            // variant="secondary"
                            className="flex-1"
                            onClick={() => navigate("/profile")}
                        >
                            View All Orders
                        </Button>
                    </>
                )}
            </div>

            {/* Help Section */}
            <Card className="mt-8 p-6">
                <h2 className="text-xl font-semibold mb-4">Need help with your order?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="gap-2" disabled>
                        {/* <a href="9100401610"> */}
                        <Phone className="h-4 w-4" />
                        Call Us
                        {/* </a> */}
                    </Button>
                    <Button variant="outline" className="gap-2" disabled>
                        <MessageSquare className="h-4 w-4" />
                        Chat Support
                    </Button>
                </div>
            </Card>
        </div>
    );
}