import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import UserLayout from "./components/UserLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEditPackage from "./pages/admin/AdminEditPackage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOperatorDetails from "./pages/admin/AdminOperatorDetails";
import AdminOperatorVerification from "./pages/admin/AdminOperatorVerification";
import AdminPackageDetails from "./pages/admin/AdminPackageDetails";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminResetPasswordAuthenticated from "./pages/admin/AdminResetPasswordAuthenticated";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import CreateDestination from "./pages/admin/CreateDestination";
import CreatePackageCategory from "./pages/admin/CreatePackageCategory";
import EditOperator from "./pages/admin/EditOperator";
import EditUser from "./pages/admin/EditUser";
import OperatorCreatePackage from "./pages/operator/OperatorCreatePackage";
import OperatorDashboard from "./pages/operator/OperatorDashboard";
import OperatorForgotPassword from "./pages/operator/OperatorForgotPassword";
import OperatorLogin from "./pages/operator/OperatorLogin";
import OperatorOtpVerification from "./pages/operator/OperatorOtpVerification";
import OperatorPackagesList from "./pages/operator/OperatorPackagesList";
import OperatorProfile from "./pages/operator/OperatorProfile";
import OperatorRegister from "./pages/operator/OperatorRegister";
import OperatorResetPassword from "./pages/operator/OperatorResetPassword";
import OperatorResetPasswordAuthenticated from "./pages/operator/OperatorResetPasswordAuthenticated";
import { About } from "./pages/user/About";
import ForgotPassword from "./pages/user/ForgotPassword";
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import PackageDetails from "./pages/user/PackageDetails";
import PackagesList from "./pages/user/PackagesList";
import Profile from "./pages/user/Profile";
import Register from "./pages/user/Register";
import { ResetPassword } from "./pages/user/ResetPassword";
import ResetPasswordAuthenticated from "./pages/user/ResetPasswordAuthenticated";
import VerifyOtp from "./pages/user/VerifyOtp";
import type { RootState } from "./redux/store";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";
import OperatorEditPackage from "./pages/operator/OperatorEditPackage";

const App = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentOperator } = useSelector((state: RootState) => state.operator);
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/user/about" element={<About />} />
          <Route
            path="/user/reset-password"
            element={<ResetPasswordAuthenticated />}
          />
          <Route
            path="/user/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route
            element={
              <PublicRoute isAuthenticated={!!currentUser} redirectedPath="/" />
            }
          >
            <Route
              path="/user/login"
              element={currentUser ? <Home /> : <Login />}
            />
            <Route path="/user/register" element={<Register />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route path="/user/verify-otp/:userId" element={<VerifyOtp />} />
            <Route path="/user/packages-list" element={<PackagesList />} />
            <Route
              path="/user/package-details/:id"
              element={<PackageDetails />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={!!currentUser}
                redirectedPath="/user/login"
              />
            }
          >
            <Route path="/user/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route
          element={
            <PublicRoute
              isAuthenticated={!!currentOperator}
              redirectedPath="/operator/dashboard"
            />
          }
        >
          <Route path="/operator/register" element={<OperatorRegister />} />
          <Route
            path="/operator/login"
            element={
              currentOperator ? <OperatorDashboard /> : <OperatorLogin />
            }
          />

          <Route
            path="/operator/otp-verification/:operatorId"
            element={<OperatorOtpVerification />}
          />
          <Route
            path="/operator/forgot-password"
            element={<OperatorForgotPassword />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={!!currentOperator}
              redirectedPath="/operator/login"
            />
          }
        >
          <Route path="/operator/profile" element={<OperatorProfile />} />
          <Route path="/operator/dashboard" element={<OperatorDashboard />} />
          <Route
            path="/operator/create-package"
            element={<OperatorCreatePackage />}
          />
          <Route
            path="/operator/edit-package/:id"
            element={<OperatorEditPackage />}
          />
          <Route
            path="/operator/packages-list/:id"
            element={<OperatorPackagesList />}
          />
        </Route>

        <Route
          path="/operator/reset-password"
          element={<OperatorResetPasswordAuthenticated />}
        />

        <Route
          path="/operator/reset-password/:token"
          element={<OperatorResetPassword />}
        />

        <Route
          element={
            <PublicRoute
              isAuthenticated={!!currentAdmin}
              redirectedPath="/admin/dashboard"
            />
          }
        >
          <Route
            path="/admin/login"
            element={currentAdmin ? <AdminDashboard /> : <AdminLogin />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={!!currentAdmin}
              redirectedPath="/admin/login"
            />
          }
        >
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route
            path="/admin/reset-password"
            element={<AdminResetPasswordAuthenticated />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserDetails />} />
          <Route path="/admin/edit-user/:id" element={<EditUser />} />
          <Route path="/admin/operators" element={<AdminOperatorDetails />} />
          <Route path="/admin/edit-operator/:id" element={<EditOperator />} />
          <Route
            path="/admin/operator-verification"
            element={<AdminOperatorVerification />}
          />
          <Route path="/admin/packages" element={<AdminPackageDetails />} />
          <Route
            path="/admin/create-destination"
            element={<CreateDestination />}
          />
          <Route
            path="/admin/create-package-category"
            element={<CreatePackageCategory />}
          />
        </Route>
        <Route path="/admin/edit-package/:id" element={<AdminEditPackage />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
};

export default App;
