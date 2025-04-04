// src/app/components/admin/AdminDashboard.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Utensils, ListOrdered, Settings } from "lucide-react";
import RestaurantList from "@/components/admin/RestaurantList"
import OrdersTable from "../../components/admin/OrdersTable"
import AdminSettings from "@/components/admin/AdminSettings"

export default function AdminDashboard() {
    return (
        <div className="p-4 md:p-6">
            <Tabs defaultValue="restaurants" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="restaurants" className="flex gap-2">
                        <Utensils className="h-4 w-4" /> Restaurants
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex gap-2">
                        <ListOrdered className="h-4 w-4" /> Orders
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex gap-2">
                        <Settings className="h-4 w-4" /> Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="restaurants" className="space-y-4">
                    <RestaurantList />
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <OrdersTable />
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <AdminSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}