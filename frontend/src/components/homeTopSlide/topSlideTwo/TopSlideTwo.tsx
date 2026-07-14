import { useHome } from "@/hooks/useHome";
import { cardPosition } from "../cardPosition";
import HomeTopSlideCard from "../homeTopSlideCard/HomeTopSlideCard";
import SunSetCard from "./SunSetCard";


const TopSlideTwo = () => {
  const { packages } = useHome();
  return (
    <div className="relative shadow w-full   rounded-2xl  p-2  bg-yellow-50/50 ">
      {packages?.slice(5, 10).map((pkg: any, index: any) => (
        <HomeTopSlideCard
          key={pkg._id}
          position={cardPosition[index]}
          pkg={pkg}
        />
      ))}
      <SunSetCard />

      <span className=" font-jim  absolute top-13 right-4 tracking-wider text-3xl font-bold text-sky-600 max-w-[200px]">
        Escape into nature's paradise with crystal-clear waters, lush greenery,
        and stunning mountain views.
      </span>
    </div>
  );
};

export default TopSlideTwo;
