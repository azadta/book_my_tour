import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";

export const useRegister = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);


  const registerUser = async (
    formData: any,
    onSuccess: (userId: string, otpExpire: string) => void,
  ) => {
    setLoading(true);
   
    const { confirmPassword, ...userData } = formData;
    try {
      const res = await axiosInstance.post("/user/register", userData);
      const data = res.data;

      onSuccess(data.userId, data.otpExpire);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        setLoading(false);
        return;
      }
      toast.error(error.response?.data?.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, fieldError,setFieldError };
};
