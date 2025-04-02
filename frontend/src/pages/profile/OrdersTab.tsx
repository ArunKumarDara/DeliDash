import FoodSpinner from "@/components/spinner/FoodSpinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router";

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

interface Order {
    _id: string;
    status: 'placed' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
    totalAmount: number;
    menuItems: MenuItem[];
    addressId: {
        address: string;
        phoneNumber: string;
    };
    deliveryTime: string;
    deliveryInstructions?: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    confirmedAt?: string;
    preparingAt?: string;
    outForDeliveryAt?: string;
    deliveredAt?: string;
}

interface OrdersTabProps {
    orders: Order[];
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    refetch: () => void;
    fetchNextPage: () => void;
}

const deliveryFee = 20

export function OrdersTab({
    orders,
    isLoading,
    isError,
    isEmpty,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
}: OrdersTabProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                    <Card key={i} className="p-6">
                        <FoodSpinner />
                    </Card>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <Card className="p-6">
                <div className="text-center space-y-2">
                    <AlertTriangle className="h-8 w-8 mx-auto text-red-500" />
                    <h3 className="font-medium">Failed to load orders</h3>
                    <p className="text-sm text-muted-foreground">
                        There was an error loading your orders. Please try again.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                        Retry
                    </Button>
                </div>
            </Card>
        );
    }

    if (isEmpty) {
        return (
            <Card className="p-6">
                <div className="text-center space-y-2">
                    <Package className="h-8 w-8 mx-auto text-muted-foreground" />
                    <h3 className="font-medium">No orders yet</h3>
                    <p className="text-sm text-muted-foreground">
                        Your order history will appear here once you place an order.
                    </p>
                    <Button className="mt-4">Browse Restaurants</Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {orders?.map((order) => {
                const restaurants = Array.from(
                    new Set(order.menuItems.map((item) => item.restaurant?.name))
                ).join(", ");

                const total = order.menuItems.reduce(
                    (sum, { item: { price }, quantity }) => sum + (price * quantity),
                    0
                );

                return (
                    <Card key={order._id} className="p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{restaurants}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Order #{order._id.slice(-6).toUpperCase()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "delivered"
                                            ? "bg-green-100 text-green-800"
                                            : order.status === "cancelled"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        <Clock className="inline h-3 w-3 mr-1" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.menuItems.map((menuItem, index: number) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>
                                            {menuItem.quantity}x {menuItem.item.name}
                                        </span>
                                        <span>₹{menuItem.item.price * menuItem.quantity}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground text-sm">Delivery Charges</span>
                                    <span>{`₹${deliveryFee}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground text-sm">Taxes & Charges</span>
                                    <span>₹{Math.round(total * 0.05)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {order.paymentMethod} • {order.deliveryTime}
                                    </p>
                                    {order.deliveryInstructions && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Note: {order.deliveryInstructions}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="font-semibold block">
                                        ₹{order.totalAmount}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Link to={`/order-confirmation/${order._id}`}>
                                    <Button variant="outline" className="w-full">
                                        Track Order
                                    </Button>
                                </Link>
                                <Link to={`/order-confirmation/${order._id}`}>
                                    <Button variant="outline" className="w-full">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                );
            })}

            {hasNextPage && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? "Loading more..." : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
}