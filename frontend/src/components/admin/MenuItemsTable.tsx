// src/app/components/admin/MenuItemsTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Edit, Trash, RefreshCw } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import MenuItemForm from "./MenuItemForm";

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    isVeg?: boolean;
    isSpicy?: boolean;
    isBestseller?: boolean;
}

interface MenuItemsTableProps {
    restaurant: {
        _id: string;
        name: string;
    };
    menuItems: MenuItem[];
    isLoading: boolean;
    error: Error | null;
    refetchMenu: () => void;
}

export default function MenuItemsTable({
    restaurant,
    menuItems = [],
    isLoading,
    error,
    refetchMenu
}: MenuItemsTableProps) {

    return (
        <>
            <div className="flex justify-between items-center">
                <h4 className="font-medium">Menu Items</h4>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchMenu()}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <MenuItemForm
                        restaurantName={restaurant.name}
                        restaurantId={restaurant._id}
                        trigger={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" /> Add Item
                            </Button>
                        }
                    />
                </div>
            </div>

            {isLoading ? (
                <div>Loading menu items...</div>
            ) : error ? (
                <div>Error loading menu: {error.message}</div>
            ) : menuItems.length ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>₹{item.price}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                            >
                                                <Trash className="h-4 w-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                    No menu items found for this restaurant
                </div>
            )}
        </>
    );
}