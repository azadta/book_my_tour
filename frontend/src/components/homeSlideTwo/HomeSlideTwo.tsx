import "swiper/css";

import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRef } from "react";
import { Swiper as swiperType } from "swiper";
import { useDestinations } from "@/hooks/useDestinations";

const HomeSlideTwo = () => {
  const swiperRef = useRef<swiperType | null>(null);
  const { destinations } = useDestinations();
  return (
    <div>
      <div className="border border-amber-500 rounded-xl shadow-xl gap-5  p-5 flex flex-col">
        <div className="flex justify-between items-center ">
          <h1 className="text-3xl font-semibold">
            Family Holiday Destinations
          </h1>
          <div className="px-3 py-1 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.15)] flex items-center justify-center mb-1">
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
            slidesPerView={8}
            slidesPerGroup={1}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {destinations?.map((destination: any) => (
              <SwiperSlide key={destination?._id}>
                <div className=" w-[180px] h-[240px] relative  ">
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
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeSlideTwo;
