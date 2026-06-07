import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { operatorProfileFields } from "../../formConfig/fields.ts";

import {
  updateOperatorStart,
  updateOperatorSuccess,
  updateOperatorFailure,
  logoutOperatorSuccess,
  logoutOperatorStart,
  logoutOperatorFailure,
} from "../../redux/operator/operatorSlice.ts";

import { useApi } from "../../hooks/useApi.js";
import { ProfileForm } from "../../components/forms/ProfileForm.tsx";
import type { RootState } from "../../redux/store.ts";
import { toast } from "react-toastify";
import BackToDashboard from "../../components/BackToDashboard.tsx";

interface FormDataType {
  [key: string]: any;
}

const OperatorProfile = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { currentOperator, loading } = useSelector(
    (state: RootState) => state.operator,
  );
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    mobile: "",
    image: "",
    isPremium: false,
    isBlocked: false,

    referralCode: "",
    referredBy: "",
    verificationDetails: {
      companyName: "",
      licenseNo: "",
      businessAddress: {
        buildingNo: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
    },
  });

  const [imageUploading, setImageUploadig] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, del } = useApi();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setImageUploadig(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const imgData = await res.json();
      await post("/operator/update-profile-image", {
        image: imgData.secure_url,
      });
      dispatch(
        updateOperatorSuccess({
          ...currentOperator!,
          image: imgData.secure_url,
        }),
      );
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Cloudinary upload Error", error);
      dispatch(
        updateOperatorFailure(error.response?.data?.message || error.message),
      );
      toast.error(error.response?.data?.message || "Error uploading image");
    } finally {
      setImageUploadig(false);
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(updateOperatorStart());
      const updatedUser = await post(
        `/operator/update/${currentOperator?._id}`,
        formData,
      );

      dispatch(updateOperatorSuccess(updatedUser));

      toast.success("Operator updated successfully");
    } catch (error: any) {
      dispatch(
        updateOperatorFailure(error.response?.data?.message || error.message),
      );
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }

      toast.error(error.response?.data?.message || "Error updating user");
    }
  };

  const handleLogOut = async () => {
    try {
      dispatch(logoutOperatorStart());
      await del("/operator/logout");
      dispatch(logoutOperatorSuccess());
      navigate("/operator/login", { replace: true });
    } catch (error: any) {
      dispatch(
        logoutOperatorFailure(error.response?.data?.message || error.message),
      );
      toast.error(error.response?.data?.message || "Error logout operator");
    }
  };

  useEffect(() => {
    if (currentOperator) {
      setFormData({
        name: currentOperator?.name || "",

        email: currentOperator?.email || "",
        mobile: currentOperator?.mobile || "",
        image: currentOperator?.image || "",
        isPremium: currentOperator?.isPremium || false,
        isBlocked: currentOperator?.isBlocked || false,

        referralCode: currentOperator?.referralCode || "",
        referredBy: currentOperator?.referredBy || "",
        verificationDetails: {
          companyName: currentOperator.verificationDetails?.companyName || "",
          licenseNo: currentOperator.verificationDetails?.licenseNo || "",
          businessAddress: {
            buildingNo:
              currentOperator.verificationDetails?.businessAddress
                ?.buildingNo || "",
            landmark:
              currentOperator.verificationDetails?.businessAddress?.landmark ||
              "",
            city:
              currentOperator.verificationDetails?.businessAddress?.city || "",
            state:
              currentOperator.verificationDetails?.businessAddress?.state || "",
            country:
              currentOperator.verificationDetails?.businessAddress?.country ||
              "",
            postalCode:
              currentOperator.verificationDetails?.businessAddress
                ?.postalCode || "",
          },
        },
      });
    }
  }, [currentOperator]);

  return (
    <div  className="flex flex-col sm:flex-row  justify-center gap-5 ">
      <div className="sm:max-w-[220px] bg-gray-200 w-full px-10 max-sm:order-2  ">
    <div className="sm:mt-25 flex flex-col gap-5  justify-center max-w-[150px] mx-auto max-sm:py-10">
          <button
            onClick={() => navigate("/operator/reset-password")}
            className="text-white cursor-pointer bg-sky-400 px-3 py-2 rounded hover:bg-sky-500"
          >
            Reset Password
          </button>
     

          <button
            onClick={handleLogOut}
             className="text-white cursor-pointer bg-sky-400 px-3 py-2 rounded hover:bg-sky-500"
          >
            Log Out
          </button>
        </div>
      </div>


    <div className="p-3 max-w-lg sm:max-w-2xl mx-auto   w-full max-sm:order-1 ">
      <BackToDashboard path="/operator/dashboard" />
      <h1 className="text-3xl font-semibold text-center my-7  text-emerald-500">
        Profile
      </h1>
      <ProfileForm
        currentUser={currentOperator}
        formData={formData}
        fields={operatorProfileFields}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        loading={loading}
        fileRef={fileRef}
        imageUploading={imageUploading}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
     
    </div>
        </div>
  );
};

export default OperatorProfile;
