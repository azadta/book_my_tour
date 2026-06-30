import HomeImageSlide from "@/components/homeImageSlide/HomeImageSlide";
import HomeSlideThree from "@/components/homeSlideThree/homeSlideThree";
import HomeSlideTwo from "@/components/homeSlideTwo/homeSlideTwo";
import HomeSlideTop from "@/components/homeTopSlide/HomeSlideTop";

const Home = () => {
  return (
    <div className="mb-5">
      <div className="pt-10 max-w-[1550px]  mx-auto flex flex-col gap-20">
        <HomeImageSlide />
        <HomeSlideTwo />
        <HomeSlideTop />
        <HomeSlideThree />
      </div>
    </div>
  );
};

export default Home;
