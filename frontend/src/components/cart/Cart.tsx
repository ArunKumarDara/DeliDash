import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromCart, addToCart } from "@/store/cartSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router";

export function Cart() {
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Dine Cart
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {items.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] flex flex-col px-4">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>

                {/* Scrollable Cart Items */}
                <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto pr-2">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-12 w-12 mb-4" />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            {items.map((cartItem) => (
                                <div key={cartItem.item._id} className="p-4 border-b">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-6">
                                                    <p className="font-semibold text-md">{cartItem.item.name}</p>
                                                    <p className="text-sm text-gray-500">{cartItem.restaurant.name}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-primary">₹{cartItem.item.price}</p>
                                            </div>

                                            <p className="text-sm text-muted-foreground">{cartItem.item.description}</p>

                                            <div className="flex items-center gap-3 mt-3">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => dispatch(removeFromCart(cartItem.item._id))}
                                                >
                                                    -
                                                </Button>
                                                <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        dispatch(addToCart({ item: cartItem.item, restaurant: cartItem.restaurant }))
                                                    }
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Checkout Section Stays at Bottom */}
                {items.length > 0 && (
                    <div className="pt-4 pb-3 sticky bottom-0">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <SheetClose asChild>
                            <Button className="w-full mt-4" onClick={() => navigate("/checkout")}>Checkout</Button>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
