import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const { currentOperator } = useSelector((state: RootState) => state.operator);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow p-4 border-b border-gray-200 ">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Operator Dashboard
        </h2>
      </header>
      <div className="flex flex-1">
        <aside className="w-64  bg-gray-800 text-white flex flex-col p-6 justify-between">
          <div className="space-y-4">
            <button
              onClick={() => navigate(`/operator/create-package`)}
              className="py-3 px-4 bg-blue-600 rounded hover:bg-blue-700 w-full transition "
            >
              Create Package
            </button>
          </div>

          <div className="mt-10 border-t border-gray-600 pt-4">
            <button
              onClick={() => navigate(`/operator/profile`)}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded w-full transition"
            >
              <img
                src={currentOperator?.image}
                alt="Operator"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white text-sm font-medium ">
                My Profile
              </span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">My Packages</h2>
              <p className="text-2xl font-bold text-gray-700">42</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
              <p className="text-2xl font-bold text-gray-700">389</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Today's Bookings</h2>
              <p className="text-2xl font-bold text-gray-700">11</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Pending Requests</h2>
              <p className="text-2xl font-bold text-gray-700">6</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperatorDashboard;
