import { useEffect, useState } from "react";
import { flattenObjects } from "../../../../backend/utils/flattenObject";

interface FormField {
  id: string;
  type: string;
  placeholder?: string;
  label?: string;
  options?: { label: string; value: string }[];
  multiple?: boolean;
  disabled?: boolean;
}

interface ReUsableFormProps {
  fields: FormField[];
  onSubmit: (formData: any) => void;
  loading: boolean;
  buttonText: string;
  initialData?: FormData;
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
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white shadow-lg rounded-2xl px-6 py-4 w-full max-w-xl mx-auto  "
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
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      [field.id]: e.target.value,
                    }));
                  }
                }}
                value={
                  field.multiple
                    ? formData[field.id] || []
                    : formData[field.id] || ""
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
              <label htmlFor={field.id}>{field.label}</label>
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
              <input
                key={field.id}
                type={field.type}
                id={field.id}
                placeholder={field.placeholder || field.label}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                multiple={field.multiple}
                value={formData[field.id] || ""}
                disabled={field.disabled}
              />
            )}
          </div>
        );
      })}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-blue-700 transition-all disabled:opacity-60"
      >
        {loading ? "Loading..." : buttonText}
      </button>
    </form>
  );
};

export default ReUsableForm;
