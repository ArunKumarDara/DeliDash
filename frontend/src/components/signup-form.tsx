import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Link } from "react-router"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function SignForm({ className, ...props }: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Register your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your name and phone number below to register your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="eg: Arun Kumar" required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="number" placeholder="1234567890" required />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="mpin">M-PIN</Label>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm">This MPIN is required for future logins.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <InputOTP maxLength={6}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <Button type="submit" className="w-full">
                    Sign Up
                </Button>
            </div>
            <div className="text-center text-sm">
                Already have an account?
                <Link to="/login" className="ml-1 underline text-blue-600 hover:text-blue-800">
                    Login
                </Link>
            </div>
        </form>
    )
}

