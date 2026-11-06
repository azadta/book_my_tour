import HomeSlideThree from "@/components/homeSlideThree/HomeSlideThree";
import HomeSlideTwo from "@/components/homeSlideTwo/HomeSlideTwo";
import HomeSlideTop from "@/components/homeTopSlide/HomeSlideTop";
import HomeImageSlide from "../../components/homeImageSlide/HomeImageSlide";

const Home = () => {
  return (
    <div className="mb-5">
      <div className="pt-10 max-w-[1550px] px-5  mx-auto flex flex-col gap-20">
        <HomeImageSlide />
        <HomeSlideTwo />
        <HomeSlideTop />
        <HomeSlideThree />
      </div>
    </div>
  );
};

export default Home;
