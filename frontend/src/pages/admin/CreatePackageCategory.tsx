import { useCreatePackageCategory } from "../../hooks/useCreatePackageCategory";
import BackToDashboard from "../../components/BackToDashboard";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { createPackageCategoryFields } from "../../formConfig/fields";

const CreatePackageCategory = () => {
  const { createPackageCategory,fieldError,setFieldError } = useCreatePackageCategory();

  const handleSubmit = async (formData: any) => {
    await createPackageCategory(formData);
  };
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 mt-10">
      <div className="">
        <BackToDashboard path="/admin/dashboard" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Package Category
      </h2>
      <ReUsableForm
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
