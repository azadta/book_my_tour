import { useEffect, useState } from "react";
import type { FormField } from "../../interfaces/interfaces";
import { Country, State, type IState } from "country-state-city";

interface FormDataType {
  [key: string]: any;
}

interface ProfileFormProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
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
  setFormData,
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
  const [countryCode, setCountryCode] = useState("");
  const [states, setStates] = useState<IState[]>([]);
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

  const setNestedFormData = (id: string, value: string) => {
    setFormData((prevForm) => {
      const keys = id.split(".");
      const newForm = { ...prevForm };
      let prevNested = prevForm;

      let nested = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        nested[key] = { ...(prevNested?.[key] || {}) };
        nested = nested[key];
        prevNested = prevNested?.[key] || {};
      }

      nested[keys[keys.length - 1]] = value;

      return { ...newForm };
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

    setNestedFormData(id, selectedCountry?.name as string);

    if (stateField) setNestedFormData(stateField.id, "");

    setStates(State.getStatesOfCountry(selectedCode));
    setFieldError((prev) => ({ ...prev, [id]: "" }));
  };

  useEffect(() => {
    const countryField = fields.find((field) => field.label === "Country");

    if (!countryField) return;

    const countryName = countryField.id.includes(".")
      ? getNestedValue(formData, countryField.id)
      : formData[countryField.id];

    if (!countryName) return;

    const country = Country.getAllCountries().find(
      (c) => c.name === countryName,
    );

    if (country) {
      setCountryCode(country.isoCode);
      setStates(State.getStatesOfCountry(country.isoCode));
    }
  }, [formData,fields]);

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
                {field.label === "Country" ? (
                  <select
                    id={field.id}
                    onChange={handleChangeCountry}
                    value={countryCode}
                    className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                    disabled={field.disabled}
                  >
                    <option className="text-red-500">Choose Country</option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                ) : field.label === "State" ? (
                  <select
                    id={field.id}
                    onChange={handleChange}
                    value={
                      field.id.includes(".")
                        ? getNestedValue(formData, field.id)
                        : formData[field.id]
                    }
                    className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 `}
                    disabled={!countryCode}
                  >
                    {countryCode && <option>Choose State</option>}
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                ) : (
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
                )}
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
