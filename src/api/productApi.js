import instance from "./axiosConfig";

export const getAllProducts = async (props) => {
  const res = await instance.get("/api/product");
  return res.data;
};

export const getAllCategories = async (props) => {
  const res = await instance.get("/api/category");
  return res.data;
};

export const getAllBrands = async (props) => {
  const res = await instance.get("/api/brand");
  return res.data;
};

export const getAllColors = async (props) => {
  const res = await instance.get("/api/color");
  return res.data;
};

export const getAllSizes = async (props) => {
  const res = await instance.get("/api/size");
  return res.data;
};

export const deleteProductById = async (props) => {
  const { id } = props;
  const res = await instance.delete("/api/product/" + id);
  return res.data;
};

export const addNewProduct = async (props) => {
  const { data } = props;
  const res = await instance.post("/api/product", data);
  return res.data;
};

export const updateProduct = async (props) => {
  const { id, data } = props;
  console.log("api", props);
  const res = await instance.put("/api/product/" + id, data);
  return res.data;
};
