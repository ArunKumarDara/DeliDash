import { BrowserRouter, Routes, Route } from "react-router"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from "sonner";
import { store } from "./store/store";
import { Provider } from "react-redux";
import AdminRoute from "./components/admin/Adminroute";
import Layout from "./pages/layout/Layout";
import Login from "./pages/login/login"
import Signup from "./pages/signup/signup";
import Home from "./pages/home/Home";
import Restaurants from "./pages/restaurants/Restaurants";
import RestaurantMenu from "./pages/restaurants/Menu";
import Grocery from "./pages/grocery/Grocery";
import Bakes from "./pages/bakes/Bakes";
import Checkout from "./pages/checkout/Checkout";
import Profile from "./pages/profile/Profile";
import OrderConfirmation from "./pages/orders/OrderConfirmation";
import Dashboard from "./admin/dashBoard/Dashboard"

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="restaurants">
                <Route index element={<Restaurants />} />
                <Route path=":restaurantId" element={<RestaurantMenu />} />
              </Route>
              <Route path="grocery" element={<Grocery />} />
              <Route path="bakes" element={<Bakes />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="profile" element={<Profile />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
            </Route>

            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}

export default App