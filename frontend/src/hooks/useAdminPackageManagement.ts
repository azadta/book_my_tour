import { useEffect, useState } from "react";

import { axiosInstance } from "../api/axiosInstance";
import type { IPackageItem } from "@/interfaces/interfaces";



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

  return { packages, loading, totalCount };
};
