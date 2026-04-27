import { toast } from "react-toastify";
import {
  createPackageFields,
  type FormField,
  type Option,
} from "../../formConfig/fields";
import { useCreatePackage } from "../../hooks/useCreatePackage";
import ReUsableForm from "../../components/forms/ReUsableForm";

interface IOptions {
  category: Option[];
  destinations: Option[];
}

const CreatePackage = () => {
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
      toast.error(error.response?.data?.message || "Failed to create package");
      console.error(error);
    }
  };

  const enrichedFields = createPackageFields.map((field: FormField) => ({
    ...field,
    options: options[field.id as keyof IOptions] ?? [],
  }));

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Create Package</h2>
      <ReUsableForm
        fields={enrichedFields}
        buttonText="Create Package"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreatePackage;
