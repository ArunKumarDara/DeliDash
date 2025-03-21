import {
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"


interface FilterSidebarProps {
    priceRange: number[];
    setPriceRange: (value: [number, number]) => void;
    isSheet?: boolean;
    selectedCuisines: string[];
    setSelectedCuisines: (selectedCuisines: string[]) => void;
    selectedRatings: number[];
    setSelectedRatings: (selectedRatings: number[]) => void;
}

export default function FilterSidebar({ priceRange, setPriceRange, selectedCuisines, setSelectedCuisines, selectedRatings, setSelectedRatings, isSheet }: FilterSidebarProps) {

    const handleCuisineChange = (cuisine: string) => {
        const newSelectedCuisines = selectedCuisines.includes(cuisine)
            ? selectedCuisines.filter((item) => item !== cuisine)
            : [...selectedCuisines, cuisine];
        setSelectedCuisines(newSelectedCuisines);
    };

    const handleRatingChange = (rating: number) => {
        const newSelectedRatings = selectedRatings.includes(rating)
            ? selectedRatings.filter((item) => item !== rating)
            : [...selectedRatings, rating];
        setSelectedRatings(newSelectedRatings);
    };


    return (
        <div className="space-y-6 p-6">
            {isSheet && (
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
            )}
            <div className="space-y-4">
                <h3 className="font-medium">Cuisines</h3>
                <ScrollArea className="h-[100px]">
                    <div className="space-y-3">
                        {cuisines.map((cuisine) => (
                            <div key={cuisine} className="flex items-center space-x-2">
                                <Checkbox id={cuisine}
                                    checked={selectedCuisines.includes(cuisine)}
                                    onCheckedChange={() => handleCuisineChange(cuisine)}
                                />
                                <label
                                    htmlFor={cuisine}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {cuisine}
                                </label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="font-medium">Price Range</h3>
                <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={50}
                    value={priceRange}
                    onValueChange={setPriceRange}
                />
                <div className="flex items-center justify-between">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                </div>
            </div>

            {/* Ratings */}
            <div className="space-y-4">
                <h3 className="font-medium">Rating</h3>
                <div className="space-y-3">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                            <Checkbox id={`rating-${rating}`} checked={selectedRatings.includes(rating)}
                                onCheckedChange={() => handleRatingChange(rating)} />
                            <label
                                htmlFor={`rating-${rating}`}
                                className="text-sm font-medium leading-none"
                            >
                                {rating}+ ⭐
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


const cuisines = [
    "Indian",
    "Chinese",
    "Fast Food",
    "Other"
]