import {
  BadgeCheck,
  KeyRound,
  LayoutDashboard,
  LayoutDashboardIcon,
  Package,
  Plus,
  SquarePen,
  Users,
  UsersRound,
} from "lucide-react";

import { Outlet, useLocation } from "react-router-dom";
import AdminDashboardSideBar from "../AdminDashboardSideBar";
import DashboardHeader from "../DashboardHeader";

const AdminLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const getHeaderConfigeration = () => {
    if (pathName.includes("/dashboard")) {
      return {
        statusText: "Overview",
        icon: LayoutDashboard,
      };
    }
    if (pathName.includes("/users")) {
      return {
        statusText: "User",
        icon: Users,
      };
    }
    if (pathName.includes("/edit-user")) {
      return {
        statusText: "Edit User",
        icon: SquarePen,
      };
    }

    if (pathName.includes("/operators")) {
      return {
        statusText: "Operator",
        icon: UsersRound,
      };
    }
    if (pathName.includes("/operator-verification")) {
      return {
        statusText: "Verification Requests",
        icon: BadgeCheck,
      };
    }
    if (pathName.includes("/edit-operator")) {
      return {
        statusText: "Edit Operator",
        icon: SquarePen,
      };
    }
    if (pathName.includes("/profile")) {
      return {
        statusText: "Profile",
        icon: LayoutDashboardIcon,
      };
    }
    if (pathName.includes("/packages")) {
      return {
        statusText: "Package",
        icon: Package,
      };
    }
    if (pathName.includes("/create-package-category")) {
      return {
        statusText: "Create Package Category",
        icon: Plus,
      };
    }
    if (pathName.includes("/create-destination")) {
      return {
        statusText: "Create Destination",
        icon: Plus,
      };
    }
    if (pathName.includes("/reset-password")) {
      return {
        statusText: "Reset-password",
        icon: KeyRound,
      };
    }

    return {
      statusText: "System Active",
      icon: LayoutDashboardIcon,
    };
  };
  const headerConfig = getHeaderConfigeration();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-20 bottom-0 z-40 hidden md:block">
        <AdminDashboardSideBar />
      </aside>
      <div className="flex flex-col flex-1 min-w-0 md:pl-64">
        <DashboardHeader
          title="Admin Dashboard"
          subtitle="Monitor and manage users,operators,packages and platform activities"
          statusText={headerConfig.statusText}
          icon={headerConfig.icon}
        />

        <main className=" flex-1 w-full  pt-20 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
