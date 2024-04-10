import instance from "./axiosConfig";

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

export const getAllPromotions = async (props) => {
  const res = await instance.get("/api/promotions");
  return res.data;
};

export const addCategory = async (props) => {
  console.log(props);
  const { data } = props;
  const res = await instance.post("/api/category", data);
  return res.data;
};

export const updateCategory = async (props) => {
  const { id, data } = props;
  console.log("api", props);
  const res = await instance.put("/api/category/" + id, data);
  return res.data;
};

export const deleteCategoryById = async (props) => {
  const { id } = props;
  const res = await instance.delete("/api/category/" + id);
  return res.data;
};

export const addBrand = async (props) => {
  console.log(props);
  const { data } = props;
  const res = await instance.post("/api/brand", data);
  return res.data;
};

export const updateBrand = async (props) => {
  const { id, data } = props;
  console.log("api", props);
  const res = await instance.put("/api/brand/" + id, data);
  return res.data;
};

export const deleteBrandById = async (props) => {
  const { id } = props;
  const res = await instance.delete("/api/brand/" + id);
  return res.data;
};

export const addSize = async (props) => {
  console.log(props);
  const { data } = props;
  const res = await instance.post("/api/size", data);
  return res.data;
};

export const updateSize = async (props) => {
  const { id, data } = props;
  console.log("api", props);
  const res = await instance.put("/api/size/" + id, data);
  return res.data;
};

export const deleteSizeById = async (props) => {
  const { id } = props;
  const res = await instance.delete("/api/size/" + id);
  return res.data;
};

export const addColor = async (props) => {
  console.log(props);
  const { data } = props;
  const res = await instance.post("/api/color", data);
  return res.data;
};

export const updateColor = async (props) => {
  const { data } = props;
  console.log("api", props);
  const res = await instance.put("/api/color", data);
  return res.data;
};

export const deleteColorById = async (props) => {
  const { id } = props;
  const res = await instance.delete("/api/color?id=" + id);
  return res.data;
};

export const addPromotion = async (props) => {
  console.log(props);
  const { data } = props;
  const res = await instance.post("/api/promotions", data);
  return res.data;
};

export const updatePromotion = async (props) => {
  const { data } = props;
  console.log("api", props);
  const res = await instance.put("/api/promotions", data);
  return res.data;
};

export const deletePromotionById = async (props) => {
  const { id } = props;
  const res = await instance.delete("/api/promotions/" + id);
  return res.data;
};
