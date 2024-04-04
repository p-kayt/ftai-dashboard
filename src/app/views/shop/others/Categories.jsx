import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "api/productApi";
import React from "react";

const Categories = () => {
  const {
    data: categories,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories
  });

  console.log(categories);

  const handleEdit = (id) => {
    // handle edit operation here
    console.log("Edit: ", id);
  };

  const handleDelete = (id) => {
    // handle delete operation here
    console.log("Delete: ", id);
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
      width: 230
    },
    {
      field: "options",
      headerName: "Options",
      sortable: false,
      width: 300,
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
    <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "50px" }}>
      {isSuccess && (
        <DataGrid
          rows={categories.data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 }
            }
          }}
          pageSizeOptions={[5, 10]}

          // checkboxSelection
        />
      )}
    </div>
  );
};

export default Categories;
