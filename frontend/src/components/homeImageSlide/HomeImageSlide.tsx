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
      <div className="relative flex flex-col  md:grid grid-cols-12 items-center  rounded-[15px] overflow-hidden shadow-2xl bg-white border border-gray-100 h-[500px] lg:h-[380px]">
        <div className="relative h-[250px] md:h-full md:col-span-7 lg:col-span-8    w-full overflow-hidden select-none ">
          <img
            src={images[currentImage]}
            alt="beach destination"
            className="w-full h-full object-cover scale-x-[-1]  "
          />
        </div>

        <div className="relative w-full  md:col-span-5 lg:col-span-4  z-10 bg-white/95 backdrop-blur-md h-full p-6 sm:p-8 md:p-6 lg:pl-12 lg:pr-16 md:-ml-16 lg:-ml-24 flex flex-col justify-center">
          <span className="uppercase tracking-[5px] text-xs font-bold text-sky-600">
            Explore
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-[1.15] ">
            Discover <br />
            Your Next <br />
            <span className="bg-linear-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent">
              Adventure
            </span>
          </h2>
          <p className="mt-3 text-gray-600 text-base leading-relaxed ">
            {" "}
            Discover breathtaking destinations, unforgettable adventures, and
            premium experiences crafted just for you.
          </p>
          <img
            src="airplane.png"
            alt="flights"
            className="hidden lg:block size-15 object-contain absolute top-8  lg:top-20 lg:right-10  "
          />

          <div className=" mt-6 flex items-center justify-between gap-4">
            <img
              src="cruise-ship.png"
              alt="Cruises"
              className="size-12 lg:size-15  object-contain"
            />
            <button
              onClick={() => navigate("/user/packages-list")}
              className=" flex justify-center items-center gap-2 rounded-full bg-sky-600 px-5  py-2.5 lg:px-7 lg:py-3 text-white text-xs  sm:text-sm font-semibold shadow-lg shadow-sky-600/20 hover:bg-sky-700 hover:shadow-sky-700/30 active:scale-[0.98] transition-all group whitespace-nowrap   "
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
