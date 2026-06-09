import { useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { FaUsersGear, FaUsersLine } from "react-icons/fa6";
import { GoUnverified } from "react-icons/go";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import AdminDashboardSideBar from "../../components/AdminDashboardSideBar";
import Loading from "../../components/Loading";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);

  const {
    loading,
    operatorsCount,
    pendingVerificationsCount,
    todaySignups,
    usersCount,
  } = useAdminDashboard();
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow p-4 border-b border-gray-200 fixed top-0 left-0 right-0">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Admin Dashboard
          </h2>
        </header>
        <div className="h-16.5"></div>
        <div className="flex flex-1 ">
          <div className="w-64 max-md:hidden"></div>
          <div className="max-md:hidden  fixed left-0 top-16.5 bottom-0">
            <AdminDashboardSideBar />
          </div>
          <main className="flex-1 p-8 bg-gray-100 pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 items-center max-sm:w-60 mx-auto   ">
              <div className="bg-[#EBE3AF] p-6 rounded shadow flex items-center justify-center   gap-7   ">
                <FaUsersLine className="text-5xl text-orange-400 max-sm:hidden max-lg:hidden" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Total users</h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {usersCount}
                  </p>
                </div>
              </div>
              <div className="bg-[#EBE3AF] p-6 rounded shadow flex items-center justify-center gap-7 w-full">
                <FaUsersGear className="text-5xl text-orange-400 max-sm:hidden max-lg:hidden" />
                <div>
                  <h2 className="text-xl font-semibold mb-2 ">
                    Total Operaters
                  </h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {operatorsCount}
                  </p>
                </div>
              </div>
              <div className="bg-[#EBE3AF] p-6 rounded shadow flex items-center justify-center gap-7">
                <AiOutlineLogin className="text-5xl text-orange-400 max-sm:hidden max-lg:hidden" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Total Signups</h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {todaySignups}
                  </p>
                </div>
              </div>
              <div className="bg-[#EBE3AF] p-6 rounded shadow flex items-center justify-center gap-7">
                <GoUnverified className="text-5xl text-orange-400 max-sm:hidden max-lg:hidden" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Pending Verifications
                  </h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {pendingVerificationsCount}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {!open && (
        <RxHamburgerMenu
          className="fixed top-0 right-0 md:hidden text-3xl text-orange-600"
          onClick={() => setOpen(true)}
        />
      )}
      {open && (
        <RiCloseLargeFill
          onClick={() => setOpen(false)}
          className=" fixed top-0 right-0 text-2xl z-60 "
        />
      )}
      {open && (
        <>
          <div className="fixed top-0 bottom-0 right-0 z-50   md:hidden">
            <AdminDashboardSideBar />
          </div>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden "
            onClick={() => setOpen(false)}
          ></div>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
