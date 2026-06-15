import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import type { IOperator } from "../redux/operator/operatorSlice";
import { toast } from "react-toastify";

export const useAdminOperatorManagement = (page: number, limit: number) => {
  const [operators, setOperators] = useState<IOperator[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchOperators = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/operators?page=${page}&limit=${limit}`,
      );
      setOperators(res.data.operators || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error("failed to fetch operators", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const blockOperator = async (id: string, isBlocked: boolean) => {
    try {
      await axiosInstance.put(`/admin/operators/block/${id}`, { isBlocked });
      setOperators((prev) =>
        prev.map((operator) =>
          operator._id === id ? { ...operator, isBlocked } : operator,
        ),
      );
    } catch (error) {
      console.error(`Failed to block operator`, error);
      toast.error(`Failed to update operator status`);
    }
  };

  const deleteOperator = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/admin/operators/delete/${id}`);
      setOperators((prev) => prev.filter((operator) => operator._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete operator");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, [page, limit, fetchOperators]);

  return {
    operators,
    loading,
    fetchOperators,
    blockOperator,
    deleteOperator,
    totalCount,
  };
};
