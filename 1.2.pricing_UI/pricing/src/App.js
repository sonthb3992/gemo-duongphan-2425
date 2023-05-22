import { Route, Routes } from "react-router-dom";
import "./App.css";
import MenuPage from "./pages/MenuPage/MenuPage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import OrderPage from "./pages/OrderPage/OrderPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="menu" element={<MenuPage />} />
      <Route path="orders" element={<OrderPage />} />
    </Routes>
  );
}

export default App;
