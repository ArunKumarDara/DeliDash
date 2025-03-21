import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
} from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RestaurantMenu() {
    const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);

    const addToCart = (item: MenuItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.item.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.item.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: number) => {
        setCart((prevCart) =>
            prevCart
                .map((cartItem) =>
                    cartItem.item.id === itemId
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                )
                .filter((cartItem) => cartItem.quantity > 0)
        );
    };

    const getItemQuantity = (itemId: number) => {
        const item = cart.find((cartItem) => cartItem.item.id === itemId);
        return item ? item.quantity : 0;
    };

    const getTotalPrice = () => {
        return cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Restaurant Info */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Burger King</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <span>American, Fast Food, Burgers</span>
                    <span>•</span>
                    <span>₹400 for two</span>
                    <span>•</span>
                    <Badge variant="secondary">⭐ 4.2</Badge>
                </div>
            </div>

            {/* Search and Cart */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search menu items..." className="pl-8" />
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="ml-4">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <CartSidebar cart={cart} removeFromCart={removeFromCart} total={getTotalPrice()} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Menu Categories and Items */}
            <div className="flex gap-6">
                {/* Categories Navigation */}
                <div className="hidden lg:block w-[240px] space-y-4">
                    <h2 className="font-semibold">Menu Categories</h2>
                    <nav className="space-y-2">
                        {menuCategories.map((category) => (
                            <a key={category.id} href={`#${category.id}`} className="block p-2 rounded-lg hover:bg-accent text-sm">
                                {category.name} ({category.items.length})
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Menu Items */}
                <div className="flex-1 space-y-8">
                    {menuCategories.map((category) => (
                        <section key={category.id} id={category.id} className="scroll-mt-16">
                            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                            <div className="grid gap-4">
                                {category.items.map((item) => (
                                    <MenuItem key={item.id} item={item} onAddToCart={() => addToCart(item)} onRemoveFromCart={() => removeFromCart(item.id)} quantity={getItemQuantity(item.id)} />
                                ))}
                            </div>
                            <Separator className="mt-6" />
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    isVeg: boolean;
    isSpicy?: boolean;
    isBestseller?: boolean;
}

function MenuItem({ item, onAddToCart, onRemoveFromCart, quantity }: { item: MenuItem; onAddToCart: () => void; onRemoveFromCart: () => void; quantity: number }) {
    return (
        <Card className="flex">
            <div className="flex-1 p-4">
                <div className="flex items-center gap-2">
                    {item.isVeg ? <Badge variant="secondary" className="bg-green-100 text-green-700">Veg</Badge> : <Badge variant="secondary" className="bg-red-100 text-red-700">Non-veg</Badge>}
                    {item.isBestseller && <Badge variant="secondary" className="bg-orange-100 text-orange-700">Bestseller</Badge>}
                    {item.isSpicy && <span>🌶️</span>}
                </div>
                <h3 className="font-semibold mt-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="font-semibold">₹{item.price}</span>
                    {quantity > 0 ? (
                        <div className="flex items-center space-x-2">
                            <Button onClick={onRemoveFromCart} variant="ghost"
                                className="h-8 w-8 rounded-none" size="icon">-</Button>
                            <span className="text-lg font-semibold">{quantity}</span>
                            <Button onClick={onAddToCart} variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none">+</Button>
                        </div>
                    ) : (
                        <Button onClick={onAddToCart} size="sm">Add</Button>
                    )}
                </div>
            </div>
            <div className="w-[120px] relative">
                <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover rounded-r-lg" />
            </div>
        </Card>
    );
}

function CartSidebar({ cart, removeFromCart, total }: { cart: { item: MenuItem; quantity: number }[]; removeFromCart: (id: number) => void; total: number }) {
    return (
        <div className="h-full flex flex-col">
            <SheetHeader>
                <SheetTitle>Your Cart ({cart.length} items)</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-4 py-4">
                    {cart.map((cartItem) => (
                        <div key={cartItem.item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {cartItem.item.isVeg ? "🟢" : "🔴"}
                                <p className="font-medium">{cartItem.item.name} ({cartItem.quantity})</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeFromCart(cartItem.item.id)}>Remove</Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">Total: ₹{total}</div>
                <Button className="w-full mt-2">Checkout</Button>
            </div>
        </div>
    );
}

const menuCategories = [
    {
        id: "recommended",
        name: "Recommended",
        items: [
            {
                id: 1,
                name: "Whopper",
                description: "Our signature flame-grilled beef patty topped with fresh lettuce, tomatoes, mayo, and pickles on a sesame seed bun",
                price: 199,
                image: "https://source.unsplash.com/400x300/?burger",
                isVeg: false,
                isBestseller: true,
            },
            // Add more items...
        ],
    },
    {
        id: "burgers",
        name: "Burgers",
        items: [
            {
                id: 2,
                name: "Veg Whopper",
                description: "Plant-based patty with fresh vegetables and our signature sauce",
                price: 169,
                image: "https://source.unsplash.com/400x300/?vegburger",
                isVeg: true,
                isSpicy: true,
            },
            // Add more items...
        ],
    },
    // Add more categories...
]