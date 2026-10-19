import ConfirmationModel from "@/components/ConfirmationModal";
import ReUsableTable from "@/components/ReUsableTable";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useSubscriptionPlan } from "@/hooks/useSubscriptionPlan";
import type { ISubscriptionPlan } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSubscriptionPlanList = () => {
  const navigate = useNavigate();
  const { deletePlan, loading, plans, fetchPlans } = useSubscriptionPlan();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => Promise<void>>(
    () => async () => {},
  );

  const columns = [
    { label: "Plan Name", render: (plan: ISubscriptionPlan) => plan.name },
    { label: "Price (Rs)", render: (plan: ISubscriptionPlan) => plan.price },
    {
      label: "Package Limit",
      render: (plan: ISubscriptionPlan) => plan.packageLimit,
    },
    {
      label: "Duration (Days)",
      render: (plan: ISubscriptionPlan) => plan.durationDays,
    },
  ];

  const actions = [
    {
      label: () => "Edit",
      onClick: (plan: ISubscriptionPlan) =>
        navigate(FRONTEND_ROUTES.ADMIN.EDIT_SUBSCRIPTION_PLAN(plan._id)),
      className: "bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600",
      loadingText: "Editing",
      disabled: () => false,
    },
    {
      label: () => "Delete",
      onClick: (plan: ISubscriptionPlan) => {
        setModalMessage(`Are you sure want to delete the plan "${plan.name}"?`);
        setModalAction(() => () => deletePlan(plan._id));
        setModalOpen(true);
      },
      className: "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600",
      loadingText: "Deleting",
      disabled: () => false,
    },
  ];
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-5.125rem)]">
      <div className="flex-1 flex bg-gray-100">
        <div className="flex-1 p-5 min-w-0">
          <h1 className="text-md bg-sky-200 font-bold mb-1 text-center py-2">
            Subscription plan Management
          </h1>
          <ReUsableTable
            data={plans}
            columns={columns}
            actions={actions}
            loading={loading}
          />
          <div className="mt-5">
            <button
              onClick={() =>
                navigate(FRONTEND_ROUTES.ADMIN.CREATE_SUBSCRIPTION_PLAN)
              }
              className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 "
            >
              Create Subscription Plan
            </button>
          </div>
          <ConfirmationModel
            isOpen={modalOpen}
            message={modalMessage}
            onClose={() => setModalOpen(false)}
            onConfirm={async () => {
              await modalAction();
              setModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptionPlanList;
