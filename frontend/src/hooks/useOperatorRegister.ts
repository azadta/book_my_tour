import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useOperatorRegister = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registerOperator = async (
    operatorData: any,
    onSuccess: (operatorId: string, otpExpire: number) => void
  ) => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.post("/operator/register", operatorData);
      const { operatorId, otpExpire } = res.data;
      onSuccess(operatorId, otpExpire);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return { registerOperator, error, loading };
};
