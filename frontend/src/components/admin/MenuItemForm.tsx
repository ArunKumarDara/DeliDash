import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Ensure axios instance is correctly set up

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { addMenuItem } from "@/api/menu";
import { useState } from "react";

// Validation Schema using Zod
const menuItemSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    description: z.string().optional().default(""), // Ensure a default empty string
    isVeg: z.boolean(),
    available: z.boolean(),
    isBestseller: z.boolean(),
    isSpicy: z.boolean(),
});

type MenuItemSchema = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
    restaurantId: string;
    restaurantName: string;
    trigger: React.ReactNode;
}

export default function MenuItemForm({
    restaurantId,
    restaurantName,
    trigger,
}: MenuItemFormProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    // useMutation for posting menu item
    const { mutate, isPending } = useMutation({
        mutationFn: (menuItemData: MenuItemSchema & { restaurantId: string }) =>
            addMenuItem(menuItemData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu", restaurantId] });
            form.reset()
            setOpen(false);
        },
    });

    // React Hook Form setup
    const form = useForm<MenuItemSchema>({
        resolver: zodResolver(menuItemSchema),
        defaultValues: {
            name: "",
            price: 0,
            description: "", // Ensure description is always a string
            isVeg: false,
            available: true,
            isBestseller: false,
            isSpicy: false,
        },
    });

    const onSubmit = async (values: MenuItemSchema) => {
        mutate({
            ...values,
            restaurantId,
            description: values.description || "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Menu Item to {restaurantName}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Item Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="number" placeholder="Price" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="isVeg"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                Vegetarian
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="available"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                Available
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isBestseller"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                Bestseller
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isSpicy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                Spicy
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Adding..." : "Add Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
