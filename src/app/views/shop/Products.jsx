import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "api/productApi";
import React from "react";

const Products = () => {
  const {
    data: products,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });

  console.log(products);

  const handleEdit = (id) => {
    // handle edit operation here
    console.log("Edit: ", id);
  };

  const handleDelete = (id) => {
    // handle delete operation here
    console.log("Delete: ", id);
  };

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "50px" }}>
      {isSuccess && (
        <DataGrid
          rows={products}
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

export default Products;

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
    field: "description",
    headerName: "Description",
    sortable: false,
    width: 500
  },
  {
    field: "totalSold",
    headerName: "Total sold",
    // sortable: false,
    width: 150
  },
  {
    field: "brand",
    headerName: "Brand",
    // description: "This column has a value getter and is not sortable.",
    // sortable: false,
    width: 120,
    valueGetter: (value) => value.name
  },
  {
    field: "category",
    headerName: "Category",
    // description: "This column has a value getter and is not sortable.",
    // sortable: false,
    width: 120,
    valueGetter: (value) => value.name
  },
  {
    field: "defaultImage",
    headerName: "Image",
    sortable: false,
    width: 200
  },

  {
    field: "options",
    headerName: "Options",
    sortable: false,
    width: 150,
    renderCell: (params) => (
      <strong>
        <button onClick={() => handleEdit(params.row.id)}>Edit</button>
        <button onClick={() => handleDelete(params.row.id)}>Delete</button>
      </strong>
    )
  }
];
