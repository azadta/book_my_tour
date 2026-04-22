import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Header = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <div className="bg-slate-200 shadow-md w-full fixed">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-6">
        <Link to="/">
          <h1 className=" font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-700">Book My Tour</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="search"
            className="bg-transparent focus:outline-none w-24 sm:w-64 "
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-10">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/user/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          {currentUser ? (
            <Link to={"user/profile"}>
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.image}
                alt={currentUser.name || "profile"}
              />
            </Link>
          ) : (
            <Link to="/user/login">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Login
              </li>
            </Link>
          )}
          {!currentUser && (
            <Link to="/user/register">
              <li className="text-slate-700 hover:under-line">Register</li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
