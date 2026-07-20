import { useState } from "react";
import { Navigation } from "../Navbar";
import HeaderActions from "./HeaderActions";
import Logo from "./Logo";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Link } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import { GrNotes } from "react-icons/gr";
import { RiContactsBook2Fill } from "react-icons/ri";
import { PiBellRingingBold, PiCardsBold } from "react-icons/pi";
import { TbFileLike } from "react-icons/tb";
import { HiX } from "react-icons/hi";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";

interface Props {
  showNavigation: boolean;
}

const AppHeader = ({ showNavigation }: Props) => {
  const closeDrawer = () => setIsOpen(false);

  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <>
      <header className="fixed z-50 top-0 left-0 w-full   ">
        <div className="bg-white shadow-md">
          <div
            className={`max-w-7xl mx-auto flex justify-between items-center px-4  pt-3 pb-3 `}
          >
            <Logo />
            <div className="hidden md:block">
              {showNavigation && <Navigation />}
            </div>

            <div className="flex items-center gap-4">
              <HeaderActions openDrawer={() => setIsOpen(true)} />
            </div>
          </div>
        </div>
      </header>
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 w-72 shadow-xl transform transition duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b ">
          <h2 className="font-semibold text-lg">Menu</h2>

          <button onClick={closeDrawer}>
            <HiX className="text-3xl" />
          </button>
        </div>
        <ul className="flex flex-col items-center p-4 gap-5">
          {!currentUser && (
            <>
              <Link  to={FRONTEND_ROUTES.USER.LOGIN} onClick={closeDrawer}>
                <li className="flex items-center gap-2 text-orange-900 ">
                  <MdLogin />
                  Login
                </li>
              </Link>
              <Link to={FRONTEND_ROUTES.USER.REGISTER} onClick={closeDrawer}>
                <li className="flex items-center gap-2 text-orange-900 ">
                  <GrNotes />
                  Register
                </li>
              </Link>
            </>
          )}
          <Link to={FRONTEND_ROUTES.USER.CONTACT} onClick={closeDrawer}>
            <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
              <RiContactsBook2Fill />
              Contact
            </li>
          </Link>
          <Link to={FRONTEND_ROUTES.USER.ABOUT} onClick={closeDrawer}>
            <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
              <PiCardsBold />
              About
            </li>
          </Link>
          {currentUser && (
            <>
              <Link to={FRONTEND_ROUTES.USER.FAVOURITES} onClick={closeDrawer}>
                <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                  <TbFileLike />
                  My Favourites
                </li>
              </Link>
              <Link to={FRONTEND_ROUTES.USER.PROFILE} onClick={closeDrawer}>
                <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                  <img
                    src={currentUser?.image}
                    alt={currentUser.name}
                    className="size-8 object-cover rounded-full"
                  />
                  Profile
                </li>
              </Link>
              <Link to={FRONTEND_ROUTES.USER.NOTIFICATIONS} onClick={closeDrawer}>
                <li
                  title="Notifications"
                  className="flex items-center gap-2 text-orange-900"
                >
                  <PiBellRingingBold className="text-2xl text-orange-900" />
                  Notifications
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default AppHeader;
