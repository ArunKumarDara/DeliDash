import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddress } from "@/api/address";
import { toast } from "sonner"

// Validation Schema
const addressSchema = z.object({
    receiverName: z.string().min(5, "name is too short"),
    address: z.string().min(5, "Address is too short"),
    phoneNumber: z.string().min(10, "Invalid phone number"),
    type: z.enum(["Home", "Office", "Other"]),
    isDefault: z.boolean(),
});

// Form Data Type
type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressForm({
    openAddressForm,
    setOpenAddressForm,
}: {
    openAddressForm: boolean;
    setOpenAddressForm: (val: boolean) => void;
}) {
    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            address: "",
            phoneNumber: "",
            type: "Home",
            isDefault: false,
        },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: addAddress,
        onSuccess: () => {
            toast("Address added successfully!");
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            form.reset();// Refresh addresses
            setOpenAddressForm(false); // Close modal
        },
        onError: (error) => {
            toast(error.message || "Failed to add address.");
        },
    });

    const onSubmit = (data: AddressFormData) => {
        mutate(data);
    };

    return (
        <Dialog open={openAddressForm} onOpenChange={setOpenAddressForm}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Address Field */}
                        <FormField
                            control={form.control}
                            name="receiverName"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Receiver Name</Label>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter receiver name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Address</Label>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your address" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone Number Field */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Phone Number</Label>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter phone number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address Type Dropdown */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Address Type</Label>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Home">Home</SelectItem>
                                            <SelectItem value="Office">Office</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Default Address Switch */}
                        <FormField
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <Label>Set as Default</Label>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit & Cancel Buttons */}
                        <div className="flex gap-2">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <span className="flex gap-1 items-center">
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                    <span className="dot w-2 h-2 bg-white rounded-full animate-bounce"></span>
                                </span> : "Save Address"}
                            </Button>
                            <Button variant="outline" onClick={() => setOpenAddressForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
