import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/UserLayout";
import Home from "./pages/user/Home";
import { About } from "./pages/user/About";
import Login from "./pages/user/Login";
import Profile from "./pages/user/Profile";
import { ToastContainer } from "react-toastify";
import Register from "./pages/user/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/user/about" element={<About />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/register" element={<Register />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
};

export default App;
