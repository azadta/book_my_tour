import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

const Search = () => {
  const [showSearch, setShowSearch] = useState(true);
  useEffect(() => {
    const scrollHandler = () => {
      setShowSearch(window.scrollY < 300);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);
  return (
    <div
      className={`bg-sky-50 pb-2 -mt-3   transition-all w-full duration-300 fixed z-50 left-1/2 -translate-x-1/2  ${showSearch ? "hidden md:block" : "hidden"}`}
    >
      <div className="flex justify-center items-center text-sky-400 gap-2 pb-2">
        Search By <IoSearchSharp />
      </div>
      <div className="flex items-center justify-center gap-1 lg:gap-3 px-1">
        <div className="border px-8 bg-white border-amber-400">Country</div>
        <div className="border px-8 bg-white border-amber-400">Budget</div>
        <div className="border px-8 bg-white border-amber-400">Nature</div>
        <div className="border px-8 bg-white border-amber-400">Adventure</div>
        <div className="border px-8 bg-white border-amber-400">Destination</div>
        <div className="border px-8 bg-white border-amber-400">Date</div>
      </div>
    </div>
  );
};

export default Search;