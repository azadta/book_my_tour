import { useState } from "react";
import { BsBoxSeamFill } from "react-icons/bs";
import { HiCash } from "react-icons/hi";
import { LuClipboardPenLine } from "react-icons/lu";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import Loading from "../../components/Loading";
import OperatorDashboardSideBar from "../../components/OperatorDashboardSidebar";
import { useOperatorDashboard } from "../../hooks/useOperatorDashboard";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);

  const { PackagesCount, loading } = useOperatorDashboard();
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow p-4 border-b border-gray-200 fixed top-0 left-0 right-0">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Operator Dashboard
          </h2>
        </header>
        <div className="h-16.5"></div>
        <div className="flex flex-1 ">
          <div className="w-57 max-md:hidden"></div>
          <div className="max-md:hidden  fixed left-0 top-16.5 bottom-0">
            <OperatorDashboardSideBar />
          </div>
          <main className="flex-1 p-8 bg-gray-100 pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 items-center max-sm:w-60 mx-auto   ">
              <div className="bg-[#EBE3AF] p-6 rounded shadow flex items-center justify-center   gap-7   ">
                <LuClipboardPenLine className="text-5xl text-orange-400 max-sm:hidden max-lg:hidden" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
                  <p className="text-2xl font-bold text-gray-700"></p>
                </div>
              </div>
              <div className="bg-[#EBE3AF] p-6 rounded shadow flex items-center justify-center gap-7 w-full">
                < BsBoxSeamFill  className="text-5xl text-orange-400 max-sm:hidden max-lg:hidden" />
                <div>
                  <h2 className="text-xl font-semibold mb-2 ">
                    Total Packages
                  </h2>
                  <p className="text-2xl font-bold text-gray-700">
                    {PackagesCount}
                  </p>
                </div>
              </div>
              <div className="bg-[#EBE3AF] p-6 rounded shadow flex items-center justify-center gap-7">
                <HiCash className="text-5xl text-orange-400 max-sm:hidden max-lg:hidden" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Payouts Recieved
                  </h2>
                  <p className="text-2xl font-bold text-gray-700"></p>
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
            <OperatorDashboardSideBar />
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
