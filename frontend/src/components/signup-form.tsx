import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, } from '@tanstack/react-query'
import { signupUser } from "../api/user"
import { toast } from "sonner"

const formSchema = z.object({
    userName: z.string().min(3, { message: "Username must be at least 3 characters" }),
    phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
    mPin: z.string().length(6, { message: "MPIN must be exactly 6 digits" }).regex(/^\d+$/, {
        message: "MPIN must be numeric",
    }),
});

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {

    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
            phoneNumber: "",
            mPin: "",
        },
    });


    const { mutate, isPending } = useMutation({
        mutationFn: signupUser,
        onSuccess: (data) => {
            toast("Signup successful! 🎉");
            navigate("/login")
            console.log("User signed up:", data);
        },
        onError: (error: Error) => {
            toast(error.message)
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutate(values)
    };

    return (
        <Form {...form}>
            <form
                className={cn("flex flex-col gap-6", className)}
                {...props}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Register your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your name & phone number below to register your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="userName">Name</Label>
                                <FormControl>
                                    <Input id="userName" type="text" placeholder="Arun Kumar" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <FormControl>
                                    <Input id="phoneNumber" type="text" placeholder="1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mPin"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="password">M-PIN</Label>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
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
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        {isPending ? <span className="flex gap-1 items-center">
                            <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                            <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                            <span className="dot w-2 h-2 bg-white rounded-full animate-bounce"></span>
                        </span> : "Sign Up"}
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Already have an account?
                    <Link to="/login" className="ml-1 underline text-blue-600 hover:text-blue-800">
                        Login
                    </Link>
                </div>
            </form>
        </Form>
    );
}
