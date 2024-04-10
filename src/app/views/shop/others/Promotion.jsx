import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import React from "react";
import { deletePromotionById, getAllPromotions } from "api/othersApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Promotion = (props) => {
  const { setModalOpen, setInit, setActionType } = props;
  const queryClient = useQueryClient();

  const {
    data: promos,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["promos"],
    queryFn: getAllPromotions
  });

  //   console.log(promos);
  const promoteDelete = useMutation({
    mutationKey: ["deletePromotionById"],
    mutationFn: (id) => deletePromotionById({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries("promotions");
    },
    onError: (error) => {}
  });

  const handleEdit = (id) => {
    const data = promos.data.find((item) => item.id === id);
    // console.log(data);
    setInit(data);
    setActionType("edit");
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    // console.log("delete", id);
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
        promoteDelete.mutate(id, {
          onSuccess: () => {
            // console.log("success");
            queryClient.invalidateQueries("promotions");
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
    { field: "id", headerName: "ID", width: 50 },
    { field: "code", headerName: "Code", flex: 1, sortable: false },
    {
      field: "percent",
      headerName: "Percent (%)",
      flex: 1
    },
    { field: "maxValue", headerName: "Max Value (VNĐ)", flex: 2 },
    { field: "minTotalValue", headerName: "Min Total Value (VNĐ)", flex: 2 },
    { field: "description", headerName: "Description", flex: 2, sortable: false },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 180,
      valueFormatter: (params) => {
        const date = new Date(params);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
    },
    {
      field: "exprireDate",
      headerName: "Expire Date",
      width: 180,
      valueFormatter: (params) => {
        const date = new Date(params);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
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
        Add new Promotion
      </Button>
      {isSuccess && (
        <DataGrid
          rows={promos.data}
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

export default Promotion;
