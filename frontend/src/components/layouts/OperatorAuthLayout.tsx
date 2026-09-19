import { KeyRound, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import AuthHeader from "../header/AuthHeader";

const OperatorAuthLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const isRegisterPage = pathName.includes("/register");
  const getAuthHeaderConfig = () => {
    if (pathName.includes("/register")) {
      return {
        statusText: "Registration",
        icon: UserPlus,
      };
    }
    if (pathName.includes("/otp-verification")) {
      return {
        statusText: "Security Verification",
        icon: ShieldCheck,
      };
    }
    if (pathName.includes("/forgot-password")) {
      return {
        statusText: "Password Recovery",
        icon: KeyRound,
      };
    }
    if (pathName.includes("/reset-password")) {
      return {
        statusText: "Reset Password",
        icon: KeyRound,
      };
    }

    return {
      statusText: "Operator Portal login",
      icon: LogIn,
    };
  };
  const headerConfig = getAuthHeaderConfig();
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 via-sky-50/30 to-emerald-50/30">
      <AuthHeader
        statusText={headerConfig.statusText}
        contextIcon={headerConfig.icon}
      />
      <main
        className={`flex-1 ${isRegisterPage ? "flex items-center justify-center pt-24 pb-12 " : "flex items-center justify-center pt-18"} `}
      >
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OperatorAuthLayout;
