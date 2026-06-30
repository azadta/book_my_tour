import TopSlideOne from "./topSlideOne/TopSlideOne";
import TopSlideThree from "./topSlideThree/TopSlideThree";
import TopSlideTwo from "./topSlideTwo/TopSlideTwo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const HomeSlideTop = () => {
  return (
    <div>
      <Swiper
        speed={2000}
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 9000, disableOnInteraction: false }}
      >
        <SwiperSlide>
          <TopSlideOne />
        </SwiperSlide>

        <SwiperSlide>
          <TopSlideTwo />
        </SwiperSlide>

        <SwiperSlide>
          <TopSlideThree />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HomeSlideTop;
