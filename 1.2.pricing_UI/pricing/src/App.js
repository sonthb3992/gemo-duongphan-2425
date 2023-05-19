import { Route, Routes } from "react-router-dom";
import "./App.css";
import Menu from "./pages/Menu/Menu";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
