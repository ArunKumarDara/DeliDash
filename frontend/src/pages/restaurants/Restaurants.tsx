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

export default function Restaurants() {
    const [priceRange, setPriceRange] = useState([0, 1000])

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

                {/* Search and Filter */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} {...restaurant} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}






// Sample Data
const restaurants = [
    {
        id: 1,
        name: "Burger King",
        image: "/buregrking.jpg",
        cuisines: ["American", "Fast Food", "Burgers"],
        rating: 4.2,
        deliveryTime: 25,
        priceForTwo: 400,
        offers: ["50% off up to ₹100", "Free delivery"],
        isPromoted: true,
    },
    {
        id: 2,
        name: "Pizza Hut",
        image: "https://source.unsplash.com/800x600/?pizza",
        cuisines: ["Italian", "Pizza", "Fast Food"],
        rating: 4.0,
        deliveryTime: 35,
        priceForTwo: 600,
        offers: ["20% off on large pizzas"],
        isPromoted: false,
    },
    // Add more restaurants...
]