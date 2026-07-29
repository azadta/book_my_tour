import React, { useState } from "react";
import NavItem from "../NavItem";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";

interface Props {
  openDrawer: () => void;
}

const HeaderActions = ({ openDrawer }: Props) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div>
      <div className="md:flex  md:items-center md:justify-center md:gap-5 hidden ">
        <NavItem to={FRONTEND_ROUTES.USER.HOME}>Home</NavItem>
        {!currentUser && (
          <>
            <Link to={FRONTEND_ROUTES.USER.LOGIN}>
              <div className="flex items-center gap-0.5 text-orange-900  ">
                <button className="relative  bg-gray-300 cursor-pointer py-3 px-4 text-center font-sans inline-flex justify-center text-base uppercase  rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden">
                  <span className="relative z-20">Login</span>

                  <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-amber-100 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"></span>

                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"></span>
                </button>
              </div>
            </Link>
            <Link to={FRONTEND_ROUTES.USER.REGISTER}>
              <div className="flex items-center gap-0.5 text-orange-900 ">
                <button className="relative bg-gray-300 cursor-pointer py-3 px-4 text-center font-sans inline-flex justify-center text-base uppercase  rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4  focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden">
                  <span className="relative z-20">Register</span>

                  <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-amber-100 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"></span>

                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"></span>
                </button>
              </div>
            </Link>
          </>
        )}

        {currentUser && (
          <>
            <NavItem to={FRONTEND_ROUTES.USER.WISHLIST}>My Wishlist</NavItem>
            <NavItem to={FRONTEND_ROUTES.USER.NOTIFICATIONS}>Notifications</NavItem>
            <Link to={FRONTEND_ROUTES.USER.PROFILE}>
              <div className="flex items-center gap-0.5  ">
                <button className="relative  cursor-pointer py-2 px-4 text-center font-sans inline-flex justify-center   text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden">
                  <span className="relative z-20">
                    {" "}
                    <div className="flex flex-col items-center text-orange-900  ">
                      <img
                        src={currentUser?.image}
                        alt={currentUser.name}
                        className="  size-8 object-cover rounded-full hover:cursor-pointer"
                        onClick={() => navigate("/user/profile")}
                      />
                      Profile
                    </div>
                  </span>

                  <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-amber-100 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"></span>

                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"></span>
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-orange-900 absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"></span>
                </button>
              </div>
            </Link>
          </>
        )}
      </div>
      <button className="md:hidden text-orange-900 " onClick={openDrawer}>
        <HiMenu className="text-3xl" />
      </button>
    </div>
  );
};

export default HeaderActions;
