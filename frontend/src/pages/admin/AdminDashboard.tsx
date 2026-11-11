import BookingsBarChart from "@/components/charts/BookingsBarChart";
import BookingStatusDonutChart from "@/components/charts/BookingStatusDonutChart";
import RevenueLineChart from "@/components/charts/RevenueLineChart";
import { Building2, UserCheck, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import AdminDashboardSideBar from "../../components/AdminDashboardSideBar";
import Loading from "../../components/Loading";
import "../../css/adminDashboard.css";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);

  const {
    loading,
    operatorsCount,
    pendingVerificationsCount,
    todaySignups,
    usersCount,
    dashBoardData,
  } = useAdminDashboard();
  const statsConfig = [
    {
      title: "Total Users",
      value: usersCount,
      icon: Users,
      gradient: "from-emerald-500/15 to-teal-500/5",
      iconBG: "bg-emerald-500/10 text-emerald-600",
      borderColor: "hover:border-emerald-500/30",
      glowColor: "group-hover:bg-emerald-500/10",
      badge: "Registered",
    },
    {
      title: "Total Operators",
      value: operatorsCount,
      icon: Building2,
      gradient: "from-amber-500/15 to-orange-500/5",
      iconBG: "bg-amber-500/10 text-amber-600",
      borderColor: "hover:border-amber-500/30",
      glowColor: "group-hover:bg-amber-500/10",
      badge: "Partners",
    },
    {
      title: "Pending verifications",
      value: pendingVerificationsCount,
      icon: UserCheck,
      gradient: "from-rose-500/15 to-pink-500/5",
      iconBG: "bg-rose-500/10 text-rose-600",
      borderColor: "hover:border-rose-500/30",
      glowColor: "group-hover:bg-rose-500/10",
      badge: "Action Req.",
    },
    {
      title: "Today Signups",
      value: todaySignups,
      icon: UserPlus,
      gradient: "from-sky-500/15 to-blue-500/5",
      iconBG: "bg-sky-500/10 text-sky-600",
      borderColor: "hover:border-sky-500/30",
      glowColor: "group-hover:bg-sky-500/10",
      badge: "New Today",
    },
  ];
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="min-h-[calc(100vh-5.125rem)] flex flex-col">
        <div className="flex flex-1 ">
          <main className="flex-1 p-8 bg-gray-100 pt-10 flex flex-col gap-10">
            <div className="w-full  grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-5  justify-items-center max-sm:w-60 mx-auto gap-y-15  ">
              {statsConfig?.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className={`w-full group relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${card.borderColor}`}
                  >
                    <div
                      className={`absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl transition-all duration-500 ${card.glowColor}`}
                    />
                    <div className="flex items-center justify-between mb-4 relative z-10 ">
                      <div
                        className={`flex items-center justify-center size-12 rounded-xl ${card.iconBG} border border-black/5 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 flex items-center gap-0.5">
                        {card.badge}
                      </span>
                    </div>

                    <div className="relative z-10 flex flex-col gap-0.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {card.title}
                      </span>
                      <p className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {card.title === "Total Revenue"
                          ? card.value?.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : card.value}
                      </p>
                    </div>

                    <div
                      className={`absolute bottom-0 inset-x-0 h-1 bg-linear-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                  </div>
                );
              })}
            </div>
            <RevenueLineChart monthlyRevenue={dashBoardData?.monthlyRevenue} />
            <div className="grid grid-cols-2 gap-5">
              <BookingsBarChart
                monthlyRevenue={dashBoardData?.monthlyRevenue}
              />
              <BookingStatusDonutChart
                statusData={dashBoardData?.bookingStatusBreakDown}
              />
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
