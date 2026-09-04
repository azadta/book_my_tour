import AddUserReviewModal from "@/components/AddUserReviewModal";
import Loading from "@/components/Loading";
import PackageReviews from "@/components/PackageReviews";
import { usePackageDetails } from "@/hooks/usePackageDetails";
import type { RootState } from "@/redux/store";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Ticket,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Coupon from "./Coupon";
import type { ICouponItem } from "@/interfaces/interfaces";
import { useWallet } from "@/hooks/useWallet";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";

interface AppliedCouponsState {
  general?: ICouponItem | null;
  bank?: ICouponItem | null;
}

const PackageDetails = () => {
  const { id } = useParams();
  const {
    pkg: data,
    loading,
    reviewStats,
    reviews,
    closeModal,
    editingReview,
    isModalOpen,
    openCreateModal,
    openEditModal,
    saveReview,

    submittingReview,
    deleteReview,

    handleBooking,
    isBookingLoading,
  } = usePackageDetails(id as string);
  const navigate = useNavigate();
  const { balance: walletBalance } = useWallet();
  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCouponsState>({
    general: null,
    bank: null,
  });
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  const [addedActivityIds, setAddedActivityIds] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState(1);

  const [isWalletApplied, setIsWalletApplied] = useState(false);
  const dayRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { currentUser } = useSelector((state: RootState) => state.user);

  const isAutoScrolling = useRef(false);

  const calculateCouponDiscount = (
    coupon: ICouponItem | null | undefined,
    baseAmount: number,
  ) => {
    if (!coupon || baseAmount <= 0) return 0;
    if (baseAmount < coupon?.minBookingAmount) return 0;
    let discount = 0;
    if (coupon?.discountType === "PERCENTAGE") {
      discount = (baseAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon?.discountValue as number;
    }
    return Math.min(discount, baseAmount);
  };

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

  const subTotalPrice = (data?.amount ?? 0) + addedCost - removedCost;
  const generalDiscount = useMemo(() => {
    return calculateCouponDiscount(appliedCoupons.general, subTotalPrice);
  }, [appliedCoupons.general, subTotalPrice]);

  const priceAfterGeneral = Math.max(0, subTotalPrice - generalDiscount);
  const bankDiscount = useMemo(() => {
    return calculateCouponDiscount(appliedCoupons.bank, priceAfterGeneral);
  }, [appliedCoupons.bank, priceAfterGeneral]);
  const totalDiscount = generalDiscount + bankDiscount;
  const payablePrice = Math.max(0, subTotalPrice - totalDiscount);
  const walletDeduction = isWalletApplied
    ? Math.min(walletBalance, payablePrice)
    : 0;
  const finalPayablePrice = Math.max(0, payablePrice - walletDeduction);

  const handleApplyCoupon = (coupon: ICouponItem) => {
    if (coupon.type === "GENERAL") {
      setAppliedCoupons((prev) => ({ ...prev, general: coupon }));
    } else if (coupon.type === "BANK") {
      setAppliedCoupons((prev) => ({ ...prev, bank: coupon }));
    }
  };

  const handleRemoveCoupon = (type: "GENERAL" | "BANK") => {
    if (type === "GENERAL") {
      setAppliedCoupons((prev) => ({ ...prev, general: null }));
    } else if (type === "BANK") {
      setAppliedCoupons((prev) => ({ ...prev, bank: null }));
    }
  };

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

  const scrollToReviews = () => {
    document
      .getElementById("reviews-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const onProceedToBooking = () => {
    if (!id) return;
    handleBooking(
      addedActivityIds,
      removedActivityIds,
      appliedCoupons.general?.code as string,
      appliedCoupons.bank?.code as string,
      isWalletApplied,
      {
        name: currentUser?.name as string,
        email: currentUser?.email as string,
        phone: currentUser?.mobile,
      },
    );
  };

  const handleStartChat = () => {
    navigate(
      `${FRONTEND_ROUTES.CHAT.USER_CHAT_PAGE}?userId=${data?.operatorId}`,
    );
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
              <div className="flex flex-col items-center justify-between gap-10">
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

                <button
                  onClick={handleStartChat}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-md shadow-emerald-900/10 hover:shadow-lg transtion-all duration-200 cursor-pointer border border-emerald-500/20 "
                >
                  <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Chat with Host</span>
                </button>
              </div>
            </div>
          </div>

          <main className=" lg:col-span-5 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start gap-4 mb-2 ">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md mb -2 inline-block">
                      {data.category.name} Experience
                    </span>
                    {reviewStats && reviewStats?.totalReviews > 0 ? (
                      <button
                        onClick={(e) => {
                          scrollToReviews();
                          e.currentTarget.blur();
                        }}
                        className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md transition-colors cursor-pointer "
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{reviewStats?.averageRating.toFixed(1)}</span>
                        <span className="text-amber-600 font-normal">
                          ({reviewStats?.totalReviews})
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          scrollToReviews();
                          e.currentTarget.blur();
                        }}
                        className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md transition-colors cursor-pointer "
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

                        <span className="text-amber-600 font-normal">
                          Be the first to review
                        </span>
                      </button>
                    )}
                  </div>
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
                                      <span className=" min-[360px]:hidden text-red-500 inline-flex items-center justify-center bg-red-200 hover:bg-red-300 p-1 rounded-lg ">
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

          <aside className="col-span-1 lg:col-span-3 lg:sticky self-start min-w-[250px]  lg:top-24 order-3 space-y-4 hidden lg:block">
            <div className=" space-y-4">
              <div className="bg-white border max-h-[350px] border-gray-100 rounded-3xl p-5 shadow-gray-100/50 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900 ">
                    Booking Summary
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full ">
                    <ShieldCheck className="w-3.5 h-3.5 " />
                    Instant Confirmation
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm flex-1 overflow-y-auto pr-2">
                  <div className="flex justify-between  text-gray-900">
                    <span>Base Package Price</span>
                    <span className="font-semibold text-gray-800">
                      Rs {data.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="overflow-y-auto max-h-[120px] space-y-1">
                    {data.itinerary.map((day) =>
                      day.activities.map((act) => {
                        if (
                          act.customizable &&
                          removedActivityIds.includes(act.id)
                        ) {
                          return (
                            <div
                              key={act.id}
                              className=" flex justify-between text-xs text-red-500 font-medium bg-red-50/50 rounded-md px-1.5 py-1"
                            >
                              <span className="truncate max-w-[180px]">
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
                              className=" flex justify-between text-xs text-emerald-600 font-medium bg-emerald-50/50 rounded-md px-1.5 py-1"
                            >
                              <span className="truncate max-w-[180px]">
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

                  {(addedCost > 0 || removedCost > 0) && (
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 font-medium">
                      <span>Sub Total</span>
                      <span>Rs {subTotalPrice.toFixed(2)}</span>
                    </div>
                  )}

                  {(appliedCoupons.general || appliedCoupons.bank) && (
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Discounts Applied
                      </span>

                      {appliedCoupons.general && (
                        <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-100 text-emerald-800 text-xs px-2.5 py-1.5 rounded-xl">
                          <div className="flex items-center gap-1.5 truncate">
                            <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-bold truncate">
                              {appliedCoupons.general.code}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-bold text-emerald-700">
                              - Rs {generalDiscount.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemoveCoupon("GENERAL")}
                              className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                              title="Remove Coupon"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                      {appliedCoupons.bank && (
                        <div className="flex items-center justify-between bg-amber-50/80 border border-amber-100 text-amber-800 text-xs px-2.5 py-1.5 rounded-xl">
                          <div className="flex items-center gap-1.5 truncate">
                            <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="font-bold truncate">
                              {appliedCoupons.bank.code}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-bold text-amber-700">
                              - Rs {bankDiscount.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemoveCoupon("BANK")}
                              className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                              title="Remove Coupon"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100 ">
                    <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-bold text-gray-900 ">
                              Use Wallet Balance
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Available: Rs {walletBalance.toFixed()}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isWalletApplied}
                            onChange={(e) =>
                              setIsWalletApplied(e.target.checked)
                            }
                            disabled={walletBalance <= 0}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 " />
                        </label>
                      </div>

                      {isWalletApplied && walletDeduction > 0 && (
                        <div className="mt-2 text-xs flex justify-between font-semibold text-blue-700 bg-blue-100/60 px-2 py-1 rounded-lg ">
                          <span>Wallet Discount</span>
                          <span>-Rs {walletDeduction.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <div className="font-bold text-sm text-gray-900">
                      Final Total
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-blue-600">
                        Rs {finalPayablePrice.toFixed(2)}
                      </span>
                      {totalDiscount > 0 && (
                        <span className="block text-[11px] text-emerald-600 font-bold">
                          Total saved:Rs {totalDiscount.toFixed(2)}
                        </span>
                      )}

                      <span className="block text-[11px] text-gray-400 mt-0.5 ">
                        per person/ all taxes incl.
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onProceedToBooking}
                  disabled={isBookingLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-sm rounded-xl px-4 py-3 shadow-md shadow-blue-200 text-white transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isBookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : finalPayablePrice === 0 ? (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Pay Full Amount Via Wallet</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>
                        {isWalletApplied && walletDeduction > 0
                          ? `Pay remaining Rs ${finalPayablePrice.toFixed(2)}`
                          : `Pay with Razorpay`}
                      </span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-gray-500 mt-3 flex items-center justify-center gap-1 ">
                  <Sparkles className="w-3 h-3 text-amber-500 " />
                  UPI, CREDIT/DEBIT Cards, NetBanking, Wallets Supported
                </p>
              </div>

              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-3 flex items-center justify-between mb-4 ">
                <div className="flex items-center gap-2.5">
                  <div className="bg-blue-600 text-white p-2 rounded-xl">
                    <Ticket className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      Bank Offers & Promo Codes
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {totalDiscount > 0
                        ? `Rs ${totalDiscount.toFixed(2)} total savings applied`
                        : "Combine One Promo + 1 Bank Offer"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-blue-200
                shadow-xs hover:bg-blue-50 transition cursor-pointer "
                >
                  {appliedCoupons.general || appliedCoupons.bank
                    ? "Manage"
                    : "Apply Offers"}
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
      {reviewStats?.totalReviews === 0 && (
        <section id="reviews-section">
          <div className="max-w-[1540px] mx-auto px-4 mt-5 bg-white border border-gray-100 rounded-3xl py-10 shadow-sm ">
            <div className="flex flex-col items-center text-center space-y-4 ">
              <MessageSquare className="w-12 h-12 text-blue-500 " />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  No Reviews Yet
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Be the first traveler to share your experience.
                </p>
              </div>
              <button
                onClick={() => openCreateModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
              >
                Write a Review
              </button>
            </div>
          </div>
        </section>
      )}

      <PackageReviews
        onDeleteReview={deleteReview}
        onEditReview={openEditModal}
        stats={reviewStats}
        reviews={reviews}
        openCreateModal={openCreateModal}
      />
      <div className="lg:hidden sticky  bottom-0 z-20  left-0 right-0  bg-white border-t border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.5)] px-3 py-3 pb-safe flex items-center justify-between gap-4 sm:-mx-6  ">
        <button
          onClick={handleStartChat}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-2 py-1 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-md shadow-emerald-900/10 hover:shadow-lg transtion-all duration-200 cursor-pointer border border-emerald-500/20 "
        >
          <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Chat with Host</span>
        </button>

        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Total Payable
          </span>
          <span className="text-lg font-black text-blue-600 ">
            Rs {payablePrice.toLocaleString("en-IN")}
          </span>
        </div>
        <button
          onClick={onProceedToBooking}
          disabled={isBookingLoading}
          className="flex-1 max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer "
        >
          {isBookingLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Pay with Razorpay</span>
          )}
        </button>
      </div>

      <AddUserReviewModal
        isOpen={isModalOpen}
        loading={submittingReview}
        initialData={editingReview}
        onClose={closeModal}
        onSubmit={saveReview}
      />
      <Coupon
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        bookingAmount={subTotalPrice}
        appliedCoupons={appliedCoupons}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />
    </div>
  );
};

export default PackageDetails;
