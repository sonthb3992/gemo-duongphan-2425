import { Route, Routes } from "react-router-dom";
import "./App.css";
import Menu from "./pages/Menu/Menu";
import MenuPage from "./pages/MenuPage/MenuPage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Item from "./components/Item/Item";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      {/* <Route path="item" element={<Item />} /> */}
      <Route path="menu" element={<MenuPage />} />
    </Routes>
  );
}

export default App;
