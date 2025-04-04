// src/app/components/admin/RestaurantCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils, ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/api/menu";
import MenuItemsTable from "./MenuItemsTable";

interface Restaurant {
    _id: string;
    name: string;
    status: string;
    address?: string;
    phoneNumber?: string;
    rating?: number;
}

export default function RestaurantCard({ restaurant, onDelete, isDeleting }: {
    restaurant: Restaurant;
    onDelete: (id: string) => void;
    onEdit: () => void;
    isDeleting: boolean;
}) {
    const [showMenu, setShowMenu] = useState(false);

    const {
        data: menuItems,
        isLoading: isMenuLoading,
        error: menuError,
        refetch: refetchMenu,
    } = useQuery({
        queryKey: ["menu", restaurant._id],
        queryFn: () =>
            getMenuItems({
                restaurantId: restaurant._id,
                pageParam: 1,
                search: "",
                category: "",
            }),
        enabled: showMenu,
        staleTime: 1000 * 60 * 5,
    });

    const handleClick = () => {
        setShowMenu(!showMenu);
    };

    return (
        <Card>
            <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer"
                onClick={handleClick}
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-md bg-secondary">
                        <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="mb-2">{restaurant.name}</CardTitle>
                        <div
                            className={`px-2 py-1 rounded-full text-xs ${restaurant.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                        >
                            {restaurant.status ? "Active" : "Inactive"}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            // onEdit();
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(restaurant._id);
                        }}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : <Trash2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClick}
                    >
                        {showMenu ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>

            {showMenu && (
                <CardContent className="space-y-4">
                    <MenuItemsTable
                        restaurant={restaurant}
                        menuItems={menuItems?.data}
                        isLoading={isMenuLoading}
                        error={menuError}
                        refetchMenu={refetchMenu}
                    />
                </CardContent>
            )}
        </Card>
    );
}