import instance from "./axiosConfig";

export const getAllModels = async (props) => {
  const res = await instance.get("/api/models");
  return res.data;
};

export const addModel = async (props) => {
  console.log(props);
  const { data } = props;
  const res = await instance.post("/api/models", data);
  return res.data;
};

export const updateModel = async (props) => {
  const { id, data } = props;
  console.log("api", props);
  const res = await instance.put("/api/models/" + id, data);
  return res.data;
};

export const deleteModelById = async (props) => {
  const { id } = props;
  const res = await instance.delete("/api/models/" + id);
  return res.data;
};
