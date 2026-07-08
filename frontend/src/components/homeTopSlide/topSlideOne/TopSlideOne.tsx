import { useSelector } from "react-redux";
import { cardPosition } from "../cardPosition";
import HomeTopSlideCard from "../homeTopSlideCard/HomeTopSlideCard";

import CloudCardOne from "./CloudCardOne";
import CloudCardTwo from "./CloudCardTwo";
import type { RootState } from "@/redux/store";
import { useAllPackages } from "@/hooks/useAllPackages"; 

const TopSlideOne = () => {
  const { packages } = useAllPackages();

  return (
    <div className="p-1 w-full">
      <div className="w-full relative shadow    rounded-2xl  p-2  bg-yellow-50/50">
        {packages?.slice(0, 5).map((pkg: any, index: any) => (
          <HomeTopSlideCard
            key={pkg._id}
            position={cardPosition[index]}
            pkg={pkg}
          />
        ))}
        <CloudCardOne />
        <CloudCardTwo />
      </div>
    </div>
  );
};

export default TopSlideOne;
