import { axiosInstance } from "../api/axiosInstance";

export const useApi = () => {
  const put = async (url: string, data: unknown) => {
    const res = await axiosInstance.put(url, data);
    return res.data.result;
  };
  const post = async (url: string, data: unknown) => {
    const res = await axiosInstance.post(url, data);
    return res.data.result;
  };

  const del = async (url: string) => {
    const res = await axiosInstance.delete(url);
    return res.data.result;
  };

  const get = async (url: string) => {
    const res = await axiosInstance.get(url);
    return res.data.result;
  };

  return { put, post, del, get };
};
