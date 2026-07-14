import { useHome } from "@/hooks/useHome";
import { cardPosition } from "../cardPosition";
import HomeTopSlideCard from "../homeTopSlideCard/HomeTopSlideCard";
import SunCardOne from "./SunCardOne";
import SunCardTwo from "./SunCardTwo";

const TopSlideThree = () => {
  const { packages } = useHome();
  return (
    <div className="p-1 w-full">
      <div className="relative shadow w-full    rounded-2xl  p-2  bg-yellow-50/50 ">
        {packages?.slice(10, 15).map((pkg: any, index: any) => (
          <HomeTopSlideCard
            key={pkg._id}
            position={cardPosition[index]}
            pkg={pkg}
          />
        ))}
        <SunCardOne />
        <SunCardTwo />
      </div>
    </div>
  );
};

export default TopSlideThree;
