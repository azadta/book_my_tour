import "swiper/css";

import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useRef } from "react";
import { Swiper as swiperType } from "swiper";
import { useHome } from "@/hooks/useHome";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";

const HomeSlideTwo = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<swiperType | null>(null);
  const { destinationsByCategory, fetchDestinationsByCategory } = useHome();
  useEffect(() => {
    fetchDestinationsByCategory("Family Vacation Packages");
  }, []);
  return (
    <div className="w-full">
      <div className="border border-amber-500 rounded-xl shadow-xl gap-5  p-4 sm:p-5 flex flex-col">
        <div className="flex justify-between items-center ">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold font-caveat text-orange-500">
            Family Holiday Destinations
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
              320: { slidesPerView: 1.5 },
              480: { slidesPerView: 2.5 },
              640: { slidesPerView: 3.5 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
          >
            {destinationsByCategory["Family Vacation Packages"]?.map(
              (destination) => (
                <SwiperSlide key={destination?._id}>
                  <div
                    onClick={() =>
                      navigate(
                        `${FRONTEND_ROUTES.USER.PACKAGES_LIST}?destination=${destination._id}&destinationName=${encodeURIComponent(destination.name)}`,
                      )
                    }
                    className=" w-full h-[240px] relative hover:cursor-pointer  "
                  >
                    <img
                      src={destination?.images?.[0]}
                      className=" w-full h-full object-cover object-center border-3 border-white rounded-xl"
                    />
                    <div className="absolute bottom-0  inset-x-0 border-b-3 border-x-3 border-white rounded-b-xl p-2 bg-black/40">
                      <p className="text-white text-center font-semibold">
                        {destination?.name}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ),
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeSlideTwo;
