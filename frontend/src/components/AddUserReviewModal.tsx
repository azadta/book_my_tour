import { reviewFields } from "@/formConfig/fields";
import type { IReviewItem } from "@/interfaces/interfaces";
import { Star, X } from "lucide-react";
import { useState } from "react";
import ReUsableForm from "./forms/ReUsableForm";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  loading: boolean;
  initialData: IReviewItem | undefined;
}

const AddUserReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  loading,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<any>({
    rating: 5,
    "categoryRatings.guide": 5,
    "categoryRatings.value": 5,
    "categoryRatings.itinerary": 5,
    "categoryRatings.transport": 5,

    travelerType: "Couple",
    comment: "",
    images: [],
  });
  const [fieldError, setFieldError] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const renderInteractiveRatings = (
    <div className="space-y-6 my-4 ">
      <div className="text-center space-y-2 bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
          Overall Experience
        </span>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() =>
                setFormData((prev: any) => ({ ...prev, rating: star }))
              }
              className="p-1 transition-transform cursor-pointer active:scale-90"
            >
              <Star
                className={`w-8 h-8 ${star <= formData.rating ? "text-amber-400 fill-amber-400" : "text-gray-400"}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            key: "guide",
            label: "Tour guide",
          },
          {
            key: "value",
            label: "Value for money",
          },
          {
            key: "itinerary",
            label: "itinerary",
          },
          {
            key: "transport",
            label: "Transport",
          },
        ].map(({ key, label }) => {
          const categoryRatings: Record<string, number> = {
            guide: formData["categoryRatings.guide"] ?? 5,
            itinerary: formData["categoryRatings.itinerary"] ?? 5,
            transport: formData["categoryRatings.transport"] ?? 5,
            value: formData["categoryRatings.value"] ?? 5,
          };

          return (
            <div
              key={key}
              className="p-3 bg-white rounded-xl border border-sky-100 shadow-xs space-y-1"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-gray-600 ">{label}</span>
                <span className="font-bold text-gray-900">
                  {categoryRatings[key]}/5
                </span>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        [`categoryRatings.${key}`]: val,
                      }))
                    }
                    className={`flex-1 h-2 rounded-full transition-colors cursor-pointer ${val <= categoryRatings[key] ? "bg-amber-400" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto ">
      <div className="relative w-full mx-auto max-w-xl pt-30 ">
        <button
          onClick={onClose}
          className="absolute  right-2 cursor-pointer z-10 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <ReUsableForm
          heading={initialData ? "Edit Review" : "Write a Review"}
          formData={formData}
          setFormData={setFormData}
          fields={reviewFields}
          onSubmit={onSubmit}
          loading={loading}
          buttonText={initialData ? "Update Review" : "Submit Review"}
          fieldError={fieldError}
          setFieldError={setFieldError}
          renderAfterFields={renderInteractiveRatings}
          initialData={initialData}
        />
      </div>
    </div>
  );
};

export default AddUserReviewModal;
