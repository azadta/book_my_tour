import { useState } from "react";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { createDestinationFields } from "../../formConfig/fields";
import {
  useCreateDestination,
  type CreateDestinationFormData,
} from "../../hooks/useCreateDestination";

const initialFormData = {
  name: "",
  latitude: "",
  longitude: "",
  images: [],
};
const CreateDestination = () => {
  const [formData, setFormData] =
    useState<CreateDestinationFormData>(initialFormData);

  const { createDestination, loading, fieldError, setFieldError } =
    useCreateDestination();
  const handleSubmit = async (formData: CreateDestinationFormData) => {
    try {
      await createDestination(formData);
      setFormData(initialFormData);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5.125rem)] ">
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
