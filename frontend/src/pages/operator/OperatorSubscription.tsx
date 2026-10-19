import Loading from "@/components/Loading";
import { useOperatorSubscriptionCheckOut } from "@/hooks/useOperatorSubscriptionCheckout";
import { useSubscriptionPlan } from "@/hooks/useSubscriptionPlan";
import type { ISubscriptionDetails } from "@/interfaces/interfaces";
import type { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OperatorSubscription = () => {
  const { currentOperator, loading: operatorLoading } = useSelector(
    (state: RootState) => state.operator,
  );

  const { plans, fetchPlans, loading: plansLoading } = useSubscriptionPlan();
  const { handleSubscribe, isSubmitting } = useOperatorSubscriptionCheckOut();

  const [operatorSubscription, setOperatorSubscription] =
    useState<ISubscriptionDetails | null>(null);

  useEffect(() => {
    fetchPlans();
    setOperatorSubscription(currentOperator?.subscriptionDetails || null);
  }, [fetchPlans, currentOperator]);
  const calculateRemainingDays = (endDate?: string) => {
    if (!endDate) {
      return 0;
    }
    const diffTime = new Date(endDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const remainingDays = calculateRemainingDays(operatorSubscription?.endDate);
  const isNearExpiry =
    operatorSubscription?.status === "active" && remainingDays <= 7;
  const isSubscribed =
    operatorSubscription?.status === "active" && remainingDays > 0;
  const currentPlanId =
    typeof operatorSubscription?.planId === "object"
      ? operatorSubscription.planId?._id
      : operatorSubscription?.planId;

  if (plansLoading || operatorLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8  ">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight   ">
          Operator Membership & Plans{" "}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your tour listing limits, elevate your visibility ,and scale
          your travel business.
        </p>
      </div>

      <div
        className={`rounded-2xl p-6 border shadow-sm transition-all ${isSubscribed ? (isNearExpiry ? "bg-amber-50/70 border-amber-200" : "bg-emerald-50/60 border-emerald-200") : "bg-linear-to-r from-indigo-900 via-indigo-500 to-slate-900 text-white border-transparent"}`}
      >
        <div className="flex flex-col md:flex-row justify-between  items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <h2
                className={`text-xl font-bold ${isSubscribed ? "text-gray-900" : "text-white"}`}
              >
                {isSubscribed ? "Active Membership" : "No Active Subscription"}
              </h2>
            </div>
            <p
              className={`mt-1 text-sm ${isSubscribed ? "text-gray-600" : "text-indigo-200"}`}
            >
              {isSubscribed
                ? `Your business is currently enabled to list tours. You have ${remainingDays} days of validity remaining.`
                : "Unlock full booking capabilities, zero listing restrictions, and priority placement today."}
            </p>
          </div>

          {isSubscribed && (
            <div
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider ${isNearExpiry ? "bg-amber-100 text-amber-800 " : "bg-emerald-100 text-emerald-800"}`}
            >
              {remainingDays} Days left
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Choose Your Plan</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlanId === plan._id && isSubscribed;
            return (
              <div
                key={plan._id}
                className={`relative bg-white rounded-3xl shadow-xl border p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${isCurrentPlan ? "border-emerald-500 ring-2 ring-emerald-400/30" : "border-gray-200"}`}
              >
                {isCurrentPlan && (
                  <span className="absolute -top-3.5  left-8 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md ">
                    Current Plan
                  </span>
                )}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mt-2 ">
                    {plan.name}
                  </h4>
                  <div className="mt-4 flex  items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">
                      Rs {plan.price}
                    </span>
                    <span className="ml-2 text-base font-medium text-gray-500">
                      / {plan.durationDays} days
                    </span>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <ul className="space-y-4 text-sm text-gray-600">
                      <li className="flex items-center gap-3">
                        <span className="text-indigo-600 font-bold ">✓</span>
                        <span>
                          Up to
                          <strong className="text-gray-900 mx-1">
                            {plan.packageLimit}
                          </strong>
                          tour packages
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-indigo-600 font-bold">✓</span>{" "}
                        Instant booking dashboard
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-indigo-600 font-bold">✓</span>{" "}
                        24/7 Priority support
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleSubscribe(plan._id)}
                    disabled={isCurrentPlan && !isNearExpiry}
                    className={`w-full py-4 px-4  rounded-2xl font-semibold text-sm transition-all shadow-md ${isCurrentPlan && !isNearExpiry ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" : isNearExpiry ? "bg-amber-600 hover:bg-amber-700 text-white  shadow:amber-200" : "bg-indigo-600 hover:bg-indigo-700 text-white  shadow-indigo-100"}`}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : isCurrentPlan
                        ? isNearExpiry
                          ? "Renew Subscription"
                          : "Active Plan"
                        : isSubscribed
                          ? "Switch to Plan"
                          : "Activate Subscription"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OperatorSubscription;
