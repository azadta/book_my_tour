import { Baby, User, Users, X } from "lucide-react";

interface IChildPricing {
  enabled: boolean;
  minAge?: number;
  maxAge?: number;
  percentage?: number;
}

interface MemberSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adultCount: number;
  setAdultCount: React.Dispatch<React.SetStateAction<number>>;
  childCount: number;
  setChildCount: React.Dispatch<React.SetStateAction<number>>;
  childPricing: IChildPricing;
}

const MemberSelectionModal = ({
  adultCount,
  childCount,
  childPricing,
  isOpen,
  onClose,
  setAdultCount,
  setChildCount,
}: MemberSelectionModalProps) => {
  if (!isOpen) return null;
  const isChildPricingEnabled = childPricing?.enabled;
  const childSubText = childPricing?.enabled
    ? `Ages ${childPricing.minAge}-${childPricing.maxAge} (
                    ${childPricing.percentage}% of adult price)`
    : "Ages 0-12 years";
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-xl ">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isChildPricingEnabled
                  ? "Select Travelers"
                  : "Select Number of Travelers"}
              </h3>
              <p className="text-xs text-gray-500">
                {isChildPricingEnabled
                  ? "Specify adult and child counts"
                  : "Specify total traveler count"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50/80 p-4 rounded-2xl border border-gray-100 ">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-xs  ">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {isChildPricingEnabled ? "Adults" : "Travelers"}
                </p>
                <p className="text-xs  text-gray-500">
                  {isChildPricingEnabled
                    ? `Ages ${childPricing.maxAge ?? "12"}+ years`
                    : "All age groups"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
              <button
                onClick={(e) => {
                  setAdultCount(Math.max(1, adultCount - 1));
                  e.currentTarget.blur();
                }}
                disabled={adultCount <= 1}
                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold disabled:opacity-30 disabled:hover:bg-gray-50  transition cursor-pointer "
              >
                -
              </button>
              <span className="w-5 h-5 text-center font-bold text-gray-900 text-sm">
                {adultCount}
              </span>
              <button
                onClick={(e) => {
                  setAdultCount(adultCount + 1);
                  e.currentTarget.blur();
                }}
                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold transition cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {isChildPricingEnabled&&(
            <div className="flex items-center justify-between bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-amber-600 shadow-xs">
                <Baby className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 ">Children</p>
                <p className="text-xs text-gray-500">{childSubText}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
              <button
                onClick={(e) => {
                  setChildCount(Math.max(0, childCount - 1));
                  e.currentTarget.blur();
                }}
                disabled={childCount <= 0}
                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold disabled:opacity-30 disabled:hover:bg-gray-50 transition cursor-pointer"
              >
                -
              </button>
              <span className="w-5 h-5 text-center font-bold text-gray-900 text-sm">
                {childCount}
              </span>
              <button
                onClick={(e) => {
                  setChildCount(childCount + 1);
                  e.currentTarget.blur();
                }}
                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold transition cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-blue-200 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default MemberSelectionModal;
