import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router"

interface RestaurantProps {
    name: string;
    image: string;
    cuisines: string[];
    rating: number;
    deliveryTime: number;
    priceForTwo: number;
    offers?: string[];
    isPromoted?: boolean;
}

export default function RestaurantCard({ name, image, cuisines, rating, deliveryTime, priceForTwo, offers, isPromoted }: RestaurantProps) {
    const navigate = useNavigate()
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all" onClick={() => navigate(`/restaurants/${name}`)}>
            <div className="relative">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-[200px] object-cover"
                />
                {isPromoted && (
                    <Badge className="absolute top-2 left-2" variant="secondary">
                        Promoted
                    </Badge>
                )}
                {offers && offers.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-sm p-2 rounded">
                        <p className="line-clamp-1">🎉 {offers[0]}</p>
                    </div>
                )}
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="line-clamp-1">
                    {cuisines.join(", ")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                        <Badge variant={rating >= 4.0 ? "default" : "secondary"}>
                            ⭐ {rating}
                        </Badge>
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{deliveryTime} mins</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">₹{priceForTwo} for two</span>
                </div>
            </CardContent>
        </Card>
    )
}