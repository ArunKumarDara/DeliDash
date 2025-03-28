import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Package, User } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getOrdersByUserId } from "@/api/order";
import { fetchAddresses } from "@/api/address";
import { ProfileTab } from "./ProfileTab";
import { OrdersTab } from "./OrdersTab";
import { AddressesTab } from "./AddressesTab";

export default function Profile() {
    const { user } = useSelector((state: RootState) => state.user);

    const {
        data: ordersData,
        isLoading: isOrderLoading,
        isError: isOrderError,
        isFetchingNextPage: isOrderFetchingNextPage,
        hasNextPage: hasOrderNextPage,
        fetchNextPage: fetchOrderNextPage,
        refetch: refetchOrders,
    } = useInfiniteQuery({
        queryKey: ["orders"],
        queryFn: ({ pageParam }) =>
            getOrdersByUserId({
                pageParam,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: addressesData,
        isLoading: isAddressLoading,
        isError: isAddressError,
        isFetchingNextPage: isAddressFetchingNextPage,
        hasNextPage: hasAddressNextPage,
        fetchNextPage: fetchAddressNextPage,
        refetch: refetchAddresses,
    } = useInfiniteQuery({
        queryKey: ["addresses"],
        queryFn: ({ pageParam = 1 }) => fetchAddresses(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const isEmptyOrder = ordersData?.pages?.every((page) => page.data.length === 0);
    const orders = ordersData?.pages?.flatMap((page) => page.data) || [];
    const addresses = addressesData?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="container py-8 max-w-4xl mx-auto lg:w-4xl w-dvw md-p-0 p-4">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Orders
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Addresses
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <ProfileTab user={user} />
                </TabsContent>

                <TabsContent value="orders">
                    <OrdersTab
                        orders={orders}
                        isLoading={isOrderLoading}
                        isError={isOrderError}
                        isEmpty={isEmptyOrder}
                        hasNextPage={hasOrderNextPage}
                        isFetchingNextPage={isOrderFetchingNextPage}
                        refetch={refetchOrders}
                        fetchNextPage={fetchOrderNextPage}
                    />
                </TabsContent>

                <TabsContent value="addresses">
                    <AddressesTab
                        addresses={addresses}
                        isLoading={isAddressLoading}
                        isError={isAddressError}
                        isFetchingNextPage={isAddressFetchingNextPage}
                        hasNextPage={hasAddressNextPage}
                        fetchNextPage={fetchAddressNextPage}
                        refetch={refetchAddresses}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}