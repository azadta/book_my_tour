import { useCoupon } from "@/hooks/useCoupon";
import type { ICouponItem } from "@/interfaces/interfaces";
import {
  ArrowRight,
  Building2,
  Check,
  Info,
  PercentDiamondIcon,
  Search,
  Ticket,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AppliedCoupnsState {
  general?: ICouponItem | null;
  bank?: ICouponItem | null;
}

interface CouponProps {
  isOpen: boolean;
  onClose: () => void;
  bookingAmount: number;
  appliedCoupons: AppliedCoupnsState;
  onApplyCoupon: (coupon: ICouponItem) => void;
  onRemoveCoupon: (type: "GENERAL" | "BANK") => void;
}

const Coupon = ({
  isOpen,
  onClose,
  bookingAmount,
  appliedCoupons,
  onApplyCoupon,
  onRemoveCoupon,
}: CouponProps) => {
  const [activeTab, setActiveTab] = useState<"ALL" | "BANK" | "GENERAL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { bankOffers, fetchCoupons, generalCoupons, loading } = useCoupon();
  const allCoupons = [...bankOffers, ...generalCoupons];
  const filteredCoupons = (
    activeTab === "BANK"
      ? bankOffers
      : activeTab === "GENERAL"
        ? generalCoupons
        : allCoupons
  ).filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bankName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      fetchCoupons();
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ">
        <div className="p-6 bg-linear-to-r from-blue-900 to-indigo-900 text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
              <PercentDiamondIcon className="w-4 h-4" />
              Best Savings Guaranteed
            </div>

            <h2 className="text-xl font-black">Available Offers & Coupons</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 flex items-center gap-2 text-amber-800 text-xs font-medium shrink-0">
          <Info className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            You can combine <strong> 1 Promo Code </strong>and
            <strong>1 Bank Offer</strong>for maximum savings.
          </span>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-100 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2  " />
            <input
              type="text"
              placeholder="Search by code, bank or offer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
          </div>

          <div className="flex gap-2">
            {[
              { id: "ALL", label: "All Offers" },
              { id: "BANK", label: "Bank Offers", icon: Building2 },
              { id: "GENERAL", label: "Promo Codes", icon: Ticket },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />} {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm ">
              Loading available deals...
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm  ">
              No matching coupons found
            </div>
          ) : (
            filteredCoupons.map((coupon) => {
              const isEligible = bookingAmount >= coupon.minBookingAmount;
              const isGeneral = coupon.type === "GENERAL";
              const currentApplied = isGeneral
                ? appliedCoupons.general
                : appliedCoupons.bank;
              const isApplied = currentApplied?.code === coupon.code;
              return (
                <div
                  key={coupon._id}
                  className={`border rounded-2xl p-4 transition-all relative flex flex-col md:flex-row justify-between gap-4 ${isApplied ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-100" : isEligible ? "border-gray-200 bg-white hover:border-blue-300 shadow-xs" : "border-gray-100 bg-gray-50/50 opacity-70"}`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black px-2.5 py-1 rounded-lg tracking-wider uppercase">
                        {coupon.code}
                      </span>
                      {coupon.type === "BANK" ? (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Building2 className="w-3 h-3 " />
                          {coupon.bankName || "Bank Offer"}
                        </span>
                      ) : (
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          Promo Code
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-gray-900 text-sm">
                      {coupon.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed ">
                      {coupon.description}
                    </p>
                    {!isEligible && (
                      <p className="text-[11px] text-red-500 font-medium">
                        • Add Rs{" "}
                        {(
                          coupon.minBookingAmount - bookingAmount
                        ).toLocaleString("en-IN")}{" "}
                        more to unlock
                      </p>
                    )}
                  </div>

                  <div className="flex md:flex-col justify-between items-end shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 ">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-gray-400 block  font-medium ">
                        Save Up To
                      </span>
                      <span className="text-lg font-black text-emerald-600">
                        {coupon.discountType === "PERCENTAGE"
                          ? `Rs ${coupon.discountValue}% OFF`
                          : `Rs ${coupon.discountValue} OFF`}
                      </span>
                    </div>

                    {isApplied ? (
                      <button
                        onClick={() => onRemoveCoupon(coupon.type)}
                        className="mt-2 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5 " />
                        Remove
                      </button>
                    ) : (
                      <button
                        disabled={!isEligible}
                        onClick={(e) => {
                          onApplyCoupon(coupon);
                          e.currentTarget.blur();
                        }}
                        className={`mt-2 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${isApplied ? "bg-emerald-600 text-white" : isEligible ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                      >
                        Apply Offer
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupon;
