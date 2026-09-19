import {
  CalendarCheck,
  KeyRound,
  LayoutDashboard,
  LayoutDashboardIcon,
  MessageSquare,
  Package,
  Plus,
  SquarePen,
  Ticket
} from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "../DashboardHeader";
import OperatorDashboardSideBar from "../OperatorDashboardSidebar";

const OperatorLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const getHeaderConfigeration = () => {
    if (pathName.includes("/dashboard")) {
      return {
        statusText: "Overview",
        icon: LayoutDashboard,
      };
    }
    if (pathName.includes("/packages-list")) {
      return {
        statusText: "Package",
        icon: Package,
      };
    }
    if (pathName.includes("/coupons-list")) {
      return {
        statusText: "Coupon",
        icon: Ticket,
      };
    }
    if (pathName.includes("/booking-list")||pathName.includes("/booking-details")) {
      return {
        statusText: "Booking",
        icon: CalendarCheck,
      };
    }
    if (pathName.includes("/chat")) {
      return {
        statusText: "Chat",
        icon: MessageSquare,
      };
    }
    if (pathName.includes("/profile")) {
      return {
        statusText: "Profile",
        icon: LayoutDashboardIcon,
      };
    }
    if (pathName.includes("/edit-package")) {
      return {
        statusText: "Edit Package",
        icon: SquarePen,
      };
    }
    if (pathName.includes("/create-package")) {
      return {
        statusText: "Create Package",
        icon: Plus,
      };
    }
    if (pathName.includes("/create-coupon")) {
      return {
        statusText: "Create Coupon",
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
        <OperatorDashboardSideBar />
      </aside>
      <div className="flex flex-col flex-1 min-w-0 md:pl-64">
        <DashboardHeader
          title="Operator Dashboard"
          subtitle="Create and manage your tour or service packages"
          statusText={headerConfig.statusText}
          icon={headerConfig.icon}
        />
        <main className="flex-1 pt-20 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OperatorLayout;
