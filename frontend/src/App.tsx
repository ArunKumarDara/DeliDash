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
import Dashboard from "./pages/admin/Dashboard";
import RestaurantMenu from "./pages/restaurants/Menu";


const queryClient = new QueryClient()

function App() {

  return (
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
              <Route path=":restaurantId" element={<RestaurantMenu />} /> {/* Dynamic route using 'name' */}
            </Route>
            {/* <Route path="grocery" element={<Grocery />} /> */}
            {/* <Route path="bakes" element={<Bakes />} /> */}
          </Route>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
