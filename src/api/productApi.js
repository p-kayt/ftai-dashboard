import instance from "./axiosConfig";

export const getAllProducts = async (props) => {
  const res = await instance.get("/api/product");
  return res.data;
};
