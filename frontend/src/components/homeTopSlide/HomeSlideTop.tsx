import { useHome } from "@/hooks/useHome";
import { useEffect, useRef } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { Swiper as swiperType } from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import HomeTopSlideCard from "./homeTopSlideCard/HomeTopSlideCard";
import Loading from "../Loading";

const HomeSlideTop = () => {
  const swiperRef = useRef<swiperType | null>(null);
  const { fetchDestinationsByCategory, packages,loadingPackages,loadingDestinationsByCategory } = useHome();
  useEffect(() => {
    fetchDestinationsByCategory("Family Vacation Packages");
  }, []);
  return (
    <div className="w-full relative">
      {(loadingDestinationsByCategory||loadingPackages)&&<Loading/> }
      <div className="border border-amber-500 rounded-xl shadow-xl pt-10   sm:p-5 flex flex-col">
        <div className="flex justify-between items-center ">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold text-gray-900 font-caveat text-orange-500">
            Explore your dream locations
          </h1>
          <div className="px-3 bg-white py-1 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.15)] flex items-center justify-center mb-1">
            <button
              onClick={() => {
                swiperRef.current?.slidePrev();
              }}
            >
              <IoIosArrowDropleft className="text-2xl text-amber-500" />
            </button>
            <button onClick={() => swiperRef.current?.slideNext()}>
              <IoIosArrowDropright className="text-2xl text-amber-500" />
            </button>
          </div>
        </div>

        <div>
          <Swiper
            modules={[Navigation]}
            slidesPerGroup={1}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              320: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5.5 },
            }}
          >
            {packages?.map((pkg) => (
              <SwiperSlide key={pkg?._id}>
                <div className="flex w-full">
                  <HomeTopSlideCard pkg={pkg} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeSlideTop;
