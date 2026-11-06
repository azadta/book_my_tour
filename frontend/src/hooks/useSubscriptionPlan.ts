import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { ISubscriptionPlan, SubscritptionPlanForm } from "@/interfaces/interfaces";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useCallback, useState } from "react";

import { toast } from "react-toastify";

export const useSubscriptionPlan = () => {
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [plan, setPlan] = useState<ISubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        APP_ROUTES.SUBSCRIPTION_PLANS.ADMIN.LIST,
      );
      setPlans(data.result);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = async (payload: SubscritptionPlanForm) => {
    setSubmitting(true);
    try {
      await axiosInstance.post(
        APP_ROUTES.SUBSCRIPTION_PLANS.ADMIN.CREATE,
        payload,
      );
      toast.success(FEEDBACK_MESSAGES.SUBSCRIPTION_PLANS.SUCCESS.CREATE);
    } finally {
      setSubmitting(false);
    }
  };
  const fetchPlanDetails = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.SUBSCRIPTION_PLANS.ADMIN.DETAIL(id),
      );
      setPlan(data.result);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  },[]);

  const updatePlan = async (
    planId: string,
    payload: Partial<ISubscriptionPlan>,
  ) => {
    setSubmitting(true);
    try {
      await axiosInstance.put(
        APP_ROUTES.SUBSCRIPTION_PLANS.ADMIN.UPDATE(planId),
        payload,
      );
      toast.success(FEEDBACK_MESSAGES.SUBSCRIPTION_PLANS.SUCCESS.UPDATE);
    } finally {
      setSubmitting(false);
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      await axiosInstance.delete(
        APP_ROUTES.SUBSCRIPTION_PLANS.ADMIN.DELETE(planId),
      );
      toast.success(FEEDBACK_MESSAGES.SUBSCRIPTION_PLANS.SUCCESS.DELETE);
      fetchPlans();
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    plans,
    loading,
    submitting,
    deletePlan,
    fetchPlans,
    updatePlan,
    createPlan,
    fetchPlanDetails,
    plan,
  };
};
