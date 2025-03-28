import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Edit2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteAddress, setDefaultAddress } from "@/api/address";
import { toast } from "sonner";
import AddressForm from "@/components/address/AddressForm";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Address {
    _id: string;
    receiverName: string;
    phoneNumber: string;
    address: string;
    type: string;
    isDefault: boolean;
}

interface AddressesTabProps {
    addresses: Address[];
    isLoading: boolean;
    isError: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    refetch: () => void;
}

export function AddressesTab({
    addresses,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
}: AddressesTabProps) {
    const queryClient = useQueryClient();
    const [openAddressForm, setOpenAddressForm] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

    const deleteMutation = useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success("Address deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete address");
        },
    });

    const setDefaultMutation = useMutation({
        mutationFn: setDefaultAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success("Default address updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to set default address");
        },
    });

    const handleConfirmDelete = () => {
        if (addressToDelete) {
            deleteMutation.mutate(addressToDelete);
        }
        setDeleteDialogOpen(false);
    };

    const handleDeleteClick = (addressId: string) => {
        setAddressToDelete(addressId);
        setDeleteDialogOpen(true);
    };

    const handleSetDefault = (addressId: string) => {
        setDefaultMutation.mutate(addressId);
    };

    const handleEditClick = () => {
        toast.info("Address editing feature is coming soon!", {
            description: "You'll be able to edit your addresses in the next update.",
        });
    };

    if (isLoading && !isFetchingNextPage) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                    <Card key={i} className="p-6">
                        <div className="animate-pulse flex flex-col gap-4">
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            <div className="flex gap-2 mt-4">
                                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <Card className="p-6">
                <div className="text-center space-y-2">
                    <AlertTriangle className="h-8 w-8 mx-auto text-red-500" />
                    <h3 className="font-medium">Failed to load addresses</h3>
                    <p className="text-sm text-muted-foreground">
                        There was an error loading your addresses. Please try again.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                        Retry
                    </Button>
                </div>
            </Card>
        );
    }

    if (addresses.length === 0) {
        return (
            <Card className="p-6">
                <div className="text-center space-y-2">
                    <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                    <h3 className="font-medium">No addresses saved</h3>
                    <p className="text-sm text-muted-foreground">
                        Add an address to make ordering faster
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {addresses.map((address) => (
                <Card key={address._id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold">{address.type}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {address.receiverName}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {address.address}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Phone: {address.phoneNumber}
                            </p>
                            {address.isDefault && (
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                    Default
                                </span>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleEditClick}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {!address.isDefault && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(address._id)}
                                disabled={setDefaultMutation.isPending}
                            >
                                {setDefaultMutation.isPending ? (
                                    <span className="flex items-center gap-1">
                                        <span className="dot w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                        <span className="dot w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                        <span className="dot w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                                    </span>
                                ) : (
                                    "Set as Default"
                                )}
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(address._id)}
                            disabled={deleteMutation.isPending || address.isDefault}
                        >
                            Delete
                        </Button>
                    </div>
                </Card>
            ))}

            {hasNextPage && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="w-full sm:w-auto"
                    >
                        {isFetchingNextPage ? (
                            <span className="flex items-center gap-2">
                                <span className="dot w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                <span className="dot w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                <span className="dot w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                            </span>
                        ) : (
                            "Load More Addresses"
                        )}
                    </Button>
                </div>
            )}

            <Card className="p-6 border-dashed">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpenAddressForm(true)}
                >
                    <MapPin className="h-4 w-4 mr-2" />
                    Add New Address
                </Button>
            </Card>

            <AddressForm
                openAddressForm={openAddressForm}
                setOpenAddressForm={setOpenAddressForm}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this
                            address.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <span className="flex items-center gap-1">
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce"></span>
                                </span>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}