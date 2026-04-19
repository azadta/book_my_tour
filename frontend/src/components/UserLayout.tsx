import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow px-4 py-12 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
