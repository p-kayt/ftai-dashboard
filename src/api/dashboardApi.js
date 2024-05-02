import instance from "./axiosConfig";

export const getProdBestSelling = async (props) => {
  const res = await instance.get("/products/top-selling/1");
  return res.data;
};

export const getRevByMonth = async (props) => {
  const res = await instance.get("/total-revenue-by-month?month=" + props.noMonths);
  return res.data;
};

export const getRevByYear = async (props) => {
  const res = await instance.get("/revenue-by-year?year=" + props);
  return res.data;
};

export const getSaleTrend = async (props) => {
  const res = await instance.get("/sale-trends?month=" + props.month);
  return res.data;
};

export const getNewUserByMonth = async (props) => {
  const res = await instance.get("/new-user-by-month?month=" + props.noMonths);
  return res.data;
};
