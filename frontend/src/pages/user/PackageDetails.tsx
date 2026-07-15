import Loading from "@/components/Loading";
import { usePackageDetails } from "@/hooks/usePackageDetails";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const PackageDetails = () => {
  const { id } = useParams();
  const { pkg: data, loading } = usePackageDetails(id as string);

  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  const [addedActivityIds, setAddedActivityIds] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const dayRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const isAutoScrolling = useRef(false);

  const removedCost =
    data?.itinerary.reduce((acc, day) => {
      const dayDeductions = day.activities.reduce((sum, act: any) => {
        return (
          sum +
          (act.customizable && removedActivityIds.includes(act.id)
            ? act.cost
            : 0)
        );
      }, 0);
      return acc + dayDeductions;
    }, 0) ?? 0;

  const addedCost =
    data?.itinerary.reduce((acc, day) => {
      return (
        acc +
        day.optionalActivities.reduce((sum, act) => {
          return sum + (addedActivityIds.includes(act.id) ? act.cost : 0);
        }, 0)
      );
    }, 0) ?? 0;

  const currentPrice = (data?.amount ?? 0) + addedCost - removedCost;

  const toggleRemovedActivity = (id: string) => {
    if (removedActivityIds.includes(id)) {
      setRemovedActivityIds(removedActivityIds.filter((item) => item !== id));
    } else {
      setRemovedActivityIds([...removedActivityIds, id]);
    }
  };

  const toggleAddedActivity = (id: string) => {
    if (addedActivityIds.includes(id)) {
      setAddedActivityIds(addedActivityIds.filter((item) => item !== id));
    } else {
      setAddedActivityIds([...addedActivityIds, id]);
    }
  };

  const scrollToDay = (dayNum: number) => {
    const element = dayRefs.current[dayNum];
    if (element) {
      isAutoScrolling.current = true;
      setActiveDay(dayNum);
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isAutoScrolling.current) {
        return;
      }
      const scrollPosition = window.scrollY + 200;
      if (!data) return;
      for (let dayPlan of data.itinerary) {
        const el = dayRefs.current[dayPlan.day];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveDay(dayPlan.day);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data?.itinerary]);

  const activeDayData =
    data?.itinerary.find((day) => day.day === activeDay) ?? data?.itinerary[0];
  const galleryImages = activeDayData?.gallery;

  if (loading) return <Loading />;

  if (!data) {
    return <p>Package not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-5 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[200px] sm:h-[300px] md:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-gray-200">
          <div className="md:col-span-2 h-full relative group overflow-hidden ">
            <img
              src={data.images[0]}
              alt="Main feature"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 "
            />
          </div>
          <div className="hidden md:block h-full overflow-hidden relative group">
            <img
              src={data.images[1]}
              alt="Destination Vista 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="hidden md:block h-full overflow-hidden relative group">
            <img
              src={data.images[2]}
              alt="Destination Vista 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 shadow-xs flex gap-2 overflow-x-auto scrollbar-none mb-6 ">
        {data.itinerary.map((item) => (
          <button
            key={item.day}
            onClick={() => scrollToDay(item.day)}
            className={`px-4 py-2 rounded-xl font-bold text-xs shrink-0 transition-all ${activeDay === item.day ? "bg-blue-600 text-white shadow-sm" : " bg-gray-100 text-gray-600"}`}
          >
            Day{item.day}
          </button>
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 self-start">
          <div className="lg:col-span-4">
            <div className=" hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] ">
              <h3 className="font-bold text-lg mb-4">Day Gallery</h3>

              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                {galleryImages?.map((image, index) => (
                  <div
                    key={index}
                    className="
                        aspect-square
                        rounded-3xl
                        overflow-hidden
                        shadow-lg
                        border
                        border-gray-100
                        group
                        "
                  >
                    <img
                      src={image}
                      className="
                            w-full
                            h-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-110
                            "
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <main className=" lg:col-span-5 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start gap-4 mb-4 ">
                <div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md mb -2 inline-block">
                    {data.category.name} Experience
                  </span>
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    {data.name}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 border-b border-gray-100 pb-4 mb-4 ">
                {" "}
                <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {data.destinations.map((dest) => dest.name).join(", ")}
                </span>
                <span className="flex items-center gap-1.5 ">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {data.duration.day} Days / {data.duration.night} Nights
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Destinations Covered
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.destinations.map((dest, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 border border-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-xl font-medium"
                    >
                      {dest.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {data.itinerary.map((dayPlan) => (
                <div
                  key={dayPlan.day}
                  ref={(el) => {
                    dayRefs.current[dayPlan.day] = el;
                  }}
                  className={`bg-white border rounded-3xl p-6 transition-all duration-300 scroll-mt-28 ${activeDay === dayPlan.day ? "border-blue-500 shadow-md ring-4 ring-blue-50" : "border-gray-100 shadow-sm "}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                      Day {dayPlan.day}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {dayPlan.title}
                    </h3>
                  </div>

                  <div className=" flex flex-col justify-center">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {dayPlan.description}
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-gray-100 rounded-2xl p-4 mt-5">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5 ">
                      <Camera className="w-3.5 h-3.5 text-gray-400" /> Day
                      Activities Included
                    </h4>
                    <div className="space-y-2.5">
                      {dayPlan.activities.map((act) => {
                        const isRemoved = removedActivityIds.includes(act.id);
                        return (
                          <div
                            key={act.id}
                            className={`flex justify-between items-center p-3 rounded-xl border transition-all text-sm ${isRemoved ? "bg-gray-100/50 border-dashed border-gray-200 " : "bg-white border-gray-100 shadow-xs"} `}
                          >
                            <div className="flex items-start gap-2.5">
                              {!isRemoved ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-4 h-4 border border-gray-300 rounded-full shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span
                                  className={`${isRemoved ? "line-through text-gray-400" : "font-semibold text-gray-800"}`}
                                >
                                  {act.name}
                                </span>
                                {act.customizable && (
                                  <span className="block text-[11px] text-blue-600 font-medium mt-0.5">
                                    {isRemoved
                                      ? "✕ Activity Removed"
                                      : "✨ Optional Activity"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 ml-4 shrink-0">
                              {act.cost > 0 && act.customizable && (
                                <span
                                  className={`text-xs font-bold ${isRemoved ? "line-through text-gray-400 " : "text-gray-700"}`}
                                >
                                  + Rs {act.cost}
                                </span>
                              )}
                              {act.customizable && (
                                <button
                                  onClick={() => toggleRemovedActivity(act.id)}
                                  className={`p-1.5  rounded-lg transition-colors `}
                                >
                                  {isRemoved ? (
                                    <p className="bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 px-1 cursor-pointer">
                                      add
                                    </p>
                                  ) : (
                                    <>
                                      <p className="hidden bg-red-100 hover:bg-red-200 min-[360px]:inline rounded-md text-red-600 px-1 cursor-pointer">
                                        Remove
                                      </p>
                                      <span className=" min-[360px]:hidden text-red-500 inline-flex items-cener justify-center bg-red-200 hover:bg-red-300 p-1 rounded-lg ">
                                        <Trash2 className="size-4" />
                                      </span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-5">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5 ">
                      You can add extra activities
                    </h4>
                    <div className="space-y-2.5">
                      {dayPlan.optionalActivities.map((act) => {
                        const isAdded = addedActivityIds.includes(act.id);
                        return (
                          <div
                            key={act.id}
                            className={`flex justify-between items-center p-3 rounded-xl border transition-all text-sm ${!isAdded ? " border-dashed border-gray-200 " : "bg-white border-gray-100 shadow-xs"} `}
                          >
                            <div className="flex items-start gap-2.5">
                              {isAdded ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                ""
                              )}
                              <div>
                                <span className={`text-gray-800 font-semibold`}>
                                  {act.name}
                                </span>

                                <span className="block text-[11px] text-blue-600 font-medium mt-0.5">
                                  {isAdded ? " Activity Added" : ""}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 ml-4 shrink-0">
                              {act.cost > 0 && (
                                <span className={`text-xs font-bold `}>
                                  + Rs {act.cost}
                                </span>
                              )}

                              <button
                                onClick={() => toggleAddedActivity(act.id)}
                                className={`p-1.5  rounded-lg transition-colors`}
                              >
                                {!isAdded ? (
                                  <p className="bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 px-1 cursor-pointer">
                                    Add
                                  </p>
                                ) : (
                                  <>
                                    <p className="hidden bg-red-100 hover:bg-red-200 min-[360px]:inline rounded-md text-red-600 px-1 cursor-pointer">
                                      Remove
                                    </p>
                                    <span className=" min-[360px]:hidden text-red-500 inline-flex items-cener justify-center bg-red-200 hover:bg-red-300 p-1 rounded-lg ">
                                      <Trash2 className="size-4" />
                                    </span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>

          <aside className="col-span-1 lg:col-span-3 lg:sticky self-start min-w-[320px]  lg:top-24 order-3 space-y-4 hidden lg:block">
            <div className=" space-y-4">
              <div className="bg-white border max-h-[350px] border-gray-100 rounded-3xl p-4 shadow-lg">
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Pricing Summary
                </h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-gray-900">
                    <span>Base Package Cost</span>
                    <span className="font-semibold text-gray-800">
                      Rs {data.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="overflow-y-auto max-h-[100px]">
                    {data.itinerary.map((day) =>
                      day.activities.map((act) => {
                        if (
                          act.customizable &&
                          removedActivityIds.includes(act.id)
                        ) {
                          return (
                            <div
                              key={act.id}
                              className=" flex justify-between text-xs text-red-400 font-medium bg-red-50/50 rounded-md px-1.5 py-1"
                            >
                              <span className="truncate max-w-[200px]">
                                Removed {act.name}
                              </span>
                              <span>- Rs {act.cost.toFixed(2)}</span>
                            </div>
                          );
                        }
                        return null;
                      }),
                    )}
                    {data.itinerary.map((day) =>
                      day.optionalActivities.map((act) => {
                        if (addedActivityIds.includes(act.id)) {
                          return (
                            <div
                              key={act.id}
                              className=" flex justify-between text-xs text-emerald-400 font-medium bg-emerald-50/50 rounded-md px-1.5 py-1"
                            >
                              <span className="truncate max-w-[200px]">
                                Added {act.name}
                              </span>
                              <span>+ Rs {act.cost.toFixed(2)}</span>
                            </div>
                          );
                        }
                        return null;
                      }),
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-1 flex justify-between items-baseline">
                    <span className="font-bold text-sm text-gray-900">
                      Final Total
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-black text-blue-600">
                        Rs {currentPrice.toFixed(2)}
                      </span>
                      <span className="block text-[12px] text-gray-400 mt-0.5">
                        per person / all taxes incl.
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-sm rounded-xl px-4 py-3 shadow-md shadow-blue-200 text-white transition-all active:scale-98">
                  Proceed to booking
                </button>
              </div>
              <div className="  hidden lg:flex flex-col bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-[350px] ">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider p-4 pb-3 border-b border-gray-100">
                  Itinerary Schedule
                </h3>
                <div className="flex-1 overflow-auto p-3">
                  {data.itinerary.map((item) => (
                    <button
                      key={item.day}
                      onClick={() => scrollToDay(item.day)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-semibold transition-all text-sm ${activeDay === item.day ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-600  hover:bg-gray-50"} `}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-bold shrink-0 ${activeDay === item.day ? "bg-blue-500 text-white " : "bg-gray-100 text-gray-700"}`}
                        >
                          Day {item.day}
                        </span>
                        <span
                          className={`truncate ${activeDay === item.day ? " text-white " : "bg-gray-100 text-gray-700"}`}
                        >
                          {item.title}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ml-1 opacity-80 ${activeDay === item.day ? "block" : "hidden"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="lg:hidden sticky  bottom-0 z-20  left-0 right-0  bg-white border-t border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.5)] px-4 py-3 pb-safe flex items-center justify-between gap-4 ">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Total Est. Cost
          </span>
          <span className="text-lg font-black text-blue-600 ">
            Rs {currentPrice.toLocaleString("en-IN")}
          </span>
        </div>
        <button className="flex-1 max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl text-center shadow-md active:scale-95 transition-all ">
          Book Package
        </button>
      </div>
    </div>
  );
};

export default PackageDetails;
