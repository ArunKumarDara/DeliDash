import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router"
import { FC } from "react"

interface Restaurant {
    _id: string;
    name: string;
    address: string;
    phoneNumber: string;
    cuisineType: string;
    rating: number[];
    location?: string;
    priceRange: number
}

const RestaurantCard: FC<Restaurant> = ({ _id, name, address, phoneNumber, cuisineType, rating }) => {
    const navigate = useNavigate()

    return (
        <Card key={_id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate(`/restaurants/${_id}`)} >
            <div className="relative" key={_id}>
                <img
                    src={`https://via.placeholder.com/400x200?text=${name}`} // Placeholder image
                    alt={name}
                    className="w-full h-[150px] object-cover"
                />
            </div>

            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-5 w-full">
                    <div>
                        <CardTitle className="text-lg">{name}</CardTitle>
                        <CardDescription className="line-clamp-1">
                            {cuisineType}
                        </CardDescription>
                    </div>
                    <Badge variant={rating[1] >= 4.0 ? "default" : "secondary"}>
                        ⭐ {rating}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-center gap-4 justify-between text-sm">
                    <span className="text-muted-foreground">{address}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-muted-foreground">{phoneNumber}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default RestaurantCard;
