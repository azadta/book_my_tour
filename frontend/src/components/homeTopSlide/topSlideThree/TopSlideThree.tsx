import type { RootState } from "@/redux/store";
import { cardPosition } from "../cardPosition";
import HomeTopSlideCard from "../homeTopSlideCard/HomeTopSlideCard";
import SunCardOne from "./SunCardOne";
import SunCardTwo from "./SunCardTwo";
import { useSelector } from "react-redux";
import { useAllPackages } from "@/hooks/useAllPackages"; 

const TopSlideThree = () => {
  const { packages } = useAllPackages();
  return (
    <div className="p-1 w-full">
      <div className="relative shadow w-full    rounded-2xl  p-2  bg-yellow-50/50 ">
        {packages?.slice(7, 12).map((pkg: any, index: any) => (
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
