import { useEffect, useState } from "react";
import type { IPackageItem } from "./useAdminPackageManagement";
import { axiosInstance } from "@/api/axiosInstance";

export const useAllPackages = () => {
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/user/packages`);

        setPackages(data.packages || []);
      } catch (error) {
        console.error("Failed to fetch packages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return { packages, loading };
};
