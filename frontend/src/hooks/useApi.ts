import { axiosInstance } from "../api/axiosInstance";

export const useApi = () => {
  const put = async (url: string, data: any) => {
    const res = await axiosInstance.put(url, data);
    return res.data;
  };
  const post = async (url: string, data: any) => {
    const res = await axiosInstance.post(url, data);
    return res.data;
  };

  const del = async (url: string) => {
    const res = await axiosInstance.delete(url);
    return res.data;
  };

  const get = async (url: string) => {
    const res = await axiosInstance.get(url);
    return res.data;
  };

  return { put, post, del, get };
};
