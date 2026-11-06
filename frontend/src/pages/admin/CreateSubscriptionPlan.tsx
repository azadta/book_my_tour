import { useSubscriptionPlan } from "@/hooks/useSubscriptionPlan";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useState } from "react";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { subscriptionPlanFields } from "../../formConfig/fields";
import type { SubscritptionPlanForm } from "@/interfaces/interfaces";

const initialPlan: SubscritptionPlanForm = {
  name: "",
  price: 0,
  packageLimit: 0,
  durationDays: 0,
};

const CreateSubscriptionPlan = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<SubscritptionPlanForm>(initialPlan);

  const { createPlan, submitting } = useSubscriptionPlan();
  const handleSubmit = async (formData: SubscritptionPlanForm) => {
    try {
      await createPlan(formData);
      setFormData(initialPlan);
    } catch (error) {
      handleApiError(error, { setFieldError });
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
