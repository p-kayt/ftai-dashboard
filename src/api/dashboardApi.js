import instance from "./axiosConfig";

export const getProdBestSelling = async (props) => {
  const res = await instance.get("/products/top-selling");
  return res.data;
};
