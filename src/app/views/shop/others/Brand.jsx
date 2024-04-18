import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import React from "react";
import { deleteBrandById, getAllBrands } from "api/othersApi";

const Brand = (props) => {
  const { setModalOpen, setInit, setActionType } = props;
  const queryClient = useQueryClient();
  const {
    data: brands,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands
  });

  const brandDelete = useMutation({
    mutationKey: ["deleteCateById"],
    mutationFn: (id) => deleteBrandById({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
    onError: (error) => {}
  });

  const handleEdit = (id) => {
    const data = brands.data.find((item) => item.id === id);
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
        brandDelete.mutate(id, {
          onSuccess: () => {
            // console.log("success");
            queryClient.invalidateQueries("categories");
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
      field: "name",
      headerName: "Name",
      flex: 1
    },
    {
      field: "options",
      headerName: "Options",
      sortable: false,
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <strong>
          <div
            style={{
              margin: "8px auto",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button
              sx={{ width: "70px" }}
              color="success"
              variant="outlined"
              onClick={() => handleEdit(params.row.id)}
            >
              Edit
            </Button>
            <Button
              sx={{ width: "100px" }}
              color="error"
              variant="outlined"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </Button>
          </div>
        </strong>
      )
    }
  ];

  return (
    <div style={{ margin: "10px 20px" }}>
      <Button
        style={{ marginBottom: "10px", backgroundColor: "#53609D" }}
        variant="contained"
        onClick={() => {
          setModalOpen(true);
          setActionType("create");
        }}
      >
        Add new Brand
      </Button>
      {isSuccess && (
        <DataGrid
          rows={brands.data}
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

export default Brand;
