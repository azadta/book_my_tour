import { KeyRound, LogIn } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import AuthHeader from "../header/AuthHeader";


const AdminAuthLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;

  const getAuthHeaderConfig = () => {
    if (pathName.includes("/login")) {
      return {
        statusText: "Admin Portal login",
        icon: KeyRound,
      };
    }

    return {
      statusText: "Admin Portal login",
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
      <main className={`flex-1 flex items-center justify-center pt-18"} `}>
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminAuthLayout;
