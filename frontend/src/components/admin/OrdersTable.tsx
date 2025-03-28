import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrderStatus } from "@/api/order";
import { Button } from "@/components/ui/button";
import { Loader2, Package, ChevronDown, MoreVertical, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner"

interface Order {
    _id: string;
    userId: string;
    addressId: {
        receiverName: string;
        phoneNumber: string;
        address: string;
    };
    menuItems: {
        item: {
            _id: string;
            name: string;
            price: number;
        };
        quantity: number;
        restaurant: {
            _id: string;
            name: string;
        };
    }[];
    totalAmount: number;
    paymentMethod: "Cash on Delivery" | "Online Payment";
    status: "placed" | "confirmed" | "preparing" | "on the way" | "delivered" | "cancelled";
    deliveryTime: string;
    deliveryInstructions?: string;
    createdAt: string;
}

const statusColors = {
    placed: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-indigo-100 text-indigo-800",
    "on the way": "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const statusActions = {
    placed: ["confirm", "cancel"],
    confirmed: ["start preparing", "cancel"],
    preparing: ["mark as ready", "cancel"],
    "on the way": ["mark as delivered"],
    delivered: [],
    cancelled: [],
};

export default function OrdersTable() {
    const queryClient = useQueryClient();
    // const { toast } = useToast();

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["orders"],
        queryFn: ({ pageParam = 1 }) => getOrders({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
        },
    });

    const { mutate: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
            updateOrderStatus(orderId, status),
        onMutate: async ({ orderId, status }) => {
            await queryClient.cancelQueries({ queryKey: ['orders'] });
            const previousOrders = queryClient.getQueryData(['orders']);

            queryClient.setQueryData(['orders'], (old: any) => {
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.map((order: Order) =>
                            order._id === orderId ? { ...order, status } : order
                        )
                    }))
                };
            });

            return { previousOrders };
        },
        onError: (err, variables, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(['orders'], context.previousOrders);
            }
            toast("Failed to update order status",);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    });

    const handleStatusChange = (orderId: string, action: string) => {
        const actionToStatus: Record<string, string> = {
            'confirm': 'confirmed',
            'cancel': 'cancelled',
            'start preparing': 'preparing',
            'mark as ready': 'on the way',
            'mark as delivered': 'delivered'
        };

        const newStatus = actionToStatus[action] || action;
        updateStatus({ orderId, status: newStatus });
    };

    if (isLoading) {
        return (
            <Card className="rounded-lg border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Orders</CardTitle>
                    <div className="animate-pulse h-4 w-48 bg-gray-200 rounded" />
                </CardHeader>
                <CardContent className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="rounded-lg border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Orders</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 space-y-4">
                    <div className="text-red-500 font-medium">Failed to load orders</div>
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="gap-2"
                    >
                        <Loader2 className="h-4 w-4" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const orders = data?.pages.flatMap(page => page.data) || [];
    const isEmpty = orders.length === 0;

    if (isEmpty) {
        return (
            <Card className="rounded-lg border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Orders</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 space-y-4">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="text-lg font-medium">No orders yet</div>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        When customers place orders, they will appear here for management.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-lg border shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-semibold">Order Management</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {orders.length} order{orders.length !== 1 ? 's' : ''} • Sorted by recent
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                        Filters <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[120px]">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="w-[250px]">Items</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Delivery Info</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    <div className="font-semibold">#{order._id.slice(-6).toUpperCase()}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{order.addressId.receiverName}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {order.addressId.phoneNumber}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2">
                                        {order.menuItems.map((menuItem, index: number) => (
                                            <div key={`${order._id}-${index}`} className="border-b pb-2 last:border-0 last:pb-0">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        {menuItem.quantity}x {menuItem.item.name}
                                                    </span>
                                                    <span>₹{(menuItem.item.price * menuItem.quantity).toFixed(2)}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {menuItem.restaurant.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                    ₹{order.totalAmount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColors[order.status]} capitalize`}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span>{order.deliveryTime}</span>
                                        {order.deliveryInstructions && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-[300px]">
                                                    <p className="font-medium mb-1">Delivery Instructions:</p>
                                                    <p className="text-sm">{order.deliveryInstructions}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {order.paymentMethod.toLowerCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {statusActions[order.status].map((action) => (
                                                <DropdownMenuItem
                                                    key={action}
                                                    onSelect={() => handleStatusChange(order._id, action)}
                                                    disabled={isUpdating}
                                                >
                                                    {action.charAt(0).toUpperCase() + action.slice(1)}
                                                    {isUpdating && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuItem
                                                onSelect={() => console.log("View details", order._id)}
                                            >
                                                View details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onSelect={() => handleStatusChange(order._id, "cancelled")}
                                                disabled={!statusActions[order.status].includes("cancel") || isUpdating}
                                            >
                                                Cancel order
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {hasNextPage && (
                    <div className="flex justify-center p-4 border-t">
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            variant="outline"
                            className="gap-2"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    Load more
                                    <ChevronDown className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}