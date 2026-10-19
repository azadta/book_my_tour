import { useSubscriptionPlan } from "@/hooks/useSubscriptionPlan";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { unFlattenObject } from "../../../../backend/utils/unFlattenObject";
import ReusableForm from "../../components/forms/ReUsableForm";
import { subscriptionPlanFields } from "../../formConfig/fields";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import Loading from "@/components/Loading";

const EditSubscriptionPlan = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { id } = useParams<{ id: string }>();
  const [fieldError, setFieldError] = useState<Record<string, string>>({});

  const { updatePlan, fetchPlanDetails, plan, loading, submitting } =
    useSubscriptionPlan();

  useEffect(() => {
    if (id) {
      fetchPlanDetails(id);
    }
  }, [id]);

  const handleFormSubmit = async (data: any) => {
    if (!id) return;
    try {
      const nestedData = unFlattenObject(data);

      await updatePlan(id, nestedData);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      toast.error(
        error.response?.data?.message ||
          FEEDBACK_MESSAGES.SUBSCRIPTION_PLANS.ERROR.UPDATE,
      );
      console.error(error.message);
    }
  };

  if (!plan) return;
  if (loading) return <Loading />;

  return (
    <div className="py-6 max-w-2xl mx-auto">
      <ReusableForm
        heading="Edit Plan"
        formData={formData}
        setFormData={setFormData}
        fields={subscriptionPlanFields}
        onSubmit={handleFormSubmit}
        loading={submitting}
        buttonText="Update Plan"
        initialData={plan}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
    </div>
  );
};

export default EditSubscriptionPlan;
