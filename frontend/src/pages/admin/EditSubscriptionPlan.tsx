import Loading from "@/components/Loading";
import { useSubscriptionPlan } from "@/hooks/useSubscriptionPlan";
import type { SubscritptionPlanForm } from "@/interfaces/interfaces";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { unFlattenObject } from "../../../../backend/utils/unFlattenObject";
import ReusableForm from "../../components/forms/ReUsableForm";
import { subscriptionPlanFields } from "../../formConfig/fields";
const initialPlan: SubscritptionPlanForm = {
  name: "",
  price: 0,
  packageLimit: 0,
  durationDays: 0,
};

const EditSubscriptionPlan = () => {
  const [formData, setFormData] = useState<SubscritptionPlanForm>(initialPlan);
  const { id } = useParams<{ id: string }>();
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const { updatePlan, fetchPlanDetails, plan, loading, submitting } =
    useSubscriptionPlan();

  useEffect(() => {
    if (id) {
      fetchPlanDetails(id);
    }
  }, [id, fetchPlanDetails]);

  const handleFormSubmit = async (data: SubscritptionPlanForm) => {
    if (!id) return;
    try {
      const nestedData = unFlattenObject(data);

      await updatePlan(id, nestedData);
      navigate("/admin/subscription-plans");
    } catch (error) {
      handleApiError(error, { setFieldError });
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
