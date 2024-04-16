import instance from "./axiosConfig";
export const getAllUsers = async (props) => {
  const res = await instance.get("/api/user");
  return res.data;
};
export const getRevenue = async (props) => {
  const res = await instance.get("/total-revenue");
  return res.data;
};
export const deactivateUserById = async (props) => {
  const { id, isActive } = props;
  if (isActive) {
    const res = await instance.put(`/api/user/${id}?status=2`);
    return res.data;
  } else {
    const res = await instance.put(`/api/user/${id}?status=1`);
    return res.data;
  }
};

export const createNewUser = async (props) => {
  const res = await instance.post("/api/user", props);
  return res.data;
};
