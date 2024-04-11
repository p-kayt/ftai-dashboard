import instance from "./axiosConfig";

export const getAllOrders = async (props) => {
  const res = await instance.get("/api/order");
  return res.data;
};
export const getOrderById = async (orderId) => {
  console.log("orderId", orderId);
  const res = await instance.get(`/api/order/${orderId}`);
  return res.data;
};
