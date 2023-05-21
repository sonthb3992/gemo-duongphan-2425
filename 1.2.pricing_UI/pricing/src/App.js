import { Route, Routes } from "react-router-dom";
import "./App.css";
import Menu from "./pages/Menu/Menu";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Order from "./pages/Order/Order";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="order" element={<Order />} />
    </Routes>
  );
}

export default App;
