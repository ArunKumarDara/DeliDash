import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./pages/login/login"
import Signup from "./pages/signup/signup"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from "sonner";
import Layout from "./pages/layout/Layout";
import Home from "./pages/home/Home";
import Restaurants from "./pages/restaurants/Restaurants";
import RestaurantMenu from "./pages/restaurants/Menu";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Checkout from "./pages/checkout/Checkout";
import Profile from "./pages/profile/Profile";
// import AdminDashboard from "./pages/admin/dashboard/Page";
// import AdminDashboard from "./admin/AdminDashboard";
import Dashboard from "./admin/dashBoard/Dashboard";
import OrderConfirmation from "./pages/orders/OrderConfirmation";
import AdminRoute from "./components/admin/Adminroute";
import Grocery from "./pages/grocery/Grocery";
import Bakes from "./pages/bakes/Bakes";
// import Bakery from "./pages/bakes/Bakes";
// import AdminRestaurants from "./admin/restaurants/Restaurants";


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
              <Route path="restaurants" >
                <Route index element={<Restaurants />} />
                <Route path=":restaurantId" element={<RestaurantMenu />} />
              </Route>
              <Route path="grocery" element={<Grocery />} />
              <Route path="bakes" element={<Bakes />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="profile" element={<Profile />} />
              {/* <Route path="admin" element={<Dashboard />} /> */}
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
