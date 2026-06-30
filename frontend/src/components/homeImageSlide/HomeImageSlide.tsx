import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeImageSlide = () => {
  const navigate = useNavigate();
  const images = [
    "beach image-2.avif",
    "beach image-3.avif",
    "beach image-4.avif",
    "beach image-5.avif",
    "beach image.avif",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full max-w-[1600px] mx-auto ">
      <div className="relative grid grid-cols-12 items-center  rounded-[15px] overflow-hidden shadow-2xl bg-white border border-gray-100 h-[380px]">
        <div className="relative col-span-8 h-full w-full overflow-hidden select-none ">
          <img
            src={images[currentImage]}
            alt="beach destination"
            className="w-full h-full object-cover scale-x-[-1]  "
          />
        </div>

        <div className="relative col-span-4 z-10 bg-white/95 backdrop-blur-md h-full -ml-24 pl-12 pr-16 flex flex-col justify-center">
          <span className="uppercase tracking-[5px] text-xs font-bold text-sky-600">
            Explore
          </span>
          <h2 className="mt-2 text-4xl font-black text-gray-900 tracking-tight leading-[1.15] ">
            Discover <br />
            Your Next <br />
            <span className="bg-linear-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent">
              Adventure
            </span>
          </h2>
          <p className="mt-4 text-gray-600 text-base leading-relaxed ">
            {" "}
            Discover breathtaking destinations, unforgettable adventures, and
            premium experiences crafted just for you.
          </p>
          <img
            src="airplane.png"
            alt="flights"
            className="size-15 object-contain absolute top-20 right-60"
          />

          <div className="flex items-center justify-between">
            <img
              src="cruise-ship.png"
              alt="Cruises"
              className="size-15 object-contain"
            />
            <button
              onClick={() => navigate("/user/packages-list")}
              className=" flex justify-center items-center gap-2 rounded-full bg-sky-600 px-7 py-3 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 hover:bg-sky-700 hover:shadow-sky-700/30 active:scale-[0.98] transition-all group   "
            >
              Explore Tours
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeImageSlide;
