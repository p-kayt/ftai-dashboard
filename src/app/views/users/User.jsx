import { Button, Chip } from "@mui/material";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { deactivateUserById, getAllUsers } from "api/usersApi";
import useAuth from "app/hooks/useAuth";
import { dateConvert } from "app/utils/utils";
import Swal from "sweetalert2";
import UserPage from "./UserPage";

export const processStatusUser = (boolean) => {
  switch (boolean) {
    case true:
      return "Active";
    case false:
      return "Inactive";
    default:
      return "Unknow Status";
  }
}

export const processStatusUserColor = (boolean) => {
  switch (boolean) {
    case true:
      return "success";
    case false:
      return "error";
    default:
      return "default";
  }
}
const User = () => {
  const { user } = useAuth()
  const {
    data: users,
    isSuccess,
    refetch
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers
  });

  const queryClient = new QueryClient();
  const deactivateUser = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (data) => deactivateUserById(data),
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      refetch()
    },
    onError: (error) => {
      Swal.fire("Error!", "An error occurred while manipulate the item.", "error");
    }
  });


  const columns = [
    {
      field: "fullName",
      headerName: "Name",
      width: 250,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "isActive",
      headerName: "isActive",
      width: 200,
      renderCell: (params) => (
        <div style={{ margin: "0 auto" }}>
          <Chip label={processStatusUser(params.row.isActive)} color={processStatusUserColor(params.row.isActive)} style={{
            fontFamily: 'Poppins',
            fontWeight: 700,
          }} />
        </div>
      )
    },
    {
      field: "createAt",
      headerName: "Joined Date",
      width: 250,
      renderCell: (params) => (
        <div style={{ margin: "0 auto", fontWeight: 700, fontFamily: 'Poppins' }}>
          {dateConvert(params.row.createAt)}
        </div>
      )
    },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 150,
      valueFormatter: (params) => {
        if (params) return params;
        if (!params) return "N/A";
      }
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <div style={{ margin: "0 auto" }}>
          {params.row.isActive === true ? <Button sx={{ width: '140px' }} color="error" variant="outlined" onClick={() => handleDeactivate(params.row)}>Deactivate User</Button> : <Button sx={{ width: '140px' }} color="success" variant="outlined" onClick={() => handleDeactivate(params.row)}>Active User</Button>}
        </div>
      )
    }

  ]


  const managerData = users?.data?.filter((user) => user?.roleId !== 4 && user.roleId !== 3)
  const adminData = users?.data
  const handleDeactivate = (data) => {
    const { id, isActive } = data
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${!isActive ? 'activate' : 'deactivate'} this user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deactivateUser.mutate({ id, isActive });
      }
    });
  }


  const dataShow = user?.roleId === 4 ? adminData : managerData
  return <UserPage data={dataShow} isSuccess={isSuccess} columns={columns} refetch={refetch} />
};

export default User;
