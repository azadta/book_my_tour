import "./sunCard.css";

const SunCardOne = () => {
  return (
    <div className="sunCard-one">
      <div className="sunCardContainer">
        <div className="cloud front">
          <span className="left-front"></span>
          <span className="right-front"></span>
        </div>
        <span className="sunBig-one sunshine"></span>
        <span className="sunBig-one"></span>
        <div className="cloud back">
          <span className="left-back"></span>
          <span className="right-back"></span>
        </div>
      </div>

      <div className="sunCard-header">
        <span className="font-jim tracking-wide ">
          Wander through majestic mountains, <br /> fresh air, peaceful valleys,
          and spectacular
          <br /> panoramic views
        </span>
      </div>
    </div>
  );
};

export default SunCardOne;
