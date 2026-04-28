import { useEffect, useState } from "react";

import { axiosInstance } from "../api/axiosInstance";

interface Destination {
  _id: string;
  name: string;
}
interface Operator {
  _id: string;
  name: string;
}
interface Category {
  _id: string;
  name: string;
}

export interface IPackageItem {
  _id: string;
  name: string;
  amount: number;
  destinations: Destination[];
  specifications?: string;
  expiryDate?: string;
  remark?: string;
  discount?: number;
  availableSlots?: string;
  images?: string[];
  isCustomizable?: boolean;
  category: Category;
  operatorId?: Operator;
  createdAt?: string;
  updatedAt?: string;
}

export const useAdminPackageManagement = (page: number, limit: number) => {
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/admin/packages?page=${page}&limit=${limit}`);

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
