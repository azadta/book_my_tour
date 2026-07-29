import { useEffect, useState } from "react";
import { GrNotes } from "react-icons/gr";
import { HiMenu, HiX } from "react-icons/hi";
import { MdLogin } from "react-icons/md";
import { PiBellRingingBold, PiCardsBold } from "react-icons/pi";
import { RiContactsBook2Fill } from "react-icons/ri";
import { TbFileLike } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
import NavItem from "../NavItem";
import { Navigation } from "../Navbar";
import "./header.css";
import { useDebounce } from "use-debounce";
import Logo from "./Logo";
import HeaderActions from "./HeaderActions";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";

const HomeHeader = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 700);

  const { currentUser } = useSelector((state: RootState) => state.user);
  const [hideTopBar, setHideTopBar] = useState(false);
  const navigate = useNavigate();

  const closeDrawer = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 75);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const value = debouncedSearch.trim();
    if (!value) return;
    navigate(`/user/packages-list?search=${encodeURIComponent(value)}`);
  }, [debouncedSearch]);

  return (
    <>
      <header className="fixed z-50 top-0 left-0 w-full   ">
        <div className="bg-white shadow-md">
          <div
            className={`flex flex-col sm:flex-row gap-2 sm:justify-between px-4 overflow-hidden transition-all duration-300 ${hideTopBar ? "max-h-0 opacity-0 py-0" : "max-h-32 sm:max-h-20 opacity-100 pt-2 pb-1"}`}
          >
            <div className="flex gap-1">
              {" "}
              <NavLink
                to={FRONTEND_ROUTES.USER.ABOUT}
                className="text-orange-900 text-[12px] md:text-[14px]"
              >
                About
              </NavLink>
              <span className="text-orange-900">/</span>
              <NavLink
                to={FRONTEND_ROUTES.USER.CONTACT}
                className="text-orange-900 text-[12px] md:text-[14px]"
              >
                Contact
              </NavLink>
            </div>

            <div className="header-search ">
              <svg
                className="svg"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5 6C11.3949 6.00006 11.2925 5.96705 11.2073 5.90565C11.1221 5.84425 11.0583 5.75758 11.0251 5.65792L10.7623 4.86908C10.6623 4.57101 10.4288 4.33629 10.13 4.23693L9.34102 3.97354C9.24166 3.94019 9.1553 3.87649 9.09411 3.79142C9.03292 3.70635 9 3.60421 9 3.49943C9 3.39465 9.03292 3.29252 9.09411 3.20745C9.1553 3.12238 9.24166 3.05867 9.34102 3.02532L10.13 2.76193C10.4282 2.66191 10.663 2.42852 10.7623 2.12979L11.0258 1.34094C11.0591 1.24161 11.1229 1.15526 11.2079 1.09409C11.293 1.03291 11.3952 1 11.5 1C11.6048 1 11.707 1.03291 11.7921 1.09409C11.8771 1.15526 11.9409 1.24161 11.9742 1.34094L12.2377 2.12979C12.2868 2.27697 12.3695 2.4107 12.4792 2.52041C12.589 2.63013 12.7227 2.71281 12.87 2.76193L13.659 3.02532C13.7583 3.05867 13.8447 3.12238 13.9059 3.20745C13.9671 3.29252 14 3.39465 14 3.49943C14 3.60421 13.9671 3.70635 13.9059 3.79142C13.8447 3.87649 13.7583 3.94019 13.659 3.97354L12.87 4.23693C12.5718 4.33696 12.337 4.57034 12.2377 4.86908L11.9742 5.65792C11.9411 5.75747 11.8774 5.84406 11.7923 5.90545C11.7072 5.96684 11.6049 5.99992 11.5 6Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 13C5.85133 13.0001 5.7069 12.9504 5.58969 12.859C5.47247 12.7675 5.38921 12.6395 5.35313 12.4952L5.12388 11.5745C4.91418 10.7391 4.26198 10.0868 3.42674 9.87703L2.50619 9.64774C2.36169 9.61194 2.23333 9.52878 2.14159 9.41151C2.04985 9.29425 2 9.14964 2 9.00075C2 8.85185 2.04985 8.70724 2.14159 8.58998C2.23333 8.47272 2.36169 8.38955 2.50619 8.35376L3.42674 8.12446C4.26198 7.91473 4.91418 7.2624 5.12388 6.427L5.35313 5.50629C5.38892 5.36176 5.47207 5.23338 5.58931 5.14162C5.70655 5.04986 5.85113 5 6 5C6.14887 5 6.29345 5.04986 6.41069 5.14162C6.52793 5.23338 6.61108 5.36176 6.64687 5.50629L6.87612 6.427C6.97865 6.83721 7.19071 7.21184 7.48965 7.51082C7.78858 7.80981 8.16313 8.02192 8.57326 8.12446L9.49381 8.35376C9.63831 8.38955 9.76667 8.47272 9.85841 8.58998C9.95015 8.70724 10 8.85185 10 9.00075C10 9.14964 9.95015 9.29425 9.85841 9.41151C9.76667 9.52878 9.63831 9.61194 9.49381 9.64774L8.57326 9.87703C8.16313 9.97957 7.78858 10.1917 7.48965 10.4907C7.19071 10.7897 6.97865 11.1643 6.87612 11.5745L6.64687 12.4952C6.61079 12.6395 6.52753 12.7675 6.41031 12.859C6.2931 12.9504 6.14867 13.0001 6 13Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.5005 23C13.3376 23 13.1791 22.9469 13.049 22.8487C12.9189 22.7505 12.8243 22.6127 12.7795 22.456L11.9665 19.61C11.7915 18.9971 11.4631 18.4389 11.0124 17.9882C10.5616 17.5374 10.0035 17.209 9.39054 17.034L6.54454 16.221C6.38795 16.1761 6.25021 16.0815 6.15216 15.9514C6.05411 15.8214 6.00108 15.6629 6.00108 15.5C6.00108 15.3371 6.05411 15.1786 6.15216 15.0486C6.25021 14.9185 6.38795 14.8239 6.54454 14.779L9.39054 13.966C10.0035 13.791 10.5616 13.4626 11.0124 13.0118C11.4631 12.5611 11.7915 12.0029 11.9665 11.39L12.7795 8.544C12.8244 8.38741 12.919 8.24967 13.0491 8.15162C13.1792 8.05357 13.3376 8.00054 13.5005 8.00054C13.6634 8.00054 13.8219 8.05357 13.952 8.15162C14.0821 8.24967 14.1767 8.38741 14.2215 8.544L15.0345 11.39C15.2096 12.0029 15.538 12.5611 15.9887 13.0118C16.4394 13.4626 16.9976 13.791 17.6105 13.966L20.4565 14.779C20.6131 14.8239 20.7509 14.9185 20.8489 15.0486C20.947 15.1786 21 15.3371 21 15.5C21 15.6629 20.947 15.8214 20.8489 15.9514C20.7509 16.0815 20.6131 16.1761 20.4565 16.221L17.6105 17.034C16.9976 17.209 16.4394 17.5374 15.9887 17.9882C15.538 18.4389 15.2096 18.9971 15.0345 19.61L14.2215 22.456C14.1768 22.6127 14.0822 22.7505 13.9521 22.8487C13.822 22.9469 13.6635 23 13.5005 23Z"
                  fill="currentColor"
                ></path>
              </svg>

              <input
                className="search placeholder:text-[15px]"
                type="text"
                placeholder="Search destinations or packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <ul className="wrapper hidden md:flex">
              <li className="icon facebook">
                <svg
                  viewBox="0 0 320 512"
                  height="1.2em"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                </svg>
              </li>
              <li className="icon twitter">
                <svg
                  height="1.8em"
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  className="twitter"
                >
                  <path d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"></path>
                </svg>
              </li>
              <li className="icon instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.2em"
                  fill="currentColor"
                  className="bi bi-instagram"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
                </svg>
              </li>
            </ul>
          </div>

          <div
            className={`max-w-7xl mx-auto flex justify-between items-center px-4 ${hideTopBar ? "pt-3 pb-3" : "pb-2"}`}
          >
            <Logo />
            <div className="hidden md:block">
              <Navigation />
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
              <Link to={FRONTEND_ROUTES.USER.LOGIN} onClick={closeDrawer}>
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
              <Link to={FRONTEND_ROUTES.USER.WISHLIST} onClick={closeDrawer}>
                <li className="flex gap-0.5 text-orange-900 hover:underline items-center justify-center">
                  <TbFileLike />
                  My Wishlist
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
              <Link
                to={FRONTEND_ROUTES.USER.NOTIFICATIONS}
                onClick={closeDrawer}
              >
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

export default HomeHeader;
