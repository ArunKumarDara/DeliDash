import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CookingPot, Menu } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router";
import { Cart } from "../cart/Cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface User {
    phoneNumber: string,
    userName: string,
    mPin: string
}

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    return (
        <nav className="flex items-center justify-between p-2 md:px-8 px-4 bg-background border-b border-b-border fixed top-0 w-full left-0 z-50">
            <NavLink to="/" className="flex items-center gap-2 self-center font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <CookingPot className="size-4" />
                </div>
                <div className="font-semibold">Dine-Express</div>
            </NavLink>
            <div className="hidden md:flex gap-6">
                <Link to="/restaurants"><Button className="cursor-pointer" variant="ghost">Restaurants</Button></Link>
                <Link to="/grocery"><Button className="cursor-pointer" variant="ghost">Grocery</Button></Link>
                <Link to="/bakes"><Button className="cursor-pointer" variant="ghost">Bakes</Button></Link>
            </div>
            <div className="flex items-center gap-4">
                <Toggle />
                <Cart />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                            <AvatarFallback>{user?.userName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="md:hidden">
                            <Menu className="size-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-6">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">Menu</span>
                        </div>
                        <div className="flex flex-col gap-4 mt-6">
                            <Link to="/restaurants" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Restaurants</Link>
                            <Link to="/grocery" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Grocery</Link>
                            <Link to="/bakes" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Bakes</Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}