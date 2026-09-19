import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer";
import AppHeader from "../header/AppHeader";
import HomeHeader from "../header/HomeHeader";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import ChatNotificationBadgeButton from "../chat/ChatNotificationBadgeButton";

const UserLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isChatPage = location.pathname === FRONTEND_ROUTES.CHAT.USER_CHAT_PAGE;

  const showNavigation =
    location.pathname === "/" ||
    location.pathname.startsWith("/user/package-details/");
  return (
    <div className="flex flex-col min-h-screen  ">
      {isHomePage ? (
        <HomeHeader />
      ) : (
        <AppHeader showNavigation={showNavigation} />
      )}

      <main
        className={` grow ${isHomePage ? " pt-33" : isChatPage ? "pt-24" : "pt-18"} `}
      >
        <Outlet />
      </main>
      {!isChatPage && <ChatNotificationBadgeButton />}
      <Footer />
    </div>
  );
};

export default UserLayout;
