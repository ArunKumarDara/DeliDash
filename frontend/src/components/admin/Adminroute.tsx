import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";
import { LoaderCircle } from "lucide-react";

const AdminRoute = () => {
    const { data, isPending, isError } = useQuery({
        queryKey: ["authUser"],
        queryFn: getUser,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderCircle className="w-12 h-12 text-black animate-spin" />
            </div>
        );
    }

    if (isError || !data?.success || data?.user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
