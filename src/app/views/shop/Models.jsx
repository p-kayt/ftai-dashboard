import { getAllModels } from "api/modelsApi";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import React from "react";

const Models = () => {
  const {
    data: models,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["models"],
    queryFn: getAllModels
  });
  const handleEdit = (id) => {};
  const handleDelete = (id) => {};
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
      field: "gender",
      headerName: "Model Gender",
      flex: 1,
      valueFormatter: (params) => {
        if (params === 0) return "Nam";
        if (params === 1) return "Nữ";
      }
    },
    {
      field: "imageUrl",
      headerName: "Imgae URL",
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
          // setModalOpen(true);
          // setActionType("create");
        }}
      >
        Add new Model
      </Button>
      {isSuccess && (
        <DataGrid
          rows={models.data}
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

export default Models;
