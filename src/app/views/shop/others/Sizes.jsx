import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import React from "react";
import { deleteSizeById, getAllSizes } from "api/othersApi";

const Sizes = (props) => {
  const { setModalOpen, setInit, setActionType } = props;
  const queryClient = useQueryClient();

  const {
    data: sizes,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["sizes"],
    queryFn: getAllSizes
  });

  const sizeDelete = useMutation({
    mutationKey: ["deleteSizeById"],
    mutationFn: (id) => deleteSizeById({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries("sizes");
    },
    onError: (error) => {}
  });

  const handleEdit = (id) => {
    const data = sizes.data.find((item) => item.id === id);
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
        sizeDelete.mutate(id, {
          onSuccess: () => {
            // console.log("success");
            queryClient.invalidateQueries("sizes");
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          },
          onError: (error) => {
            // console.log(error);
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
      field: "value",
      headerName: "Size",
      flex: 1
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
        Add new Size
      </Button>
      {isSuccess && (
        <DataGrid
          rows={sizes.data}
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

export default Sizes;
