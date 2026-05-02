import { useEffect, useState } from "react";
import { flattenObjects } from "../../../../backend/utils/flattenObject";
import type { FormField } from "../../interfaces/interfaces";

interface ReUsableFormProps {
  fields: FormField[];
  onSubmit: (formData: any) => void;
  loading: boolean;
  buttonText: string;
  initialData?: FormData;
  fieldError: Record<string, string>;
  setFieldError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}
interface FormData {
  [key: string]: any;
}

const ReUsableForm = ({
  fields,
  onSubmit,
  loading,
  buttonText = "submit",
  initialData,
  fieldError,
  setFieldError,
}: ReUsableFormProps) => {
  const [formData, setFormData] = useState<FormData>({});

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
        if (!formData[field.id]) {
          newErrors[field.id] = `${field.label || field.id} is required`;
        }
      }
    });

    setFieldError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    onSubmit(formData);
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

  useEffect(() => {
    if (initialData) {
      setFormData(flattenObjects(initialData));
    }
  }, [initialData]);

  return (
    <div className={`${fields.length > 3 ? "max-w-2xl " : "max-w-lg"} `}>
      <form
        id="reUsableForm"
        onSubmit={handleSubmit}
        className={`space-y-6 bg-white shadow-lg rounded-2xl px-6 py-4 w-full mx-auto ${fields.length > 3 ? "  grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center" : ""} `}
      >
        {fields.map((field) => {
          if (field.type === "select") {
            return (
              <div key={field.id} className="flex flex-col">
                <label
                  htmlFor={field.id}
                  className="mb-2 font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 font-bold">*</span>
                  )}
                </label>
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

          return (
            <div key={field.id} className="flex flex-col ">
              <label
                htmlFor={field.id}
                className="mb-2 font-medium text-gray-700"
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
                    className="border p-3 rounded-lg"
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
                    className="border p-3 rounded-lg "
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
      <button
        form="reUsableForm"
        type="submit"
        disabled={loading}
        className="mt-5 px-4  bg-sky-400 text-white py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-sky-500 transition-all disabled:opacity-60"
      >
        {loading ? "Loading..." : buttonText}
      </button>
    </div>
  );
};

export default ReUsableForm;
