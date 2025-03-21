import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, CookingPot } from "lucide-react";
import { NavLink, Link } from "react-router";

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

    console.log(user)

    return (
        <nav className="flex items-center justify-between p-2 md:px-8 px-4 bg-background border-b border-b-border fixed top-0 w-full left-0 z-50">
            <NavLink to="/" className="flex items-center gap-2 self-center font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <CookingPot className="size-4" />
                </div>
                <div className="font-semibold">Dine-Express</div>
            </NavLink>
            <div className="hidden md:flex gap-6">
                <Link to="/"><Button className="cursor-pointer" variant="ghost">Home</Button></Link>
                <Link to="/restaurants"><Button className="cursor-pointer" variant="ghost">Restaurants</Button></Link>
                <Link to="/grocery"><Button className="cursor-pointer" variant="ghost">Grocery</Button></Link>
                <Link to="/bakes"><Button className="cursor-pointer" variant="ghost">Bakes</Button></Link>
            </div>
            <div className="flex items-center gap-4">
                <Toggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                            <AvatarFallback>{user?.userName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <Menu />
                </Button>
            </div>
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-background shadow-md flex flex-col items-center gap-4 p-4 md:hidden">
                    <Button variant="ghost">Home</Button>
                    <Button variant="ghost">Services</Button>
                    <Button variant="ghost">Pricing</Button>
                    <Button variant="ghost">Contact</Button>
                </div>
            )}
        </nav>
    );
}