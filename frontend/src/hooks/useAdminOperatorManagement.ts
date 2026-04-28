import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import type { IOperator } from "../redux/operator/operatorSlice";

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
    await axiosInstance.put(`/admin/operators/block/${id}`, { isBlocked });
    fetchOperators();
  };

  const deleteOperator = async (id: string) => {
    await axiosInstance.delete(`/admin/operators/delete/${id}`);
    fetchOperators();
  };

  useEffect(() => {
    fetchOperators();
  }, [page, limit]);

  return {
    operators,
    loading,
    fetchOperators,
    blockOperator,
    deleteOperator,
    totalCount,
  };
};

