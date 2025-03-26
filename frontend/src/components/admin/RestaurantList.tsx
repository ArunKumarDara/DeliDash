// src/app/components/admin/RestaurantList.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRestaurant, getRestaurants } from "@/api/restaurant";
import RestaurantCard from "./RestaurantCard";
import RestaurantForm from "./RestaurantForm";
import { toast } from "sonner";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Restaurant {
    _id: string;
    name: string;
    status: string;
    address?: string;
    phoneNumber?: string;
    rating?: number;
}

export default function RestaurantList() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
    const [restaurantToDelete, setRestaurantToDelete] = useState<string | null>(null);
    const queryClient = useQueryClient()

    const {
        data: restaurantsData,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error: fetchingRestaurantError,
    } = useInfiniteQuery({
        queryKey: ["restaurants"],
        queryFn: ({ pageParam = 1 }) => getRestaurants({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    const {
        mutate: deleteRestaurantMutation,
        isPending: isDeleting,
        // isError: deleteError,
    } = useMutation({
        mutationFn: (restaurantId: string) => deleteRestaurant(restaurantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurants"] });
            toast.success("Restaurant deleted successfully");
        },
        onError: (error) => {
            toast.error(`Failed to delete restaurant: ${error.message}`);
        },
    });

    const handleDelete = () => {
        if (restaurantToDelete) {
            deleteRestaurantMutation(restaurantToDelete);
        }
    };

    const allRestaurants = restaurantsData?.pages.flatMap((page) => page.data) || [];



    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Restaurants</CardTitle>
                    <CardDescription>Manage your restaurant partners and their menus</CardDescription>
                </div>
                <RestaurantForm
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    restaurant={editingRestaurant}
                    trigger={
                        <Button size="sm" className="gap-1">
                            <Plus className="h-4 w-4" /> Add Restaurant
                        </Button>
                    }
                />
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div>Loading restaurants...</div>
                ) : fetchingRestaurantError ? (
                    <div>Error: {fetchingRestaurantError.message}</div>
                ) : (
                    <>
                        {allRestaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                                onEdit={() => setEditingRestaurant(restaurant)}
                                onDelete={() => setRestaurantToDelete(restaurant._id)}
                                isDeleting={isDeleting}
                            />
                        ))}
                        {hasNextPage && (
                            <div className="mt-4 flex justify-center">
                                <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                    {isFetchingNextPage ? "Loading..." : "Load More"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
            <AlertDialog open={!!restaurantToDelete} onOpenChange={() => setRestaurantToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this restaurant? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRestaurantToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}