import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useAdminOperatorActions = () => {
  const [loading, setLoading] = useState(false);

  const fetchOperator = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(APP_ROUTES.OPERATORS.ADMIN.DETAILS(id));
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);
  const updateOperator = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      await axiosInstance.put(APP_ROUTES.OPERATORS.ADMIN.UPDATE(id), data);
    } finally {
      setLoading(false);
    }
  }, []);
  const blockOperator = useCallback(async (id: string, isBlocked: boolean) => {
    setLoading(true);
    try {
      await axiosInstance.put(APP_ROUTES.OPERATORS.ADMIN.BLOCK(id), { isBlocked });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOperator = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(APP_ROUTES.OPERATORS.ADMIN.DELETE(id));
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    fetchOperator,
    updateOperator,
    blockOperator,
    deleteOperator,
  };
};
