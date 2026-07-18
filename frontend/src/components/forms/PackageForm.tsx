import { toast } from "react-toastify";
import { createPackageFields, type Option } from "../../formConfig/fields";
import { useCreatePackage } from "../../hooks/useCreatePackage";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { useEffect, useState } from "react";
import type {
  FormField,
  IActivity,
  IOptionalActivity,
  IPackageItem,
} from "../../interfaces/interfaces";
import BackToDashboard from "../../components/BackToDashboard";
import ItineraryEditor from "@/components/itinerary/ItineraryEditor";
import { useOperatorEditPackage } from "@/hooks/useOperatorEditPackage";
import { flattenObjects } from "../../../../backend/utils/flattenObject";
import { useAdminEditPackage } from "@/hooks/useAdminEditPackage";
import type { ItineraryDay } from "../itinerary/types";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

interface IOptions {
  category: Option[];
  destinations: Option[];
}

interface Props {
  mode: "create" | "edit";
  packageData?: IPackageItem;
  role: "admin" | "operator";
}

const PackageForm = ({ mode, packageData, role }: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const createHook = useCreatePackage();
  const operatorHook = useOperatorEditPackage();
  const adminHook = useAdminEditPackage();
  const hook = role === "operator" ? operatorHook : adminHook;
  const categories = createHook.categories;
  const destinations = createHook.destinations;

  const loading = mode === "create" ? createHook.loading : hook.loading;

  const options: IOptions = {
    category: categories,
    destinations: destinations,
  };

  const createDefaultItinerary = (): ItineraryDay[] => {
    return [
      {
        day: 1,
        activities: [
          { id: crypto.randomUUID(), name: "", cost: 0, customizable: false },
        ],
        description: "",
        gallery: [],
        optionalActivities: [],
        title: "",
      },
    ];
  };

  const handleSubmit = async (formData: any) => {


 



    try {
      if (mode === "create") {
        await createHook.createPackage(formData);
        toast.success(FEEDBACK_MESSAGES.PACKAGE.SUCCESS.CREATE);
        setFormData({});
      } else {
        await hook.updatePackage(packageData!._id, formData);
        toast.success(FEEDBACK_MESSAGES.PACKAGE.SUCCESS.UPDATE);
      }
    } catch (error: any) {
      console.log(fieldError, fieldError);
      if (error.response?.data?.errors) {
        setFieldError(error.response.data.errors);
        return;
      }
      toast.error(
        error.response?.data?.message ??
          `Failed to ${mode === "create" ? "create" : "update"} package`,
      );
    }
  };

  const enrichedFields = createPackageFields.map((field: FormField) => ({
    ...field,
    options: options[field.id as keyof IOptions] ?? [],
  }));

  useEffect(() => {
    if (!packageData) {
      setFormData({ itinerary: createDefaultItinerary() });
    } else {
      setFormData(flattenObjects({ ...packageData }));
    }
  }, [packageData]);



  return (
    <div className="p-6  max-w-4xl mt-10 mb-10 mx-auto">
      <div className="mb-5">
        <BackToDashboard
          path={`/${role === "admin" ? "admin" : "operator"}/dashboard`}
        />
      </div>

      <ReUsableForm
        heading={mode === "create" ? "Create Package" : "Update Package"}
        formData={formData}
        setFormData={setFormData}
        fields={enrichedFields}
        buttonText={mode === "create" ? "Create Package" : "Update Package"}
        loading={loading}
        onSubmit={handleSubmit}
        fieldError={fieldError}
        setFieldError={setFieldError}
        initialData={packageData}
        renderAfterFields={
          <ItineraryEditor
            onChange={(itinerary) =>
              setFormData((prev) => ({ ...prev, itinerary }))
            }
            value={formData.itinerary ?? []}
            fieldError={fieldError}
            setFieldError={setFieldError}
          />
        }
      />
    </div>
  );
};

export default PackageForm;
