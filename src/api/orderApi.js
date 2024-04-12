import instance from "./axiosConfig";

export const getAllOrders = async (props) => {
  const res = await instance.get("/api/order");
  return res.data;
};
export const getOrderById = async (orderId) => {
  const res = await instance.get(`/api/order/${orderId}`);
  return res.data;
};
//https://ftai-api.monoinfinity.net/api/order/72?status=7
export const acceptOrderbyIdnStatus = async (order) => {
  const { orderId, status } = order;
  const m = "";
  const res = await instance.put(`/api/order/${orderId}?status=${status}`, m);
  return res.data;
};

export const cancelOrderbyIdnStatus = async (order) => {
  const { orderId, status, cancelReason } = order;
  const res = await instance.put(`/api/order/${orderId}?status=${status}`, cancelReason);
  return res.data;
};
