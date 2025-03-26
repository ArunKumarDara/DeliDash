// src/app/components/admin/AdminSettings.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Configure your admin preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h3 className="font-medium">System Preferences</h3>
                    <div className="flex items-center space-x-2">
                        <Input placeholder="Delivery Fee" className="w-32" />
                        <Button variant="outline">Update</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Notification Settings</h3>
                    <div className="flex items-center space-x-2">
                        <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                            <option>Email Notifications</option>
                            <option>SMS Notifications</option>
                            <option>Push Notifications</option>
                        </select>
                        <Button variant="outline">Save</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Security</h3>
                    <Button variant="outline">Change Password</Button>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button variant="outline">Save All Settings</Button>
            </CardFooter>
        </Card>
    );
}