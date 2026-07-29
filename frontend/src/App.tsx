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
import { FRONTEND_ROUTES } from "./constants/frontEndRoutes";
import Wishlist from "./pages/user/Wishlist";
import SharedWishlist from "./pages/user/SharedWishlist";
import AddUserReviewModal from "./components/AddUserReviewModal";

const App = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentOperator } = useSelector((state: RootState) => state.operator);
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path={FRONTEND_ROUTES.USER.HOME} element={<Home />} />
          <Route path={FRONTEND_ROUTES.USER.ABOUT} element={<About />} />
          <Route
            path={FRONTEND_ROUTES.USER.RESET_PASSWORD_AUTH}
            element={<ResetPasswordAuthenticated />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.RESET_PASSWORD_PATTERN}
            element={<ResetPassword />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.PACKAGES_LIST}
            element={<PackagesList />}
          />
          <Route
            path={FRONTEND_ROUTES.USER.PACKAGE_DETAILS_PATTERN}
            element={<PackageDetails />}
          />
          <Route
            element={
              <PublicRoute
                isAuthenticated={!!currentUser}
                redirectedPath={FRONTEND_ROUTES.USER.HOME}
              />
            }
          >
            <Route path={FRONTEND_ROUTES.USER.LOGIN} element={<Login />} />
            <Route
              path={FRONTEND_ROUTES.USER.REGISTER}
              element={<Register />}
            />
            <Route
              path={FRONTEND_ROUTES.USER.FORGOT_PASSWORD}
              element={<ForgotPassword />}
            />
            <Route
              path={FRONTEND_ROUTES.USER.VERIFY_OTP_PATTERN}
              element={<VerifyOtp />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={!!currentUser}
                redirectedPath={FRONTEND_ROUTES.USER.LOGIN}
              />
            }
          >
            <Route path={FRONTEND_ROUTES.USER.PROFILE} element={<Profile />} />
            <Route
              path={FRONTEND_ROUTES.USER.WISHLIST}
              element={<Wishlist />}
            />
            <Route
              path={FRONTEND_ROUTES.USER.SHARED_WISHLIST_PATTERN}
              element={<SharedWishlist />}
            />
         

          </Route>

        </Route>

        <Route
          element={
            <PublicRoute
              isAuthenticated={!!currentOperator}
              redirectedPath={FRONTEND_ROUTES.OPERATOR.DASHBOARD}
            />
          }
        >
          <Route
            path={FRONTEND_ROUTES.OPERATOR.REGISTER}
            element={<OperatorRegister />}
          />
          <Route
            path={FRONTEND_ROUTES.OPERATOR.LOGIN}
            element={
              currentOperator ? <OperatorDashboard /> : <OperatorLogin />
            }
          />

          <Route
            path={FRONTEND_ROUTES.OPERATOR.OTP_VERIFICATION_PATTERN}
            element={<OperatorOtpVerification />}
          />
          <Route
            path={FRONTEND_ROUTES.OPERATOR.FORGOT_PASSWORD}
            element={<OperatorForgotPassword />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={!!currentOperator}
              redirectedPath={FRONTEND_ROUTES.OPERATOR.LOGIN}
            />
          }
        >
          <Route
            path={FRONTEND_ROUTES.OPERATOR.PROFILE}
            element={<OperatorProfile />}
          />
          <Route
            path={FRONTEND_ROUTES.OPERATOR.DASHBOARD}
            element={<OperatorDashboard />}
          />
          <Route
            path={FRONTEND_ROUTES.OPERATOR.CREATE_PACKAGE}
            element={<OperatorCreatePackage />}
          />
          <Route
            path={FRONTEND_ROUTES.OPERATOR.EDIT_PACKAGE_PATTERN}
            element={<OperatorEditPackage />}
          />
          <Route
            path={FRONTEND_ROUTES.OPERATOR.PACKAGES_LIST_PATTERN}
            element={<OperatorPackagesList />}
          />
        </Route>

        <Route
          path={FRONTEND_ROUTES.OPERATOR.RESET_PASSWORD_AUTH}
          element={<OperatorResetPasswordAuthenticated />}
        />

        <Route
          path={FRONTEND_ROUTES.OPERATOR.RESET_PASSWORD_PATTERN}
          element={<OperatorResetPassword />}
        />

        <Route
          element={
            <PublicRoute
              isAuthenticated={!!currentAdmin}
              redirectedPath={FRONTEND_ROUTES.ADMIN.DASHBOARD}
            />
          }
        >
          <Route
            path={FRONTEND_ROUTES.ADMIN.LOGIN}
            element={currentAdmin ? <AdminDashboard /> : <AdminLogin />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={!!currentAdmin}
              redirectedPath={FRONTEND_ROUTES.ADMIN.LOGIN}
            />
          }
        >
          <Route
            path={FRONTEND_ROUTES.ADMIN.PROFILE}
            element={<AdminProfile />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.RESET_PASSWORD_AUTH}
            element={<AdminResetPasswordAuthenticated />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.DASHBOARD}
            element={<AdminDashboard />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.USERS}
            element={<AdminUserDetails />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.EDIT_USER_PATTERN}
            element={<EditUser />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.OPERATORS}
            element={<AdminOperatorDetails />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.EDIT_OPERATOR_PATTERN}
            element={<EditOperator />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.OPERATOR_VERIFICATION}
            element={<AdminOperatorVerification />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.PACKAGES}
            element={<AdminPackageDetails />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.CREATE_DESTINATION}
            element={<CreateDestination />}
          />
          <Route
            path={FRONTEND_ROUTES.ADMIN.CREATE_PACKAGE_CATEGORY}
            element={<CreatePackageCategory />}
          />
        </Route>
        <Route
          path={FRONTEND_ROUTES.ADMIN.EDIT_PACKAGE_PATTERN}
          element={<AdminEditPackage />}
        />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
};

export default App;
