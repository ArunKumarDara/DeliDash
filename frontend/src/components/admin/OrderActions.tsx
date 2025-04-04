// src/app/components/admin/OrderActions.tsx
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Clock, Check, Truck } from "lucide-react";

interface OrderActionsProps {
    orderId: string;
    onStatusChange: (orderId: string, newStatus: string) => void;
}

export default function OrderActions({ orderId, onStatusChange }: OrderActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => onStatusChange(orderId, "pending")}
                    className="flex items-center gap-2"
                >
                    <Clock className="h-4 w-4" /> Set as Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onStatusChange(orderId, "accepted")}
                    className="flex items-center gap-2"
                >
                    <Check className="h-4 w-4" /> Accept Order
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onStatusChange(orderId, "on the way")}
                    className="flex items-center gap-2"
                >
                    <Truck className="h-4 w-4" /> Mark as On The Way
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onStatusChange(orderId, "delivered")}
                    className="flex items-center gap-2"
                >
                    <Check className="h-4 w-4" /> Mark as Delivered
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}