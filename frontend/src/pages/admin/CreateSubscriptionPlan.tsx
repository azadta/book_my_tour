import { useSubscriptionPlan } from "@/hooks/useSubscriptionPlan";
import { useState } from "react";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { subscriptionPlanFields } from "../../formConfig/fields";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

const CreateSubscriptionPlan = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  const { createPlan, submitting } = useSubscriptionPlan();
  const handleSubmit = async (formData: any) => {
    try {
      await createPlan(formData);
      setFormData({});
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      toast.error(
        error.response?.data?.message ||
          FEEDBACK_MESSAGES.SUBSCRIPTION_PLANS.ERROR.CREATE,
      );
      console.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5.125rem)] ">
      <div className="max-w-xl   w-full ">
        <ReUsableForm
          heading="Create Subscription Plan"
          formData={formData}
          setFormData={setFormData}
          fields={subscriptionPlanFields}
          onSubmit={handleSubmit}
          loading={submitting}
          buttonText="Create Subscription Plan"
          fieldError={fieldError}
          setFieldError={setFieldError}
        />
      </div>
    </div>
  );
};

export default CreateSubscriptionPlan;
