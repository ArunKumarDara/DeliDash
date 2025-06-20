import Footer from '@/components/footer/Footer'
import Navbar from "@/components/navbar/Navbar"
import { Outlet, Navigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getUser } from "../../api/user"
import { useDispatch } from 'react-redux'
import { loginUser } from '@/store/userSlice'
import { useEffect } from 'react'
import DeliverySpinner from '@/components/spinner/DeliverySpinner'

const Layout = () => {

    const dispatch = useDispatch()

    const { data, isPending, isError } = useQuery({
        queryKey: ["authUser"],
        queryFn: getUser,
        retry: false,
        staleTime: 1000 * 60 * 5
    })

    useEffect(() => {
        if (data?.success && data?.user) {
            dispatch(loginUser(data.user)); // Dispatching user data to Redux store
        }
    }, [data, dispatch]);

    if (isPending) {
        return (
            <div className='h-screen w-full flex justify-center items-center'>
                <DeliverySpinner />
            </div>
        )
    }

    if (data?.user?.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    if (isError || !data?.success) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = data?.user?.role === "admin";

    return (
        <div className='flex flex-col min-h-screen'>
            {!isAdmin && <Navbar user={data.user} />}
            <main className="flex-1 flex items-center justify-center p-6 mt-16">
                <div className="text-center">
                    <Outlet />
                </div>
            </main>
            {!isAdmin && <Footer />}
        </div>
    )
}

export default Layout