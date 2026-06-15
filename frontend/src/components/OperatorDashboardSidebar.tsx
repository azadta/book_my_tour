import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";

const OperatorDashboardSideBar = () => {
  const navigate = useNavigate();
  const { currentOperator} = useSelector((state: RootState) => state.operator);
  return (
    <div className="  max-w-64 bg-white border-r md:border-r-red-500 text-white flex flex-col p-6 justify-between h-full ">
      <div className="flex flex-col justify-center px-1.5   gap-10">
        <NavLink
          to={`/operator/create-package`}
          className={({ isActive }) =>
            `py-1 px-4 rounded-xl transition w-full text-center ${isActive ? "bg-emerald-400 hover:bg-emerald-500" : " bg-sky-400   hover:bg-sky-500"} `
          }
        >
          Create Package
        </NavLink>
        
      </div>
      <div className="mt-10 border-t border-gray-600 pt-4">
        <button
          onClick={() => navigate("/operator/profile")}
          className="flex items-center gap-3 hover:bg-gray-700 bg-gray-500 p-3 rounded w-full transition"
        >
          <img
            src={currentOperator?.image}
            alt="Admin"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-white text-sm font-medium">Operator Profile</span>
        </button>
      </div>
    </div>
  );
};

export default OperatorDashboardSideBar;
