import { useCreatePackageCategory } from "../../hooks/useCreatePackageCategory";
import BackToDashboard from "../../components/BackToDashboard";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { createPackageCategoryFields } from "../../formConfig/fields";
import { useState } from "react";

const CreatePackageCategory = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { createPackageCategory, fieldError, setFieldError } =
    useCreatePackageCategory();

  const handleSubmit = async (formData: any) => {
    try {
      await createPackageCategory(formData);
      setFormData({});
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 mt-10">
      <div className="mt-20">
        <BackToDashboard path="/admin/dashboard" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Package Category
      </h2>
      <ReUsableForm
        formData={formData}
        setFormData={setFormData}
        fields={createPackageCategoryFields}
        onSubmit={handleSubmit}
        loading={false}
        buttonText="Create"
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
    </div>
  );
};

export default CreatePackageCategory;
