import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useOperatorRegister = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registerOperator = async (
    operatorData: any,
    onSuccess: (operatorId: string, otpExpire: number) => void,
  ) => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.post("/operator/register", operatorData);
      const { operatorId, otpExpire } = res.data;
      onSuccess(operatorId, otpExpire);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        setLoading(false);
        return;
      }

      setError(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return { registerOperator, error, loading,fieldError,setFieldError };
};
