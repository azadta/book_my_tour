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
    <div className="max-w-4xl mx-auto space-y-2">
      <div className="relative overflow-hidden rounded-3xl  bg-linear-to-r from-emerald-500/10 via-sky-500/10 to-white p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="relative  z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={imageChangeHandler}
            />
            <div
              onClick={() => fileRef.current?.click()}
              className="relative size-28 rounded-2xl ring-4 ring-white shadow-md cursor-pointer overflow-hidden transition-transform duration-300 group-hover:scale-102"
            >
              <img
                src={
                  formData?.image ||
                  currentUser?.image ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0  opacity-0 group-hover:opacity-100 flex items-center  justify-center transition-opacity text-white text-sm font-bold ">
                Edit
              </div>
            </div>

            <span className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 border-2 border-white rounded-full ring-2  ring-emerald-100 " />
          </div>

          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100/80 text-emerald-800 text-xs font-semibold mb-2 shadow-sm">
   
              Verifiied Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Account{" "}
              <span className="bg-linear-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent">
                Over view
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-md font-medium  ">
              update your personal details, contact info, and preferred location
            </p>
          </div>
        </div>

        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-200/40 rounded-full blur-3xl  pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl  pointer-events-none" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <form
          id="profileForm"
          onSubmit={formSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {fields.map((field) => {
            if (field.type === "file") return null;
            const isSelect = field.type === "select";
            const fieldValue = field.id.includes(".")
              ? getNestedValue(formData, field.id)
              : formData[field.id];
            return (
              <div key={field.id} className="flex flex-col">
                <label
                  htmlFor={field.id}
                  className="mb-2 text-xs font-bold uppercase tracking-wider text-sky-700"
                >
                  {field.label || field.placeholder}
                  {field.required && (
                    <span className="text-red-600 ml-1 font-bold">*</span>
                  )}
                </label>
                {isSelect && field.label === "Country" ? (
                  <select
                    id={field.id}
                    onChange={handleChangeCountry}
                    value={countryCode}
                    disabled={field.disabled}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4  py-2.5 text-slate-800 font-medium text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 "
                  >
                    {!getNestedValue(formData, field.id) && (
                      <option value="">Choose Country</option>
                    )}
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                ) : isSelect && field.label === "State" ? (
                  <select
                    id={field.id}
                    onChange={handleChange}
                    value={fieldValue}
                    disabled={!countryCode}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 font-medium text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 "
                  >
                    {countryCode && <option value="">Choose State</option>}
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                ) : isSelect ? (
                  <select
                    id={field.id}
                    onChange={changeHandler}
                    value={fieldValue}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 font-medium  text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 "
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={changeHandler}
                    readOnly={field.readOnly}
                    value={fieldValue}
                    className="w-full rounded-xl border border-slate-200  bg-white px-4 py-2.5 text-slate-800 font-medium text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 "
                  />
                )}
              </div>
            );
          })}
        </form>
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            form="profileForm"
            type={"submit"}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl  bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all  shadow-xs cursor-pointer"
          >
            {loading ? "Saving" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
