import { Country, State, type IState } from "country-state-city";
import { useEffect, useState } from "react";
import { flattenObjects } from "../../../../backend/utils/flattenObject";
import type {
  FormField,
  IActivity,
  IOptionalActivity,
} from "../../interfaces/interfaces";
import type { ItineraryDay } from "../itinerary/types";

interface ReUsableFormProps {
  heading: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  fields: FormField[];
  onSubmit: (formData: any) => void;
  loading: boolean;
  buttonText: string;
  initialData?: FormData;
  fieldError: Record<string, string>;
  setFieldError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  renderAfterFields?: React.ReactNode;
}
interface FormData {
  [key: string]: any;
}

const ReUsableForm = ({
  heading,
  formData,
  setFormData,
  fields,
  onSubmit,
  loading,
  buttonText = "submit",
  initialData,
  fieldError,
  setFieldError,
  renderAfterFields,
}: ReUsableFormProps) => {
  const [countryCode, setCountryCode] = useState("");
  const [states, setStates] = useState<IState[]>([]);

  const [imagePreviews, setImagePreviews] = useState<{
    [key: string]: string[];
  }>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, type, value, files, multiple, checked } = e.target as any;
    if (type === "file") {
      const selectedFiles = files ? [...files] : [];
      setFormData((prev) => ({
        ...prev,
        [id]: multiple
          ? [...(prev[id] || []), ...selectedFiles]
          : selectedFiles?.[0],
      }));

      const previews = selectedFiles.map((file: File) =>
        URL.createObjectURL(file),
      );
      setImagePreviews((prev) => ({
        ...prev,
        [id]: multiple ? [...(prev[id] || []), ...previews] : previews,
      }));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
    setFieldError((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    fields.map((field) => {
      if (field.required) {
        if (
          !formData[field.id] ||
          (Array.isArray(formData[field.id]) && formData[field.id].length === 0)
        ) {
          newErrors[field.id] = `${field.label || field.id} is required`;
        }
      }
    });

    const itineraryData: ItineraryDay[] = formData.itinerary || [];
    if (itineraryData) {
      itineraryData.forEach((day: ItineraryDay, dayIndex: number) => {
        if (!day.title || day.title.trim() === "") {
          newErrors[`itinerary.${dayIndex}.title`] = "Title is required";
        }
        if (!day.description || day.description.trim() === "") {
          newErrors[`itinerary.${dayIndex}.description`] =
            "description is required";
        }
        if (!day.gallery || day.gallery.length < 4) {
          newErrors[`itinerary.${dayIndex}.gallery`] =
            "At least four gallery images are required";
        }
        if (!day.activities || day.activities.length === 0) {
          newErrors[`itinerary.${dayIndex}.activities`] =
            "At least one activity is  required";
        } else {
          day.activities.forEach((activity: IActivity, index: number) => {
            if (!activity.name || activity.name.trim() === "") {
              newErrors[`itinerary.${dayIndex}.activities.${index}.name`] =
                " activity name is  required";
            }
          });
        }

        if (day.optionalActivities) {
          day.optionalActivities.forEach(
            (optActivity: IOptionalActivity, index: number) => {
              if (!optActivity.name || optActivity.name.trim() === "") {
                newErrors[
                  `itinerary.${dayIndex}.optionalActivities.${index}.name`
                ] = " optional Activity name is  required";
              }
            },
          );
        }
      });
    }
    if (Object.keys(newErrors).length > 0) {
      setFieldError(newErrors);
      return;
    }

    onSubmit(formData);

    setImagePreviews({});
  };

  const handleRemoveImage = (fieldId: string, index: number) => {
    setImagePreviews((prev) => {
      const updatedPreviews = [...(prev[fieldId] || [])];
      updatedPreviews.splice(index, 1);
      return { ...prev, [fieldId]: updatedPreviews };
    });

    setFormData((prev) => {
      const currentFiles = prev[fieldId];
      if (Array.isArray(currentFiles)) {
        const updatedFiles = [...currentFiles];
        updatedFiles.splice(index, 1);
        return { ...prev, [fieldId]: updatedFiles };
      }
      return prev;
    });
  };

  const handleChangeCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id } = e.target;
    const selectedCode = e.target.value;
    setCountryCode(selectedCode);
    const selectedCountry = Country.getAllCountries().find(
      (Country) => Country.isoCode === selectedCode,
    );

    const stateField = fields.find((field) => field.label === "State");

    setFormData((prev) => ({
      ...prev,
      [id]: selectedCountry?.name,
      ...(stateField && { [stateField.id]: "" }),
    }));

    setStates(State.getStatesOfCountry(selectedCode));
    setFieldError((prev) => ({ ...prev, [id]: "" }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData(flattenObjects(initialData));
    }
  }, [initialData, setFormData]);
  useEffect(() => {
    const countryField = fields.find((field) => field.label === "Country");

    if (!countryField) return;

    const countryName = formData[countryField.id];

    if (!countryName) return;

    const country = Country.getAllCountries().find(
      (c) => c.name === countryName,
    );

    if (country) {
      setCountryCode(country.isoCode);
      setStates(State.getStatesOfCountry(country.isoCode));
    }
  }, [formData, fields]);

  useEffect(() => {
    if (initialData?.images)
      setImagePreviews((prev) => ({ ...prev, images: initialData.images }));
  }, [initialData]);

  return (
    <div
      className={` mx-auto flex flex-col  bg-linear-to-b from-white to-slate-100 rounded-[40px] border-[5px] border-white shadow-[0px_20px_20px_5px_rgba(133,189,215,0.88)] p-8 ${fields.length > 4 ? "max-w-4xl max-md:max-w-lg " : "max-w-lg"} `}
    >
      <h2 className="text-center text-2xl font-black text-sky-600">
        {heading}
      </h2>
      <form
        id="reUsableForm"
        onSubmit={handleSubmit}
        className={`mt-5   ${fields.length > 4 ? "  grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-10" : "space-y-4"} `}
      >
        {fields.map((field) => {
          if (field.type === "select") {
            return (
              <div key={field.id} className="flex flex-col">
                <label
                  htmlFor={field.id}
                  className="mb-2 ml-2 font-semibold text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 font-bold">*</span>
                  )}
                </label>
                {field.label === "Country" ? (
                  <select
                    id={field.id}
                    onChange={handleChangeCountry}
                    value={countryCode}
                    className={`w-full bg-white px-5 py-4 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] border-none focus:outline-none `}
                    disabled={field.disabled}
                  >
                    {!formData[field.id] && (
                      <option className="text-red-500">Choose Country</option>
                    )}
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                ) : field.label === "State" ? (
                  <select
                    id={field.id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                    value={formData[field.id] ?? ""}
                    className={`w-full bg-white px-5 py-4 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] border-none focus:outline-none `}
                    disabled={!countryCode}
                  >
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    id={field.id}
                    multiple={field.multiple}
                    onChange={(e) => {
                      if (field.multiple) {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions,
                        ).map((opt) => opt.value);
                        setFormData((prev) => ({
                          ...prev,
                          [field.id]: selectedOptions,
                        }));

                        setFieldError((prev) => ({ ...prev, [field.id]: "" }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          [field.id]: e.target.value,
                        }));
                        setFieldError((prev) => ({ ...prev, [field.id]: "" }));
                      }
                    }}
                    value={
                      field.multiple
                        ? (formData[field.id] ?? [])
                        : (formData[field.id] ?? "")
                    }
                    className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.multiple ? "min-h-[100px]" : ""}`}
                    disabled={field.disabled}
                  >
                    {!field.multiple && (
                      <option value="">{field.placeholder || "Select"}</option>
                    )}

                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {fieldError[field.id] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldError[field.id]}
                  </p>
                )}
              </div>
            );
          }

          if (field.type === "checkbox") {
            return (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  id={field.id}
                  type="checkbox"
                  checked={formData[field.id] || false}
                  onChange={handleChange}
                />
                <label htmlFor={field.id}>
                  {field.label}{" "}
                  {field.required && (
                    <span className="text-red-500 font-bold">*</span>
                  )}
                </label>
                {fieldError[field.id] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldError[field.id]}
                  </p>
                )}
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <>
                <textarea
                  key={field.id}
                  id={field.id}
                  placeholder={field.placeholder || field.label}
                  value={formData[field.id] || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [field.id]: e.target.value,
                    }));
                    setFieldError((prev) => ({ ...prev, [field.id]: "" }));
                  }}
                  rows={3}
                  className="w-full bg-white px-5 py-4 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500 resize-none"
                  disabled={field.disabled}
                  readOnly={field.readOnly}
                />

                {fieldError[field.id] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldError[field.id]}
                  </p>
                )}
              </>
            );
          }

          return (
            <div key={field.id} className="flex flex-col ">
              <label
                htmlFor={field.id}
                className="mb-2 ml-2 font-semibold text-gray-700"
              >
                {field.label || field.placeholder}
                {field.required && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
              {field.type === "file" ? (
                <>
                  <input
                    key={field.id}
                    type="file"
                    id={field.id}
                    placeholder={field.placeholder || field.label}
                    onChange={handleChange}
                    className="w-full bg-white p-4 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff]"
                    multiple={field.multiple}
                    disabled={field.disabled}
                    accept="image/*"
                  />
                  {fieldError[field.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldError[field.id]}
                    </p>
                  )}
                  {imagePreviews[field.id]?.length > 0 && (
                    <div className=" flex flex-wrap gap-2 mt-2">
                      {imagePreviews[field.id].map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`preview-${index}`}
                            className="size-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(field.id, index)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full size-5 text-xl flex items-center justify-center hover:bg-red-700 "
                            title="Romove"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <input
                    key={field.id}
                    type={field.type}
                    id={field.id}
                    placeholder={field.placeholder || field.label}
                    onChange={handleChange}
                    className={`w-full bg-white px-5 py-4 rounded-[20px] shadow-[0px_10px_10px_5px_#cff0ff] focus:outline-none focus:border-l-2 focus:border-r-2 focus:border-cyan-500 ${field.readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    multiple={field.multiple}
                    value={formData[field.id] || ""}
                    disabled={field.disabled}
                  />
                  {fieldError[field.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldError[field.id]}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </form>
      {renderAfterFields}
      <button
        form="reUsableForm"
        type="submit"
        disabled={loading}
        className={` mt-6 max-w-lg mx-auto w-full py-4 rounded-[20px] font-bold text-white bg-linear-to-r from-sky-600 to-cyan-500 shadow-[0px_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 cursor-pointer`}
      >
        {loading ? "Loading..." : buttonText}
      </button>
    </div>
  );
};

export default ReUsableForm;
