import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Edit2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/api/user";
import { loginUser } from "@/store/userSlice";

interface ProfileTabProps {
    user: {
        userName: string;
        phoneNumber: string;
        createdAt: string;
    };
}

export function ProfileTab({ user }: ProfileTabProps) {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        userName: user?.userName || "",
        phoneNumber: user?.phoneNumber || "",
    });

    const { mutate, isPending, isError } = useMutation({
        mutationFn: updateUser,
        onSuccess: (updatedUser) => {
            dispatch(loginUser(updatedUser.user));
            setFormData(updatedUser.user);
            setIsEditing(false);
        },
        onError: (error) => {
            console.error("Update failed", error);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        mutate(formData);
    };

    if (!isEditing) {
        return (
            <Card className="p-6">
                <div className="max-w-2xl space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-10 w-10 text-primary" />
                            </div>
                            <div className="flex flex-col justify-start items-start">
                                <h2 className="text-2xl font-semibold">{user?.userName}</h2>
                                <p className="text-sm text-muted-foreground">Member since {user?.createdAt}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            className="flex items-end gap-2"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </Button>
                    </div>

                    <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-10 w-10 text-primary" />
                    </div>
                    <Button variant="outline" size="sm">
                        Change Photo
                    </Button>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input name="userName" value={formData.userName} onChange={handleChange} />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-sm font-medium">Phone</label>
                        <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    </div>
                </div>

                {isError && (
                    <p className="text-sm text-red-500">
                        Failed to update profile. Please try again.
                    </p>
                )}

                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending ? (
                            <span className="flex gap-1 items-center">
                                <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                <span className="dot w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                <span className="dot w-2 h-2 bg-white rounded-full animate-bounce"></span>
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Card>
    );
}