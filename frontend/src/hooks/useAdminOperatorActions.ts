
import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useAdminOperatorActions = () => {
  const [loading, setLoading] = useState(false);
  const fetchOperator = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/operators/single-operator/${id}`);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);
  const updateOperator = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/admin/operators/update/${id}`, data);
    } finally {
      setLoading(false);
    }
  }, []);
  const blockOperator = useCallback(async (id: string, isBlocked: boolean) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/admin/operators/block/${id}`, { isBlocked });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOperator = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/admin/operators/delete/${id}`);
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
