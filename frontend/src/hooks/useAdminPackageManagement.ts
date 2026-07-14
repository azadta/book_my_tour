import { useEffect, useState } from "react";

import { axiosInstance } from "../api/axiosInstance";
import type { IPackageItem } from "@/interfaces/interfaces";
import { toast } from "react-toastify";

export const useAdminPackageManagement = (page: number, limit: number) => {
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/admin/packages?page=${page}&limit=${limit}`,
        );

        setPackages(data.packages || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error("Failed to fetch packages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [page, limit]);

  const deletePackage = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/admin/package/delete/${id}`);
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete package");
    } finally {
      setLoading(false);
    }
  };

  return { packages, loading, totalCount, deletePackage };
};
