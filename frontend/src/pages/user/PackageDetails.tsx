import AddUserReviewModal from "@/components/AddUserReviewModal";
import { ItineraryDayCard } from "@/components/itinerary/ItineraryDayCard";
import Loading from "@/components/Loading";
import MemberSelectionModal from "@/components/MemberSelectionModal";
import PackageReviews from "@/components/PackageReviews";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { usePackageDetails } from "@/hooks/usePackageDetails";
import { useWallet } from "@/hooks/useWallet";
import type { ICouponItem } from "@/interfaces/interfaces";
import {
  ArrowRightCircle,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Ticket,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Coupon from "./Coupon";

interface AppliedCouponsState {
  general?: ICouponItem | null;
  bank?: ICouponItem | null;
}

const PackageDetails = () => {
  const { id } = useParams();
  const {
    pkg: data,
    packageLoading,
    reviewLoading,
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
  const [isMemberModalOPen, setIsMemberModalOpen] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const dayRefs = useRef<Record<number, HTMLDivElement | null>>({});

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

  const singleAdultSubTotal = (data?.amount ?? 0) + addedCost - removedCost;
  const singleAdultGeneralDiscount = useMemo(() => {
    return calculateCouponDiscount(appliedCoupons.general, singleAdultSubTotal);
  }, [appliedCoupons.general, singleAdultSubTotal]);

  const singleAdultPriceAfterGeneral = Math.max(
    0,
    singleAdultSubTotal - singleAdultGeneralDiscount,
  );
  const singleAdultBankDiscount = useMemo(() => {
    return calculateCouponDiscount(
      appliedCoupons.bank,
      singleAdultPriceAfterGeneral,
    );
  }, [appliedCoupons.bank, singleAdultPriceAfterGeneral]);
  const singleAdultTotalDiscount =
    singleAdultGeneralDiscount + singleAdultBankDiscount;
  const singleAdultPayable = Math.max(
    0,
    singleAdultSubTotal - singleAdultTotalDiscount,
  );
  let totalChildAmount = 0;

  let totalDiscountApplied = singleAdultTotalDiscount * adultCount;
  let childUnitPrice = 0;

  if (childCount > 0 && data?.childPricing?.enabled) {
    const childPercentage = (data.childPricing.percentage ?? 0) / 100;
    childUnitPrice = data?.childPricing?.enabled
      ? Math.round(
          singleAdultPayable *
            ((data?.childPricing?.percentage as number) / 100),
        )
      : singleAdultPayable;
    const singleChildTotalDiscount = singleAdultTotalDiscount * childPercentage;
    totalChildAmount = childUnitPrice * childCount;
    totalDiscountApplied += singleChildTotalDiscount * childCount;
  }

  const totalAdultAmount = singleAdultPayable * adultCount;

  const grandSubtotal = totalAdultAmount + totalChildAmount;
  const walletDeduction = isWalletApplied
    ? Math.min(walletBalance, grandSubtotal)
    : 0;
  const finalPayablePrice = Math.max(0, grandSubtotal - walletDeduction);

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

  const handleStartChat = () => {
    navigate(
      `${FRONTEND_ROUTES.CHAT.USER_CHAT_PAGE}?userId=${data?.operatorId?._id}`,
    );
  };

  const formatDateForDay = (startDateStr?: string, dayNumber: number = 1) => {
    if (!startDateStr) {
      return `Day ${dayNumber}`;
    }
    const date = new Date(startDateStr);
    date.setDate(date.getDate() + (dayNumber - 1));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    }).format(date);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isAutoScrolling.current) {
        return;
      }
      const scrollPosition = window.scrollY + 180;
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
  const onProceedToTravelerDetails = () => {
    if (!id) return;
    const bookingPayload = {
      packageId: id,
      addedActivityIds,
      removedActivityIds,
      generalCouponCode: appliedCoupons.general?.code || null,
      bankCouponCode: appliedCoupons.bank?.code || null,
      isWalletApplied,
      adultCount,
      childCount,
      walletDeduction,
      finalPayablePrice,
    };
    navigate(`/booking/traveler-details`, { state: bookingPayload });
  };

  if (packageLoading) return <Loading />;

  if (!data) {
    return <p>Package not found</p>;
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 font-sans pb-5 sm:px-6 lg:px-8 pt-3">
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
            <div className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
              <h3 className="font-bold text-lg ">Itinerary & Gallery</h3>
              <div className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-5 flex flex-col bg-white p-3 rounded-2xl border border-gray-100 shadow-sm max-h-[calc(100vh-14rem)]">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider p-2 pb-2 border-b border-gray-100">
                    Schedule
                  </h4>
                  <div className="flex-1 overflow-auto p-1 space-y-1">
                    {data.itinerary.map((item) => (
                      <button
                        key={item.day}
                        onClick={(e) => {
                          scrollToDay(item.day);
                          e.currentTarget.blur();
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-semibold transition-all text-xs  duration-200 ${activeDay === item.day ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "  hover:bg-gray-50"} `}
                      >
                        <div className="flex items-center  gap-2 truncate w-full">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-bold shrink-0 transition-all duration-200 ${activeDay === item.day ? "bg-blue-500  " : "bg-gray-100 text-gray-700"}`}
                          >
                            Day {item.day}
                          </span>
                          <span
                            className={`truncate transition-all duration-200 ${activeDay === item.day ? "" : "bg-gray-100 text-gray-700"}`}
                          >
                            {formatDateForDay(data.startDate, item.day)}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 ml-1 opacity-80 ${activeDay === item.day ? "block" : "hidden"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-7 flex flex-col gap-3">
                  <div className="flex flex-col gap-2.5">
                    {galleryImages?.slice(0, 3).map((image, index) => (
                      <div
                        key={index}
                        className="w-full h-[165px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 group shrink-0 "
                      >
                        <img
                          src={image}
                          alt={`Gallery Item ${index + 1}`}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-start pt-1">
                    <button
                      onClick={handleStartChat}
                      type="button"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-md shadow-emerald-900/10 hover:shadow-lg transition-all duration-200 cursor-pointer border border-emerald-500/20 shrink-0 min-w-40 "
                    >
                      <MessageSquare
                        className={`w-4 h-4 transition-transform group-hover:scale-110`}
                      />
                      <span>Chat with Host</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className=" lg:col-span-5 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="w-full">
                <div className="flex items-center gap-2 ">
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
                <div className="flex items-center justify-between mb-2 ">
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    {data.name}
                  </h1>
                  <span className="flex items-center gap-1.5 ">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {data.duration.day} Days / {data.duration.night} Nights
                  </span>
                </div>
                <p className="text-sm mb-2">
                  Starts from: <strong>{data.startPoint}</strong>
                </p>
              </div>

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 border-b border-gray-100 pb-4 mb-4 ">
                {" "}
                <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Destinations:
                  <strong>
                    {data.destinations.map((dest) => dest.name).join(", ")}
                  </strong>
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Specifications
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.specifications?.split(",").map((specification, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 border border-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-xl font-medium"
                    >
                      {specification}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {data.itinerary.map((dayPlan) => (
                <ItineraryDayCard
                  key={dayPlan.day}
                  dayPlan={dayPlan}
                  activeDay={activeDay}
                  removedActivityIds={removedActivityIds}
                  addedActivityIds={addedActivityIds}
                  toggleAddedActivity={toggleAddedActivity}
                  toggleRemovedActivity={toggleRemovedActivity}
                  setDayRef={(day, el) => {
                    dayRefs.current[day] = el;
                  }}
                />
              ))}
            </div>
          </main>

          <aside className="col-span-1 lg:col-span-3 lg:sticky self-start min-w-[250px]  lg:top-24 order-3 space-y-4 hidden lg:block">
            <div className=" space-y-4">
              <div className="bg-white border  border-gray-100 rounded-3xl p-5 shadow-gray-100/50 flex flex-col">
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
                    <span>
                      Base Package Price (
                      {data?.childPricing.enabled
                        ? "Per Adult"
                        : "Per Traveler"}
                      )
                    </span>
                    <span className="font-semibold text-gray-800">
                      Rs {data.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="overflow-y-auto  space-y-1">
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

                  <div className="pt-2 border-t border-gray-100 space-y-1.5 text-sm text-gray-600">
                    <div className="flex justify-between font-medium">
                      <span>
                        {data?.childPricing?.enabled
                          ? "Adults: "
                          : "Travelers: "}
                        (<strong className="text-gray-900">{adultCount}</strong>{" "}
                        x Rs {singleAdultPayable.toFixed(2)})
                      </span>
                      <span className="font-semibold text-gray-800">
                        Rs {totalAdultAmount.toFixed(2)}
                      </span>
                    </div>
                    {childCount > 0 && data?.childPricing?.enabled && (
                      <div className="flex justify-between font-medium">
                        <span>
                          Children: (
                          <strong className="text-gray-900">
                            {childCount}
                          </strong>{" "}
                          x Rs {childUnitPrice.toFixed(2)})
                        </span>
                        <span className="font-semibold text-gray-800">
                          Rs {totalChildAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {(appliedCoupons.general || appliedCoupons.bank) && (
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Discounts Applied(Per Adult)
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
                              - Rs {singleAdultGeneralDiscount.toFixed(2)}
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
                              - Rs {singleAdultBankDiscount.toFixed(2)}
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

                  <div className="flex justify-between font-bold text-sm text-gray-800 mt-4">
                    <p>SubTotal</p>
                    <p>{grandSubtotal.toFixed(2)}</p>
                  </div>

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
                    <div className="font-bold text-[16px] text-gray-800">
                      Total booking Amount
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-blue-600">
                        Rs {grandSubtotal.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
                      </span>
                      {totalDiscountApplied > 0 && (
                        <span className="block text-[11px] text-emerald-600 font-bold">
                          Total saved:Rs {totalDiscountApplied.toFixed(2)}
                        </span>
                      )}

                      <span className="block text-[11px] text-gray-400 mt-0.5 ">
                        per person/ all taxes incl.
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onProceedToTravelerDetails}
                  className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-sm rounded-xl px-4 py-3 shadow-md shadow-blue-200 text-white transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer "
                >
                  <span>Continue to Traveler Details</span>
                  <ArrowRightCircle className="w-5 h-5" />
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
                      {totalDiscountApplied > 0
                        ? `Rs ${totalDiscountApplied.toFixed(2)} total savings applied`
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

              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-3 flex items-center justify-between mb-4 ">
                <div className=" flex items-center gap-2.5">
                  <div className="bg-blue-600 text-white p-2 rounded-xl">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      Travelers & Guests
                    </span>
                    {data?.childPricing?.enabled && (
                      <span className="text-[14px] font-semibold text-gray-800">
                        <strong>{adultCount}</strong> Adult
                        {adultCount > 1 ? "s" : ""},{" "}
                        <strong>{childCount}</strong> Child
                        {childCount > 1 ? "ren" : ""}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    setIsMemberModalOpen(true);
                    e.currentTarget.blur();
                  }}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-xs hover:bg-blue-50 transition cursor-pointer"
                >
                  Manage Travelers Count
                </button>
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
            Rs {grandSubtotal.toLocaleString("en-IN")}
          </span>
        </div>
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
        bookingAmount={singleAdultSubTotal}
        appliedCoupons={appliedCoupons}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />
      <MemberSelectionModal
        isOpen={isMemberModalOPen}
        onClose={() => setIsMemberModalOpen(false)}
        adultCount={adultCount}
        setAdultCount={setAdultCount}
        childCount={childCount}
        setChildCount={setChildCount}
        childPricing={data?.childPricing}
      />
    </div>
  );
};

export default PackageDetails;
