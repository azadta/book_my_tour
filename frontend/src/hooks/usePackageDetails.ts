import { axiosInstance } from "@/api/axiosInstance";
import type { IPackageItem } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";

export const usePackageDetails = (id: string) => {
  const [pkg, setPkg] = useState<IPackageItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPackage = async () => {
    setLoading(true);
    try {
      const  {data}  = await axiosInstance.get(`/user/package/${id}`);

      setPkg(data.pkg);
    } catch (error) {
      console.error("Failed to fetch package", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, [id]);

  return {
    pkg,
    loading,
  };
};
