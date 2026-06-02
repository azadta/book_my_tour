import type { FormField } from "../../interfaces/interfaces";

interface ProfileFormProps {
  formData: any;
  currentUser: any;
  fields: FormField[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  loading: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  imageUploading: boolean;
  fieldError: Record<string, string>;
  setFieldError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
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
  fieldError,
  setFieldError,
}: ProfileFormProps) => {
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc[key], obj);
  };

  const formSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required) {
        const value = field.id.includes(".")
          ? getNestedValue(formData, field.id)
          : formData[field.id];
        if (!value) {
          newErrors[field.id] = `${field.label || field.id} is required`;
        }
      }
    });

    setFieldError(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    handleSubmit();
  };

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {

    handleChange(e);
    const { id } = e.target;

    setFieldError((prev) => ({ ...prev, [id]: "" }));
  };

  const imageChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    handleFileChange(e);
    const { id } = e.target;
    setFieldError((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="flex flex-col items-center gap-3 max-w-2xl mx-auto">
      <div>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={imageChangeHandler}
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
          <p className="text-sm text-blue-500 text-center">
            Uploading image...
          </p>
        )}
      </div>
      <form
        id="profileForm"
        onSubmit={formSubmit}
        className="grid grid-col-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-md w-full   "
      >
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
                  {field.required && (
                    <span className="text-red-500 font-bold">*</span>
                  )}
                </label>
                <select
                  id={field.id}
                  onChange={changeHandler}
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
                {fieldError[field.id] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldError[field.id]}
                  </p>
                )}
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
                {field.required && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                onChange={changeHandler}
                readOnly={field.readOnly}
                multiple={field.multiple}
                className={`border p-3 rounded-lg   ${field.readOnly ? "bg-gray-100  text-gray-700 " : "focus:outline-none focus:ring-2 focus:ring-sky-500"}`}
                value={
                  field.id.includes(".")
                    ? getNestedValue(formData, field.id)
                    : formData[field.id]
                }
              />
              {fieldError[field.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldError[field.id]}
                </p>
              )}
            </div>
          );
        })}
      </form>
      <button
        form="profileForm"
        type="submit"
        disabled={loading}
        className="bg-sky-400 text-white rounded-lg py-3 px-7 mt-4 self-start hover:bg-sky-500"
      >
        {loading ? "Loading..." : "Update"}
      </button>
    </div>
  );
};
