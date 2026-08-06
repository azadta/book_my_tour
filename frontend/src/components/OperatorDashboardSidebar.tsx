import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";

const OperatorDashboardSideBar = () => {
  const navigate = useNavigate();
  const { currentOperator } = useSelector((state: RootState) => state.operator);
  return (
    <div className="  max-w-64 bg-gray-100 shadow-xl text-white flex flex-col p-6 justify-between h-full ">
      <div className="flex flex-col justify-center px-1.5   gap-10">
        <NavLink
          to={FRONTEND_ROUTES.OPERATOR.DASHBOARD}
          className={({ isActive }) =>
            ` relative py-2 shadow-md px-4 rounded-xl transition w-full text-center ${isActive ? "bg-emerald-400  hover:bg-emerald-500" : " bg-sky-400   hover:bg-sky-500"} `
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="bg-emerald-500 absolute w-1.5 h-8 rounded-l-full top-1/2 -translate-y-1/2 -right-6  "></div>
              )}
              Overview
            </>
          )}
        </NavLink>

        <NavLink
          to={FRONTEND_ROUTES.OPERATOR.PACKAGES_LIST(
            currentOperator?._id as string,
          )}
          className={({ isActive }) =>
            ` relative py-2 shadow-md px-4 rounded-xl transition w-full text-center ${isActive ? "bg-emerald-400  hover:bg-emerald-500" : " bg-sky-400   hover:bg-sky-500"} `
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="bg-emerald-500 absolute w-1.5 h-8 rounded-l-full top-1/2 -translate-y-1/2 -right-6  "></div>
              )}
              Package Management
            </>
          )}
        </NavLink>

        <NavLink
          to={FRONTEND_ROUTES.OPERATOR.COUPONS_LIST}
          className={({ isActive }) =>
            ` relative py-2 shadow-md px-4 rounded-xl transition w-full text-center ${isActive ? "bg-emerald-400  hover:bg-emerald-500" : " bg-sky-400   hover:bg-sky-500"} `
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="bg-emerald-500 absolute w-1.5 h-8 rounded-l-full top-1/2 -translate-y-1/2 -right-6  "></div>
              )}
              Coupon Management
            </>
          )}
        </NavLink>
      </div>

      <button
        onClick={() => navigate(FRONTEND_ROUTES.OPERATOR.PROFILE)}
        className="relative group border-none bg-transparent p-0 outline-none cursor-pointer font-mono font-light uppercase text-base"
      >
        <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-600 ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-250 group-active:translate-y-px"></span>

        <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-linear-to-l from-[hsl(217,33%,16%)] via-[hsl(217,33%,32%)] to-[hsl(217,33%,16%)]"></span>

        <div className="  flex items-center justify-between py-3 px-6 text-lg text-white rounded-lg transform -translate-y-1 bg-linear-to-r from-[#f27121] via-[#e94057] to-[#8a2387] gap-1 transition duration-600 ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-250 group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
          {" "}
          <img
            src={currentOperator?.image}
            alt="Admin"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-white text-sm font-medium whitespace-nowrap">
            Operator Profile
          </span>
        </div>
      </button>
    </div>
  );
};

export default OperatorDashboardSideBar;
