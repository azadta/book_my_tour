import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BackToDashboard = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/admin/dashboard`)}
      className="flex items-center gap-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-all"
    >
      <FaArrowLeft size={18} />
      Back To Dashboard
    </button>
  );
};

export default BackToDashboard;
