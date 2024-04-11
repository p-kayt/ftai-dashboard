import instance from "./axiosConfig";

export const getAllModels = async (props) => {
  const res = await instance.get("/api/models");
  return res.data;
};
