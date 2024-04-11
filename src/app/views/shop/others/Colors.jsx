import React from "react";
import { deleteColorById, getAllColors } from "api/othersApi";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
const Colors = (props) => {
  const { setModalOpen, setInit, setActionType } = props;
  const queryClient = useQueryClient();
  const {
    data: colors,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["colors"],
    queryFn: getAllColors
  });

  const colorDelete = useMutation({
    mutationKey: ["deleteColorById"],
    mutationFn: (id) => deleteColorById({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries("colors");
    },
    onError: (error) => {}
  });
  const handleEdit = (id) => {
    const data = colors.data.find((item) => item.id === id);
    setInit(data);
    setActionType("edit");
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        colorDelete.mutate(id, {
          onSuccess: () => {
            // console.log("success");
            queryClient.invalidateQueries("colors");
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          },
          onError: (error) => {
            console.log(error);
            Swal.fire("Error!", "An error occurred while deleting the item.", "error");
          }
        });
        // console.log("Delete: ", id);
      }
    });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1
    },
    {
      field: "colorCode",
      headerName: "Code",
      width: 120
    },
    {
      field: "options",
      headerName: "Options",
      headerAlign: "center",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <strong>
          <button
            style={{
              backgroundColor: "#004CFF",
              marginRight: "5px",
              color: "white",
              padding: "10px 24px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </button>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px 24px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>
        </strong>
      )
    }
  ];
  return (
    <div style={{ margin: "10px 20px" }}>
      <Button
        style={{ marginBottom: "10px" }}
        variant="contained"
        onClick={() => {
          setModalOpen(true);
          setActionType("create");
        }}
      >
        Add new Color
      </Button>
      {isSuccess && (
        <DataGrid
          rows={colors.data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 }
            }
          }}
          pageSizeOptions={[5, 10]}
          disableColumnResize
          // checkboxSelection
        />
      )}
    </div>
  );
};

export default Colors;
