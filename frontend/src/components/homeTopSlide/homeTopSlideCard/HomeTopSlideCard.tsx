import { useNavigate } from "react-router-dom";
import "./homeTopSlideCard.css";

const HomeTopSlideCard = ({
  position,
  pkg,
}: {
  position: string;
  pkg: any;
}) => {
  const navigate = useNavigate();

  return (
    <div className={`homeSlideTopParent  ${position}`}>
      <div className="homeSlideTopCard ">
        <div
          className="content-box relative"
          style={{
            backgroundImage: `url(${pkg?.images?.[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <button
            onClick={() =>
              navigate(
                `/user/packages-list?destination=${pkg?.destinations[0]?._id}&destinationName=${pkg?.destinations[0]?.name}`,
              )
            }
            className="see-more absolute bottom-10 tracking-widest text-[#059699]"
          >
            See More
          </button>
        </div>
        <div className="district-box">
          <span className="district font-dosis tracking-wider">
            {pkg.destinations[0]?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeTopSlideCard;
