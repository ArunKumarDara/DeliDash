import { BrowserRouter, Routes, Route } from "react-router"
import { lazy, Suspense } from "react"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from "sonner";
import { store } from "./store/store";
import { Provider } from "react-redux";
import AdminRoute from "./components/admin/Adminroute";
import Layout from "./pages/layout/Layout";
import Loading from "./components/spinner/Loader";

// Lazy-loaded components
const Login = lazy(() => import("./pages/login/login"));
const Signup = lazy(() => import("./pages/signup/signup"));
const Home = lazy(() => import("./pages/home/Home"));
const Restaurants = lazy(() => import("./pages/restaurants/Restaurants"));
const RestaurantMenu = lazy(() => import("./pages/restaurants/Menu"));
const Checkout = lazy(() => import("./pages/checkout/Checkout"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Dashboard = lazy(() => import("./admin/dashBoard/Dashboard"));
const OrderConfirmation = lazy(() => import("./pages/orders/OrderConfirmation"));
const Grocery = lazy(() => import("./pages/grocery/Grocery"));
const Bakes = lazy(() => import("./pages/bakes/Bakes"));

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            } />
            <Route path="/signup" element={
              <Suspense fallback={<Loading />}>
                <Signup />
              </Suspense>
            } />

            <Route path="/" element={<Layout />}>
              <Route index element={
                <Suspense fallback={<Loading />}>
                  <Home />
                </Suspense>
              } />
              <Route path="restaurants">
                <Route index element={
                  <Suspense fallback={<Loading />}>
                    <Restaurants />
                  </Suspense>
                } />
                <Route path=":restaurantId" element={
                  <Suspense fallback={<Loading />}>
                    <RestaurantMenu />
                  </Suspense>
                } />
              </Route>
              <Route path="grocery" element={
                <Suspense fallback={<Loading />}>
                  <Grocery />
                </Suspense>
              } />
              <Route path="bakes" element={
                <Suspense fallback={<Loading />}>
                  <Bakes />
                </Suspense>
              } />
              <Route path="checkout" element={
                <Suspense fallback={<Loading />}>
                  <Checkout />
                </Suspense>
              } />
              <Route path="profile" element={
                <Suspense fallback={<Loading />}>
                  <Profile />
                </Suspense>
              } />
              <Route path="order-confirmation/:orderId" element={
                <Suspense fallback={<Loading />}>
                  <OrderConfirmation />
                </Suspense>
              } />
            </Route>

            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={
                <Suspense fallback={<Loading />}>
                  <Dashboard />
                </Suspense>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}

export default App