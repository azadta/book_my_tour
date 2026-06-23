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
  }, [formData, fields]);

  return (
    <div className="max-w-4xl mx-auto   bg-slate-700 p-8 rounded-xl border-2 border-red-500 shadow-[6px _6px_0px_0px_#ef4444]  ">
      <div className="relative mb-8 ">
        <h1 className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 font-black text-2xl text-white tracking-wider">
          Profile
        </h1>

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
          className="rounded-full size-28 object-cover cursor-pointer border-4 border-red-500 shadow-[4px_4px_0px_0px_#ef4444] hover:scale-105 transition "
        />
        {imageUploading && (
          <p className="text-red-300 text-sm mt-2 font-semibold">
            Uploading image...
          </p>
        )}
      </div>
      <form
        id="profileForm"
        onSubmit={formSubmit}
        className="grid grid-col-1 md:grid-cols-2 gap-5  w-full mt-2  "
      >
        {fields.map((field) => {
          if (field.type === "file") return null;
          if (field.type === "select") {
            return (
              <div key={field.id} className="flex flex-col ">
                <label
                  htmlFor={field.id}
                  className="mb-2  font-bold text-white tracking-wide"
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
                    className={`w-full rounded-xl border-2 border-red-500 bg-slate-800 px-4 py-3 text-white font-semibold shadow-[4px_4px_0px_0px_#ef4444] placeholder:text-slate-400 focus:outline-none focus:border-red-400 ${field.readOnly ? "bg-gray-200" : ""}  `}
                    disabled={field.disabled}
                  >
                    {!getNestedValue(formData, field.id) && (
                      <option className="">Choose Country</option>
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
                    onChange={handleChange}
                    value={
                      field.id.includes(".")
                        ? getNestedValue(formData, field.id)
                        : formData[field.id]
                    }
                    className={`w-full rounded-xl border-2 border-red-500 bg-slate-800 px-4 py-3 text-white font-semibold shadow-[4px_4px_0px_0px_#ef4444] placeholder:text-slate-400 focus:outline-none focus:border-red-400 ${field.readOnly ? "bg-gray-200" : ""}  `}
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
                    className={`w-full rounded-xl border-2 border-red-500 bg-slate-800 px-4 py-3 text-white font-semibold shadow-[4px_4px_0px_0px_#ef4444] placeholder:text-slate-400 focus:outline-none focus:border-red-400 ${field.readOnly ? "bg-gray-200" : ""}  `}
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
                  <p className="text-red-300 text-sm mt-2 font-semibold">
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
                className="mb-2  font-bold text-white tracking-wide "
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
                className={`w-full rounded-xl border-2 border-red-500 bg-slate-800 px-4 py-3 text-white font-semibold shadow-[4px_4px_0px_0px_#ef4444] placeholder:text-slate-400 focus:outline-none focus:border-red-400 ${field.readOnly ? "bg-gray-100" : ""}  `}
                value={
                  field.id.includes(".")
                    ? getNestedValue(formData, field.id)
                    : formData[field.id]
                }
              />
              {fieldError[field.id] && (
                <p className="text-red-300 text-sm mt-2 font-semibold">
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
        className="mt-5 px-8 py-3 bg-slate-800 text-white font-bold rounded-xl border-2 border-red-500 shadow-[4px_4px_0px_0px_#ef4444] transition duration-1000 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Loading..." : "Update"}
      </button>
    </div>
  );
};
