import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Package, User, Clock, Edit2 } from "lucide-react";

interface Order {
    id: string;
    restaurant: string;
    date: string;
    status: 'delivered' | 'processing' | 'cancelled';
    total: number;
    items: { name: string; quantity: number; price: number }[];
}

// Mock data for demonstration
const mockOrders: Order[] = [
    {
        id: "#ORD123456",
        restaurant: "Pizza Palace",
        date: "2024-03-22",
        status: "delivered",
        total: 850,
        items: [
            { name: "Margherita Pizza", quantity: 2, price: 300 },
            { name: "Garlic Bread", quantity: 1, price: 250 },
        ]
    },
    {
        id: "#ORD123457",
        restaurant: "Burger King",
        date: "2024-03-21",
        status: "processing",
        total: 450,
        items: [
            { name: "Whopper", quantity: 2, price: 450 },
        ]
    }
];

export default function Profile() {
    return (
        <div className="container py-8 max-w-4xl mx-auto lg:w-4xl w-dvw md-p-0 p-4">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Orders
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Addresses
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card className="p-6">
                        <div className="max-w-2xl space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-10 w-10 text-primary" />
                                </div>
                                <Button variant="outline" size="sm">
                                    Change Photo
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input defaultValue="John Doe" />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input defaultValue="john@example.com" />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input defaultValue="+91 9876543210" />
                                </div>
                            </div>

                            <Button>Save Changes</Button>
                        </div>
                    </Card>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                    <div className="space-y-4">
                        {mockOrders.map((order) => (
                            <Card key={order.id} className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{order.restaurant}</h3>
                                            <p className="text-sm text-muted-foreground">Order {order.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                <Clock className="inline h-3 w-3 mr-1" />
                                                {new Date(order.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>₹{item.price}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <span className="font-medium">Total Amount</span>
                                        <span className="font-semibold">₹{order.total}</span>
                                    </div>

                                    <Button variant="outline" className="w-full">
                                        View Order Details
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses">
                    <div className="space-y-4">
                        <Card className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold">Home</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        123 Main Street, Apartment 4B
                                        <br />
                                        City, State 12345
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Phone: +91 9876543210
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Set as Default</Button>
                                <Button variant="destructive" size="sm">Delete</Button>
                            </div>
                        </Card>

                        <Card className="p-6 border-dashed">
                            <Button variant="outline" className="w-full">
                                <MapPin className="h-4 w-4 mr-2" />
                                Add New Address
                            </Button>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}