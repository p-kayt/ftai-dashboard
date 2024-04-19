import instance from "./axiosConfig";

export const getAllProducts = async (props) => {
  const res = await instance.get("/api/product");
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
export const getProductsFiltered = async (params) => {
  // Construct the query string
  console.log("api ==== ", params);

  let queryString = Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== "" &&
        params[key] !== "Tất cả"
    )
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  console.log(`api/product/search?${queryString}`);

  const response = await instance.get(`api/product/search?${queryString}`);
  return response.data;
};
