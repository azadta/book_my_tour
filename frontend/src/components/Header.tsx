import { Link } from "react-router-dom";
import { RiContactsBook2Fill } from "react-icons/ri";
import { PiBellRingingBold, PiCardsBold } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { MdLogin } from "react-icons/md";
import { GrNotes } from "react-icons/gr";
import { TbFileLike } from "react-icons/tb";
import { IoSearchSharp } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const closeDrawer = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed z-50 top-0 left-0 w-full   ">
        <div className="  bg-sky-200  ">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4 ">
            <h1 className="text-3xl  font-jim text-pink-600">Book My Tour</h1>
            <div
              className={`bg-white  rounded-md flex items-center p-2 md:hidden ${isOpen ? "hidden" : "block"}`}
            >
              <input className="focus:outline-none w-24 sm:w-64 " />
              <FaSearch className="text-orange-900" />
            </div>
            <div>
              <ul className="md:flex  md:items-center md:justify-center md:gap-10 hidden ">
                {!currentUser && (
                  <>
                    <Link to="/user/login">
                      <li className="flex items-center gap-0.5 text-orange-900 hover:underline">
                        <MdLogin />
                        Login
                      </li>
                    </Link>
                    <Link to="/user/register">
                      <li className="flex items-center gap-0.5 text-orange-900 hover:underline">
                        <GrNotes />
                        Register
                      </li>
                    </Link>
                  </>
                )}
                <Link to="/contact">
                  <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                    <RiContactsBook2Fill />
                    Contact
                  </li>
                </Link>
                <Link to="/about">
                  <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                    <PiCardsBold />
                    About
                  </li>
                </Link>
                {currentUser && (
                  <>
                    <Link to="/user/favourites">
                      <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                        <TbFileLike />
                        My Favourites
                      </li>
                    </Link>
                    <Link to="/user/profile">
                      <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                        <img
                          src={currentUser?.image}
                          alt={currentUser.name}
                          className="size-8 object-cover rounded-full"
                        />
                        Profile
                      </li>
                    </Link>
                    <Link to="/user/notifications">
                      <li title="Notifications">
                        <PiBellRingingBold className="text-2xl text-orange-900" />
                      </li>
                    </Link>
                  </>
                )}
              </ul>
              <button
                className="md:hidden text-orange-900 "
                onClick={() => setIsOpen(true)}
              >
                <HiMenu className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
       
      </header>
      <div
        className={`fixed inset-0 z-40 bg-black/50 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 w-72 shadow-xl ${isOpen ? "block" : "hidden"}`}
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
              <Link to="/user/login" onClick={closeDrawer}>
                <li className="flex items-center gap-2 text-orange-900 ">
                  <MdLogin />
                  Login
                </li>
              </Link>
              <Link to="/user/register" onClick={closeDrawer}>
                <li className="flex items-center gap-2 text-orange-900 ">
                  <GrNotes />
                  Register
                </li>
              </Link>
            </>
          )}
          <Link to="/contact" onClick={closeDrawer}>
            <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
              <RiContactsBook2Fill />
              Contact
            </li>
          </Link>
          <Link to="/about" onClick={closeDrawer}>
            <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
              <PiCardsBold />
              About
            </li>
          </Link>
          {currentUser && (
            <>
              <Link to="/user/favourites" onClick={closeDrawer}>
                <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                  <TbFileLike />
                  My Favourites
                </li>
              </Link>
              <Link to="/user/profile" onClick={closeDrawer}>
                <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                  <img
                    src={currentUser?.image}
                    alt={currentUser.name}
                    className="size-8 object-cover rounded-full"
                  />
                  Profile
                </li>
              </Link>
              <Link to="/user/notifications" onClick={closeDrawer}>
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

export default Header;
