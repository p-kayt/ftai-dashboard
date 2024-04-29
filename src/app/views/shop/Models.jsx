import { addModel, deleteModelById, getAllModels, updateModel } from "api/modelsApi";

import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
const Models = () => {
  const queryClient = useQueryClient();
  const [initValue, setInitValue] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("create");
  const {
    data: models,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["models"],
    queryFn: getAllModels
  });

  const modelAdd = useMutation({
    mutationKey: ["modelAdd"],
    mutationFn: (data) => addModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries("models");
    },
    onError: (error) => { }
  });

  const modelUpdate = useMutation({
    mutationKey: ["modelUpdate"],
    mutationFn: (data) => updateModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries("models");
    },
    onError: (error) => { }
  });

  const modelDelete = useMutation({
    mutationKey: ["deleteModelById"],
    mutationFn: (id) => deleteModelById({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries("models");
    },
    onError: (error) => { }
  });

  const handleEdit = (id) => {
    const data = models.data.find((item) => item.id === id);
    setInitValue(data);
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
        modelDelete.mutate(id, {
          onSuccess: () => {
            // console.log("success");
            queryClient.invalidateQueries("models");
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

  const handleAdd = (data) => {
    console.log("data", data);
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to add an item.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!"
    }).then((result) => {
      if (result.isConfirmed) {
        modelAdd.mutate(
          { data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("models");
              Swal.fire("Added!", "Your item has been added.", "success");
            },
            onError: (error) => {
              Swal.fire("Error!", "An error occurred while adding the item.", "error");
            }
          }
        );
      }
    });
  };

  const handleUpdate = (data) => {
    console.log(data);
    modelUpdate.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries("models");
        Swal.fire("Updated!", "Your item has been updated.", "success");
      },
      onError: (error) => {
        console.log(error);
        Swal.fire("Error!", "An error occurred while updating the item.", "error");
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
      headerName: "Image URL",
      flex: 5,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      )
    },
    {
      field: "options",
      headerName: "Options",
      headerAlign: "center",
      sortable: false,
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
        Add new Model
      </Button>
      {isSuccess && (
        <DataGrid
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
          }}
          rows={models.data.filter((item) => !item.isDelete)}
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
      <MyModal
        open={isModalOpen}
        setOpen={setModalOpen}
        initData={initValue}
        type={actionType}
        addCall={handleAdd}
        updateCall={handleUpdate}
      />
    </div>
  );
};

export default Models;

const MyModal = ({ open, setOpen, type, initData, addCall, updateCall }) => {
  const handleFormSubmit = (values) => {
    if (type === "create") {
      addCall(values);
    }
    if (type === "edit") {
      updateCall({ id: initData.id, data: values });
    }
    setOpen(false);
  };

  const validate = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    gender: Yup.number().required("Gender is required").oneOf([0, 1], "Invalid gender"),
    imageUrl: Yup.string().url("Must be a valid URL").required("Image URL is required")
  });

  const createData = {
    name: undefined,
    gender: 0,
    imageUrl: undefined
  };

  if (type === "edit") {
    console.log("edit=", initData);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperComponent={({ children }) => (
          <Paper
            style={{
              width: "500px",
              height: "auto",
              minHeight: "200px",
              maxHeight: "500px",
              overflowY: "auto"
            }}
          >
            {children}
          </Paper>
        )}
      >
        <DialogTitle
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            textAlign: "center",
            alignContent: "center"
          }}
        >
          {type === "create" ? <span>New Model</span> : <span>Update Model</span>}
          <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            X
          </IconButton>
        </DialogTitle>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={type === "create" ? createData : initData}
          validationSchema={validate}
        >
          {({ values, errors, touched, handleSubmit, setFieldValue }) => (
            <form
              style={{
                display: "flex",
                height: "100%",
                padding: "10px 10px 20px 10px",
                marginBottom: "10px",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: "10px"
              }}
              onSubmit={handleSubmit}
            >
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                value={values.name}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                onChange={(e) => setFieldValue("name", e.target.value)}
              />

              <FormControl variant="outlined">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  label="Gender"
                  value={values.gender}
                  error={touched.gender && Boolean(errors.gender)}
                  onChange={(e) => setFieldValue("gender", e.target.value)}
                >
                  <MenuItem value={0}>Male</MenuItem>
                  <MenuItem value={1}>Female</MenuItem>
                </Select>
              </FormControl>

              <TextField
                name="imageUrl"
                label="Image URL"
                variant="outlined"
                value={values.imageUrl}
                error={touched.imageUrl && Boolean(errors.imageUrl)}
                helperText={touched.imageUrl && errors.imageUrl}
                onChange={(e) => setFieldValue("imageUrl", e.target.value)}
              />

              <Button color="primary" variant="contained" type="submit">
                Submit
              </Button>
            </form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};
