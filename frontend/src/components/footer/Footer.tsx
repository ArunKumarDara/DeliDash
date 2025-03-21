import { Button } from "@/components/ui/button";

const Footer = () => {
    return (
        <footer className="p-2 bg-background shadow-md text-center border-t border-t-border">
            <p className="text-sm">&copy; {new Date().getFullYear()} Dine-Express. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-1">
                <Button variant="ghost">Privacy Policy</Button>
                <Button variant="ghost">Terms of Service</Button>
                <Button variant="ghost">Contact</Button>
            </div>
        </footer>
    )
}

export default Footer