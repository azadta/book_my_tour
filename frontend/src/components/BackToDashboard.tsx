import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BackToDashboard = ({path}:{path:string}) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className=" text-sm flex items-center gap-2 shadow-md bg-sky-200 text-black px-2 py-1 rounded hover:bg-sky-300 transition-all cursor-pointer"
    >
      <FaArrowLeft size={13} className="text-white " />
      Back To Dashboard
    </button>
  );
};

export default BackToDashboard;
