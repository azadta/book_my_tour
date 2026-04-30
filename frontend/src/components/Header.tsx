import { FaSearch } from "react-icons/fa";
import { GiPalmTree } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../redux/store";

const Header = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <div className="bg-sky-600  shadow-md w-full fixed">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-6">
        <Link to="/">
          <h1 className=" font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-emerald-400 relative  font-dosis text-2xl">
              <GiPalmTree className="absolute  -top-1 right-10" />
              Book My Tour
            </span>
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
            <li className="hidden sm:inline text-white hover:underline">
              Home
            </li>
          </Link>
          <Link to="/user/about">
            <li className="hidden sm:inline text-white hover:underline">
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
              <li className="hidden sm:inline text-white hover:underline">
                Login
              </li>
            </Link>
          )}
          {!currentUser && (
            <Link to="/user/register">
              <li className=" text-white hover:under-line">Register</li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
