import { useState } from "react";
import BackToDashboard from "../../components/BackToDashboard";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { createDestinationFields } from "../../formConfig/fields";
import { useCreateDestination } from "../../hooks/useCreateDestination";

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
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] ">
      <div className="max-w-xl   w-full ">
        <ReUsableForm
          heading="Create Destination"
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
    </div>
  );
};

export default CreateDestination;
