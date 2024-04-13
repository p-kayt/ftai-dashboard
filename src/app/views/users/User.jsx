import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "api/orderApi";
import React from "react";
import UserPage from "./UserPage";
import useAuth from "app/hooks/useAuth";

const User = () => {
  const {user} = useAuth()
  const {
    data: users,
    isSuccess
} = useQuery({
    queryKey: ["orders"],
    queryFn: getAllUsers
});
const columns = [
  {
      field: "id",
      headerName: "ID",
      width: 250
  },
  {
      field: "email",
      headerName: "Email",
      width: 250,
  },
  {
      field: "fullName",
      headerName: "Name",
      width: 250,
  },
  {
      field: "isActive",
      headerName: "isActive",
      width: 250,
      valueFormatter: (params) => {
        if (params === true) return "Đang hoạt động";
        if (params === false) return "Ngừng hoạt động";
      }
  },

  {
      field: "phone",
      headerName: "Phone Number",
      width: 150
  },
]

const managerData = users?.data?.items?.filter((user) => user?.roleId === 1)
const adminData = users?.data?.items

const dataShow = user?.roleId === 4 ? adminData : managerData
  return <UserPage data={dataShow} isSuccess={isSuccess} columns={columns}/>
};

export default User;
