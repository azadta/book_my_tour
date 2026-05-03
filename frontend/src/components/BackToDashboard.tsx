import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BackToDashboard = ({path}:{path:string}) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className=" text-sm flex items-center gap-2 bg-sky-600 text-white px-2 py-1 rounded hover:bg-sky-700 transition-all"
    >
      <FaArrowLeft size={12} />
      Back To Dashboard
    </button>
  );
};

export default BackToDashboard;
