import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import AppHeader from "./header/AppHeader";
import HomeHeader from "./header/HomeHeader";

const UserLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

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

      <main className={`grow ${isHomePage ? " mt-33" : "mt-18"} `}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
