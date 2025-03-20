import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./pages/login/login"
import Signup from "./pages/signup/signup"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
