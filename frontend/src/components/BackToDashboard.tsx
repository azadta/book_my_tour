import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BackToDashboard = ({path}:{path:string}) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className=" text-sm flex items-center gap-2 shadow-md bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300 transition-all"
    >
      <FaArrowLeft size={12} />
      Back To Dashboard
    </button>
  );
};

export default BackToDashboard;
