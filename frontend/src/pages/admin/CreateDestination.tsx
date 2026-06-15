import { useNavigate } from "react-router-dom";
import { useCreateDestination } from "../../hooks/useCreateDestination";
import BackToDashboard from "../../components/BackToDashboard";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { createDestinationFields } from "../../formConfig/fields";
import { useState } from "react";

const CreateDestination = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const { createDestination, loading, fieldError, setFieldError } =
    useCreateDestination();
  const handleSubmit = async (formData: any) => {
    try {
      await createDestination(formData);
      setFormData({});
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 mt-10">
      <div className="">
        <BackToDashboard path="/admin/dashboard" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Destination
      </h2>
      <ReUsableForm
        formData={formData}
        setFormData={setFormData}
        fields={createDestinationFields}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Create Destination"
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
    </div>
  );
};

export default CreateDestination;
