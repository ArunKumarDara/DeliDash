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
    priceRange: number;
    avatar: string
}

const RestaurantCard: FC<Restaurant> = ({ _id, name, address, phoneNumber, cuisineType, rating, avatar }) => {
    const navigate = useNavigate()

    return (
        <Card key={_id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate(`/restaurants/${_id}`)} >
            <div className="relative" key={_id}>
                <img
                    src={avatar}
                    alt={name}
                    className="w-full h-[200px] object-cover"
                />
            </div>

            <CardHeader>
                <div className="flex justify-between items-start gap-5 w-full">
                    <div className="flex flex-col items-start">
                        <CardTitle className="text-lg text-start">{name}</CardTitle>
                        <CardDescription className="line-clamp-1 text-center">
                            {cuisineType}
                        </CardDescription>
                    </div>
                    <Badge variant={rating[1] >= 4.0 ? "default" : "secondary"}>
                        ⭐ {rating}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col items-center gap-1 justify-between text-sm">
                    <span className="text-muted-foreground">{address}</span>
                    <span className="text-muted-foreground">{`+91 ${phoneNumber}`}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default RestaurantCard;
