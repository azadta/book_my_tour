import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { ISubscriptionPlan } from "@/interfaces/interfaces";
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
      setPlans(data);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.SUBSCRIPTION_PLANS.ERROR.FETCH_PLANS;
      console.error(message, error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = async (payload: ISubscriptionPlan) => {
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
  const fetchPlanDetails = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.SUBSCRIPTION_PLANS.ADMIN.DETAIL(id),
      );
      setPlan(data);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.SUBSCRIPTION_PLANS.ERROR.FETCH;
      console.error(message, error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.SUBSCRIPTION_PLANS.ERROR.DELETE;
      console.error(message, error);
      toast.error(message);
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
