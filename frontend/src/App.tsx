import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/UserLayout";
import Home from "./pages/user/Home";
import { About } from "./pages/user/About";
import Login from "./pages/user/Login";
import Profile from "./pages/user/Profile";
import { ToastContainer } from "react-toastify";
import Register from "./pages/user/Register";
import VerifyOtp from "./pages/user/VerifyOtp";
import ForgotPassword from "./pages/user/ForgotPassword";
import { ResetPassword } from "./pages/user/ResetPassword";
import ResetPasswordAuthenticated from "./pages/user/ResetPasswordAuthenticated";
import OperatorRegister from "./pages/operator/OperatorRegister";
import OperatorLogin from "./pages/operator/OperatorLogin";
import OperatorProfile from "./pages/operator/OperatorProfile";
import OperatorOtpVerification from "./pages/operator/OperatorOtpVerification";
import OperatorForgotPassword from "./pages/operator/OperatorForgotPassword";
import OperatorResetPassword from "./pages/operator/OperatorResetPassword";
import OperatorResetPasswordAuthenticated from "./pages/operator/OperatorResetPasswordAuthenticated";
import OperatorDashboard from "./pages/operator/OperatorDashboard";
import CreatePackage from "./pages/operator/CreatePackage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminResetPasswordAuthenticated from "./pages/admin/AdminResetPasswordAuthenticated";

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
          <Route path="/user/verify-otp/:userId" element={<VerifyOtp />} />
          <Route path="/user/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/user/reset-password"
            element={<ResetPasswordAuthenticated />}
          />
          <Route
            path="/user/reset-password/:token"
            element={<ResetPassword />}
          />
        </Route>

        <Route path="/operator/register" element={<OperatorRegister />} />
        <Route path="/operator/login" element={<OperatorLogin />} />
        <Route path="/operator/profile" element={<OperatorProfile />} />
        <Route
          path="/operator/otp-verification/:operatorId"
          element={<OperatorOtpVerification />}
        />
        <Route
          path="/operator/forgot-password"
          element={<OperatorForgotPassword />}
        />
        <Route
          path="/operator/reset-password/:token"
          element={<OperatorResetPassword />}
        />
        <Route
          path="/operator/reset-password"
          element={<OperatorResetPasswordAuthenticated />}
        />
        <Route path="/operator/dashboard" element={<OperatorDashboard />} />
        <Route path="/operator/create-package" element={<CreatePackage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route
          path="/admin/reset-password"
          element={<AdminResetPasswordAuthenticated />}
        />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
};

export default App;
