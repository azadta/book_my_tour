import "swiper/css";

import { useHome } from "@/hooks/useHome";
import { useEffect, useRef } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { Swiper as swiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";

const HomeSlideThree = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<swiperType | null>(null);
  const { packagesByCategory, fetchPackagesByCategory } = useHome();
  useEffect(() => {
    fetchPackagesByCategory("Adventure Packages");
  }, []);
  return (
    <div>
      <div className="border border-amber-500 rounded-xl shadow-xl gap-5  p-5 flex flex-col">
        <div className="flex justify-between items-center ">
          <h1 className="text-3xl font-semibold">
            "Escape Into Adventure Packages"
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
            {packagesByCategory["Adventure Packages"]?.map((pkg: any) => (
              <SwiperSlide key={pkg?._id}>
                <div
                  onClick={() => navigate(`/user/package-details/${pkg?._id}`)}
                  className=" w-full h-[240px] relative hover:cursor-pointer  "
                >
                  <img
                    src={pkg?.images?.[0]}
                    className=" w-full h-full object-cover object-center border-3 border-white rounded-xl"
                  />
                  <div className="absolute bottom-0  inset-x-0 border-b-3 border-x-3 border-white rounded-b-xl p-2 bg-black/40">
                    <p className="text-white text-center font-semibold">
                      {pkg?.name}
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

export default HomeSlideThree;
