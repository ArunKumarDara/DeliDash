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
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/api/menu";
import { useParams } from "react-router"
import { getRestaurantById } from "@/api/restaurant";


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


export default function RestaurantMenu() {
    const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
    const params = useParams()

    const restaurantId = params.restaurantId ?? ""

    const { data: restaurant, isLoading: isRestaurantLoading } = useQuery({
        queryKey: ["restaurant", restaurantId],
        queryFn: () => getRestaurantById(restaurantId),
        enabled: !!restaurantId,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["menu"],
        queryFn: ({ pageParam = 1 }) => getMenuItems({ restaurantId, pageParam: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
        },
        retry: false,
        staleTime: 1000 * 60 * 5
    })

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

    const isMenuEmpty = data?.pages?.every(page => page.data?.length === 0);
    console.log(restaurant)
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-8">
                {isRestaurantLoading ? <Skeleton className="w-[100px] h-[20px] rounded-full" /> : <>
                    <h1 className="text-3xl text-start font-bold tracking-tight">{restaurant.data.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <span>{restaurant.data.address}</span>
                        <span>•</span>
                        <span>{restaurant.data.phoneNumber}</span>
                        <span>•</span>
                        <Badge variant="secondary">⭐ {restaurant.data.rating}</Badge>
                    </div>
                </>}
            </div>
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
                <div className="hidden lg:block w-[240px] space-y-4 text-start">
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
                    {isLoading ? (
                        <div className="text-center py-8">Loading menu items...</div>
                    ) : isMenuEmpty ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                            <div className="text-6xl">🍽️</div>
                            <h3 className="text-xl font-semibold">No Menu Items Available</h3>
                            <p className="text-muted-foreground text-center max-w-md">
                                Sorry, there are currently no items available in this menu.
                                Please check back later or contact the restaurant for more information.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="mt-4"
                            >
                                Refresh Menu
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8 lg:w-3xl md:w-2xs">
                            {data?.pages.map((page, pageIndex) => (
                                <div key={pageIndex} className="space-y-4">
                                    {page.data.map((item: MenuItem) => (
                                        <MenuItem
                                            key={item.id}
                                            item={item}
                                            onAddToCart={() => addToCart(item)}
                                            onRemoveFromCart={() => removeFromCart(item.id)}
                                            quantity={getItemQuantity(item.id)}
                                        />
                                    ))}
                                </div>
                            ))}
                            {hasNextPage && (
                                <div className="pt-4 pb-8">
                                    <Button
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        {isFetchingNextPage
                                            ? "Loading more items..."
                                            : "Load more items"}
                                    </Button>
                                </div>
                            )}

                            {!hasNextPage && data?.pages[0].data.length > 0 && (
                                <div className="text-center text-muted-foreground py-4">
                                    You've reached the end of the menu
                                </div>
                            )}

                            {data?.pages[0].data.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    No menu items found
                                </div>
                            )}
                        </div>
                    )}
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
        <Card className="group hover:shadow-lg transition-shadow duration-200">
            <div className="flex p-4 gap-4">
                <div className="flex-1 space-y-3">
                    {/* Item Header */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                {/* Veg/Non-veg indicator with better styling */}
                                {item.isVeg ? (
                                    <div className="w-4 h-4 border-2 border-green-600 p-0.5">
                                        <div className="w-full h-full rounded-full bg-green-600" />
                                    </div>
                                ) : (
                                    <div className="w-4 h-4 border-2 border-red-600 p-0.5">
                                        <div className="w-full h-full rounded-full bg-red-600" />
                                    </div>
                                )}
                                <h3 className="font-medium text-base">{item.name}</h3>
                            </div>
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                {item.isBestseller && (
                                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                                        ⭐ Bestseller
                                    </Badge>
                                )}
                                {item.isSpicy && (
                                    <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">
                                        🌶️ Spicy
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <span className="font-semibold text-lg">₹{item.price}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed text-start">
                        {item.description}
                    </p>

                    {/* Add to Cart Button */}
                    <div className="flex justify-end">
                        {quantity > 0 ? (
                            <div className="flex items-center border rounded-lg overflow-hidden cursor-pointer">
                                <Button
                                    onClick={onRemoveFromCart}
                                    variant="ghost"
                                    className="h-9 px-3 hover:bg-primary/10 cursor-pointer"
                                >
                                    -
                                </Button>
                                <span className="w-10 text-center font-medium">{quantity}</span>
                                <Button
                                    onClick={onAddToCart}
                                    variant="ghost"
                                    className="h-9 px-3 hover:bg-primary/10 cursor-pointer"
                                >
                                    +
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={onAddToCart}
                                variant="outline"
                                className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                            >
                                Add to Cart
                            </Button>
                        )}
                    </div>
                </div>
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