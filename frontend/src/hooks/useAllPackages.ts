import { useEffect, useState } from "react";

import { axiosInstance } from "@/api/axiosInstance";
import type { IPackageItem } from "@/interfaces/interfaces";

export const useAllPackages = () => {
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
  };
};
