import { useState } from "react";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { createPackageCategoryFields } from "../../formConfig/fields";
import { useCreatePackageCategory, type ICategoryForm } from "../../hooks/useCreatePackageCategory";

 const initialCategory ={
  name: '',
  description: ''
}
const CreatePackageCategory = () => {
  const [formData, setFormData] = useState<ICategoryForm>(initialCategory);
  const { createPackageCategory, fieldError, setFieldError } =
    useCreatePackageCategory();

  const handleSubmit = async (formData: ICategoryForm) => {
    try {
      await createPackageCategory(formData);
      setFormData(initialCategory);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className=" flex flex-col  items-center justify-center min-h-[calc(100vh-5.125rem)] ">
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
