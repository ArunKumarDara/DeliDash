import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/api/menu";
import { useParams } from "react-router"
import { getRestaurantById } from "@/api/restaurant";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from '@/store/cartSlice';
import type { RootState } from '@/store/store';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useCallback } from "react";
import { debounce } from "lodash"
import { CutlerySpinner } from "@/components/spinner/CutlerySpinner";
import FoodSpinner from "@/components/spinner/FoodSpinner";


interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isVeg: boolean;
    isSpicy?: boolean;
    isBestseller?: boolean;
}


export default function RestaurantMenu() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
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
        queryKey: ["menu", restaurantId, searchQuery, selectedCategory],
        queryFn: ({ pageParam = 1 }) => getMenuItems({
            restaurantId,
            pageParam,
            search: searchQuery,
            category: selectedCategory
        }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
        },
        retry: false,
        staleTime: 1000 * 60 * 5
    });

    // Debounce search to prevent too many API calls
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchQuery(value);
        }, 500),
        []
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    };

    const isMenuEmpty = data?.pages?.every(page => page.data?.length === 0);
    return (
        <div className="container mx-auto py-4">
            <div className="md:mb-8">
                {isRestaurantLoading ? <Skeleton className="w-[100px] h-[20px] rounded-full text-start" /> : <div className="p-4 md:p-0">
                    <h1 className="text-3xl text-start font-bold tracking-tight">{restaurant.data.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <span>{restaurant.data.address}</span>
                        <span>•</span>
                        <span>{restaurant.data.phoneNumber}</span>
                        <span>•</span>
                        <Badge variant="secondary">⭐ {restaurant.data.rating}</Badge>
                    </div>
                </div>}
            </div>
            {/* <Separator className="text-gray-500 mb-3" /> */}
            <div className="flex items-center justify-between mb-3 p-4 md:p-0 gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search menu items..."
                        className="pl-8"
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="lg:hidden flex-shrink-0">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10"
                                >
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-[200px] p-2"
                                align="end"
                            >
                                <nav className="space-y-1">
                                    {menuCategories.map((category) => (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "secondary" : "ghost"}
                                            className="w-full justify-start h-9 font-normal text-sm"
                                            onClick={() => handleCategorySelect(category.id)}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </nav>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            {/* Menu Categories and Items */}
            <div className="flex gap-6">
                {/* Desktop Categories */}
                <div className="hidden lg:block w-[240px] space-y-4 text-start">
                    <h2 className="font-semibold">Menu Categories</h2>
                    <nav className="space-y-2">
                        {menuCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategorySelect(category.id)}
                                className={`block w-full text-start p-2 rounded-lg text-sm transition-colors ${selectedCategory === category.id
                                    ? 'bg-accent text-accent-foreground'
                                    : 'hover:bg-accent/50'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Menu Items */}
                <div className="space-y-8">
                    {isLoading ? (
                        <div className="lg:w-3xl md:w-2xs"><FoodSpinner /></div>
                    ) : isMenuEmpty ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 lg:w-3xl md:w-2xs w-dvw p-4 md:p-0">
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
                        <div className="space-y-8 lg:w-3xl md:w-2xs w-dvw p-4 md:p-0">
                            {/* Active filters display */}
                            {(searchQuery || selectedCategory) && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {searchQuery && (
                                        <Badge variant="secondary" className="gap-1">
                                            Search: {searchQuery}
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="ml-1 hover:text-foreground"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    )}
                                    {selectedCategory && (
                                        <Badge variant="secondary" className="gap-1">
                                            {menuCategories.find(c => c.id === selectedCategory)?.name}
                                            <button
                                                onClick={() => setSelectedCategory("")}
                                                className="ml-1 hover:text-foreground"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Menu items list */}
                            {data?.pages.map((page, pageIndex) => (
                                <div key={pageIndex} className="space-y-4">
                                    {page.data.map((item: MenuItem) => (
                                        <MenuItem
                                            key={item._id}
                                            item={item}
                                            restaurant={restaurant.data}
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
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isVeg: boolean;
    isSpicy?: boolean;
    isBestseller?: boolean;
}
interface Restaurant {
    _id: string;
    name: string;
    address: string;
    phoneNumber: string;
    cuisineType: string;
    rating: number;
    location?: string;
}

function MenuItem({ item, restaurant }: { item: MenuItem, restaurant: Restaurant }) {
    const dispatch = useDispatch();
    const cartItem = useSelector((state: RootState) =>
        state.cart.items.find(i => i.item._id === item._id)
    );
    const quantity = cartItem?.quantity || 0;
    return (
        <Card className="group hover:shadow-lg transition-shadow duration-200">
            <div className="flex p-4 gap-4">
                <div className="flex-1 space-y-3">
                    {/* Item Header */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
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
                                    onClick={() => dispatch(removeFromCart(item._id))}
                                    variant="ghost"
                                    className="h-9 px-3 hover:bg-primary/10 cursor-pointer"
                                >
                                    -
                                </Button>
                                <span className="w-10 text-center font-medium">{quantity}</span>
                                <Button
                                    onClick={() => dispatch(addToCart({ item, restaurant }))}
                                    variant="ghost"
                                    className="h-9 px-3 hover:bg-primary/10 cursor-pointer"
                                >
                                    +
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => dispatch(addToCart({ item, restaurant }))}
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

const menuCategories = [
    {
        id: "recommended",
        name: "Recommended",
    },
    {
        id: "bestSellers",
        name: "Best Sellers"
    },
    {
        id: "veg",
        name: "Veg",
    },
    {
        id: "nonVeg",
        name: "Non-Veg"
    }, {
        id: "spicy",
        name: "Spicy"
    }
]