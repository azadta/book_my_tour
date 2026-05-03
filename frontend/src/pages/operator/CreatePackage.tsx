import { toast } from "react-toastify";
import { createPackageFields, type Option } from "../../formConfig/fields";
import { useCreatePackage } from "../../hooks/useCreatePackage";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { useState } from "react";
import type { FormField } from "../../interfaces/interfaces";
import BackToDashboard from "../../components/BackToDashboard";

interface IOptions {
  category: Option[];
  destinations: Option[];
}

const CreatePackage = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { categories, createPackage, destinations, loading } =
    useCreatePackage();
  const options: IOptions = {
    category: categories,
    destinations: destinations,
  };

  const handleSubmit = async (formData: any) => {
    try {
      await createPackage(formData);
      toast.success("Package created successfully");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      toast.error(error.response?.data?.message || "Failed to create package");
      console.error(error);
    }
  };

  const enrichedFields = createPackageFields.map((field: FormField) => ({
    ...field,
    options: options[field.id as keyof IOptions] ?? [],
  }));

  return (
    <div className="p-6  max-w-2xl mt-10 mb-10 mx-auto">
      <BackToDashboard path="/operator/dashboard"/>
      <h2 className="text-2xl font-semibold mb-4 mt-10">Create Package</h2>
      <ReUsableForm
        fields={enrichedFields}
        buttonText="Create Package"
        loading={loading}
        onSubmit={handleSubmit}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
    </div>
  );
};

export default CreatePackage;
