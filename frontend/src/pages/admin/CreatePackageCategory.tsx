import { useState } from "react";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { createPackageCategoryFields } from "../../formConfig/fields";
import { useCreatePackageCategory } from "../../hooks/useCreatePackageCategory";

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
    <div className=" flex flex-col  items-center justify-center min-h-[calc(100vh-5rem)] ">
      <div className="max-w-lg    w-full">
        <ReUsableForm
          heading="Create Package Category"
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
    </div>
  );
};

export default CreatePackageCategory;
