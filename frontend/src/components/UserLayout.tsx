import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen  ">
      <Header />
      <main className="grow  mt-38  ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
