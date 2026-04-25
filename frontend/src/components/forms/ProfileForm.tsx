import type { FormField } from "../../formConfig/fields.js";

interface ProfileFormProps {
  formData: any;
  currentUser: any;
  fields: FormField[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  imageUploading: boolean;
}

export const ProfileForm = ({
  formData,
  currentUser,
  fields,
  handleChange,
  handleFileChange,
  handleSubmit,
  loading,
  fileRef,
  imageUploading,
}: ProfileFormProps) => {
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc[key], obj);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto  "
    >
      <input
        type="file"
        ref={fileRef}
        hidden
        accept="/image*"
        onChange={handleFileChange}
      />
      <img
        onClick={() => fileRef.current?.click()}
        src={
          formData?.image ||
          currentUser?.image ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        alt="Profile"
        className="rounded-full size-24 object-cover cursor-pointer self-center mt-2"
      />
      {imageUploading && (
        <p className="text-sm text-blue-500 text-center">Uploading image...</p>
      )}
      {fields.map((field) => {
        if (field.type === "file") return null;
        if (field.type === "select") {
          return (
            <div key={field.id} className="flex flex-col ">
              <label
                htmlFor={field.id}
                className="mb-1 font-medium text-gray-700"
              >
                {field.label || field.placeholder}
              </label>
              <select
                id={field.id}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg"
                value={
                  field.id.includes(".")
                    ? getNestedValue(formData, field.id)
                    : formData[field.id]
                }
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <div key={field.id} className="flex flex-col">
            <label
              htmlFor={field.id}
              className="mb-1 text-left font-medium text-gray-700 "
            >
              {field.label || field.placeholder}
            </label>
            <input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              readOnly={field.readOnly}
              multiple={field.multiple}
              className="border p-3 rounded-lg"
              value={
                field.id.includes(".")
                  ? getNestedValue(formData, field.id)
                  : formData[field.id]
              }
            />
          </div>
        );
      })}
      <button
        disabled={loading}
        className="bg-slate-700 text-white rounded-lg p-3 mt-4"
      >
        {loading ? "Loading..." : "Update"}
      </button>
    </form>
  );
};
