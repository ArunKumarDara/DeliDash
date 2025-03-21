import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import RestaurantCard from "./RestaurantCard"
import FilterSidebar from "./FilterSidebar"
import { useInfiniteQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/api/restaurant"

interface Restaurant {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
    cuisineType: string;
    rating: number;
    location?: string;
}

export default function Restaurants() {
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["restaurants", searchTerm],
        queryFn: ({ pageParam }) => getRestaurants({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        <div className="container mx-auto py-6 max-w-6xl">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
                    <p className="text-muted-foreground mt-1">
                        Discover restaurants in your area
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="flex w-full md:w-[300px]">
                        <Input
                            placeholder="Search restaurants..."
                            className="rounded-r-none"
                        />
                        <Button variant="secondary" className="rounded-l-none">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <FilterSidebar
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Desktop Filters Sidebar */}
                <div className="hidden md:block w-[240px] flex-shrink-0">
                    <FilterSidebar
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />
                </div>

                {/* Restaurant Grid */}
                <div className="flex-1">
                    {/* Sort Options */}
                    <div className="flex justify-end mb-4">
                        <Select defaultValue="recommended">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recommended">Recommended</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                                <SelectItem value="delivery-time">Delivery Time</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Restaurant Cards Grid */}
                    {isLoading ? <div>loading....</div> :
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data?.pages.map((page) =>
                                page.data.map((restaurant: Restaurant) => (
                                    <RestaurantCard key={restaurant.id} {...restaurant} />
                                ))
                            )}
                        </div>}

                    {hasNextPage && (
                        <div className="flex justify-center mt-6">
                            <Button
                                variant="outline"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
