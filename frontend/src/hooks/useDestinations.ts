import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";



export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Record<string,any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/user/destinations`);
        setDestinations(res.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch destinations");
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return { destinations, loading, error };
};
