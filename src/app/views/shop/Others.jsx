import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  CircularProgress
} from "@mui/material";
import { DatePicker } from "@mui/lab";
import Categories from "./others/Categories";
import Colors from "./others/Colors";
import Sizes from "./others/Sizes";
import { ErrorMessage, Field, Formik } from "formik";
import Brand from "./others/Brand";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBrand,
  addCategory,
  addColor,
  addSize,
  deleteCategoryById,
  updateBrand,
  updateCategory,
  updateColor,
  updateSize
} from "api/othersApi";
import Swal from "sweetalert2";
import Promotion from "./others/Promotion";
const Others = () => {
  const queryClient = useQueryClient();

  //promotion
  const promoAdd = useMutation({
    mutationKey: ["promoAdd"],
    mutationFn: (data) => addSize(data),
    onSuccess: () => {
      queryClient.invalidateQueries("promos");
    },
    onError: (error) => {}
  });
  const promoUpdate = useMutation({
    mutationKey: ["promoUpdate"],
    mutationFn: (data) => updateSize(data),
    onSuccess: () => {
      queryClient.invalidateQueries("promos");
    },
    onError: (error) => {}
  });

  //category
  const cateAdd = useMutation({
    mutationKey: ["cateAdd"],
    mutationFn: (data) => addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
    onError: (error) => {}
  });
  const cateUpdate = useMutation({
    mutationKey: ["cateUpdate"],
    mutationFn: (data) => updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
    onError: (error) => {}
  });
  //brand
  const brandAdd = useMutation({
    mutationKey: ["brandAdd"],
    mutationFn: (data) => addBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries("brands");
    },
    onError: (error) => {}
  });
  const brandUpdate = useMutation({
    mutationKey: ["brandUpdate"],
    mutationFn: (data) => updateBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries("brands");
    },
    onError: (error) => {}
  });

  //size
  const sizeAdd = useMutation({
    mutationKey: ["sizeAdd"],
    mutationFn: (data) => addSize(data),
    onSuccess: () => {
      queryClient.invalidateQueries("sizes");
    },
    onError: (error) => {}
  });
  const sizeUpdate = useMutation({
    mutationKey: ["sizeUpdate"],
    mutationFn: (data) => updateSize(data),
    onSuccess: () => {
      queryClient.invalidateQueries("sizes");
    },
    onError: (error) => {}
  });

  //color
  const colorAdd = useMutation({
    mutationKey: ["colorAdd"],
    mutationFn: (data) => addColor(data),
    onSuccess: () => {
      queryClient.invalidateQueries("colors");
    },
    onError: (error) => {}
  });
  const colorUpdate = useMutation({
    mutationKey: ["colorUpdate"],
    mutationFn: (data) => updateColor(data),
    onSuccess: () => {
      queryClient.invalidateQueries("colors");
    },
    onError: (error) => {}
  });

  const [isOpenCate, setIsOpenCate] = useState(false);
  const [isOpenBrand, setIsOpenBrand] = useState(false);
  const [isOpenColor, setIsOpenColor] = useState(false);
  const [isOpenSize, setIsOpenSize] = useState(false);
  const [isOpenPromotion, setIsOpenPromotion] = useState(false);

  const [actionType, setActionType] = useState("create");
  const [initCateData, setInitCateData] = useState(null);
  const [initBrandData, setInitBrandData] = useState(null);
  const [initColorData, setInitColorData] = useState(null);
  const [initSizeData, setInitSizeData] = useState(null);
  const [initPromotionData, setInitPromotionData] = useState(null);

  const handleAddCate = (data) => {
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
        cateAdd.mutate(
          { data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("categories");
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
  const handleUpdateCate = (data) => {
    console.log(data);
    cateUpdate.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        Swal.fire("Updated!", "Your item has been updated.", "success");
      },
      onError: (error) => {
        console.log(error);
        Swal.fire("Error!", "An error occurred while updating the item.", "error");
      }
    });
  };

  const handleAddBrand = (data) => {
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
        brandAdd.mutate(
          { data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("brands");
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
  const handleUpdateBrand = (data) => {
    console.log(data);
    brandUpdate.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries("brands");
        Swal.fire("Updated!", "Your item has been updated.", "success");
      },
      onError: (error) => {
        console.log(error);
        Swal.fire("Error!", "An error occurred while updating the item.", "error");
      }
    });
  };

  const handleAddSize = (data) => {
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
        sizeAdd.mutate(
          { data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("size");
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
  const handleUpdateSize = (data) => {
    console.log(data);
    sizeUpdate.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries("size");
        Swal.fire("Updated!", "Your item has been updated.", "success");
      },
      onError: (error) => {
        console.log(error);
        Swal.fire("Error!", "An error occurred while updating the item.", "error");
      }
    });
  };

  const handleAddColor = (data) => {
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
        colorAdd.mutate(
          { data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("colors");
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
  const handleUpdateColor = (data) => {
    console.log(data);
    colorUpdate.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries("colors");
        Swal.fire("Updated!", "Your item has been updated.", "success");
      },
      onError: (error) => {
        console.log(error);
        Swal.fire("Error!", "An error occurred while updating the item.", "error");
      }
    });
  };

  const handleAddPromos = (data) => {
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
        promoAdd.mutate(
          { data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("promos");
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
  const handleUpdatePromos = (data) => {
    console.log(data);
    promoUpdate.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries("promos");
        Swal.fire("Updated!", "Your item has been updated.", "success");
      },
      onError: (error) => {
        console.log(error);
        Swal.fire("Error!", "An error occurred while updating the item.", "error");
      }
    });
  };
  return (
    <div>
      <Promotion
        setModalOpen={setIsOpenPromotion}
        setInit={setInitPromotionData}
        setActionType={setActionType}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          minHeight: "300px",
          margin: "20px 0px 0px 0px"
        }}
      >
        <div style={{ flex: "1" }}>
          <Categories
            setModalOpen={setIsOpenCate}
            setInit={setInitCateData}
            setActionType={setActionType}
          />
        </div>
        <div style={{ flex: "1" }}>
          <Brand
            setModalOpen={setIsOpenBrand}
            setInit={setInitBrandData}
            setActionType={setActionType}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          minHeight: "300px",
          margin: "20px 0px 0px 0px"
        }}
      >
        <div style={{ flex: "1" }}>
          <Colors
            setModalOpen={setIsOpenColor}
            setInit={setInitColorData}
            setActionType={setActionType}
          />
        </div>
        <div style={{ flex: "1" }}>
          <Sizes
            setModalOpen={setIsOpenSize}
            setInit={setInitSizeData}
            setActionType={setActionType}
          />
        </div>
      </div>
      {/* modals */}
      <CategoryModal
        open={isOpenCate}
        setOpen={setIsOpenCate}
        initData={initCateData}
        type={actionType}
        addCall={handleAddCate}
        updateCall={handleUpdateCate}
      />
      <BrandModal
        open={isOpenBrand}
        setOpen={setIsOpenBrand}
        initData={initBrandData}
        type={actionType}
        addCall={handleAddBrand}
        updateCall={handleUpdateBrand}
      />
      <ColorModal
        open={isOpenColor}
        setOpen={setIsOpenColor}
        initData={initColorData}
        type={actionType}
        addCall={handleAddColor}
        updateCall={handleUpdateColor}
      />
      <SizeModal
        open={isOpenSize}
        setOpen={setIsOpenSize}
        initData={initSizeData}
        type={actionType}
        addCall={handleAddSize}
        updateCall={handleUpdateSize}
      />
      <PromotionModal
        open={isOpenPromotion}
        setOpen={setIsOpenPromotion}
        initData={initPromotionData}
        type={actionType}
        addCall={handleAddPromos}
        updateCall={handleUpdatePromos}
      />
    </div>
  );
};

export default Others;
const BrandModal = ({ open, setOpen, type, initData, addCall, updateCall }) => {
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
    name: Yup.string().required("Required")
  });

  const createData = {
    name: undefined
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
          {type === "create" ? <span>New Brand</span> : <span>Update Brand</span>}
          <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            X
          </IconButton>
        </DialogTitle>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={type === "create" ? createData : initData}
          validationSchema={validate}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
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
                style={{ width: "100%" }}
                name="name"
                label="Name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button
                  style={{ width: "150px", margin: "0px 20px" }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

const CategoryModal = ({ open, setOpen, type, initData, addCall, updateCall }) => {
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
    name: Yup.string().required("Required")
  });

  const createData = {
    name: undefined
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
          {type === "create" ? <span>New Category</span> : <span>Update Category</span>}
          <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            X
          </IconButton>
        </DialogTitle>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={type === "create" ? createData : initData}
          validationSchema={validate}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
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
                style={{ width: "100%" }}
                name="name"
                label="Name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button
                  style={{ width: "150px", margin: "0px 20px" }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

const ColorModal = ({ open, setOpen, type, initData, addCall, updateCall }) => {
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
    name: Yup.string().required("Required"),
    colorCode: Yup.string().required("Required")
  });

  const createData = {
    name: undefined,
    colorCode: undefined
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
          {type === "create" ? <span>New Color</span> : <span>Update Color</span>}
          <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            X
          </IconButton>
        </DialogTitle>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={type === "create" ? createData : initData}
          validationSchema={validate}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
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
                style={{ width: "100%" }}
                name="name"
                label="Name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                  padding: "0pz 10px"
                }}
              >
                <TextField
                  style={{ flex: 3 }}
                  name="colorCode"
                  label="Color Code"
                  value={values.colorCode}
                  onChange={handleChange}
                  error={touched.colorCode && !!errors.colorCode}
                  helperText={touched.colorCode && errors.colorCode}
                />
                <div style={{ height: "40px", flex: 1, backgroundColor: values.colorCode }}></div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button
                  style={{ width: "150px", margin: "0px 20px" }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

const SizeModal = ({ open, setOpen, type, initData, addCall, updateCall }) => {
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
    value: Yup.string().required("Required")
  });

  const createData = {
    value: undefined
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
          {type === "create" ? <span>New Size</span> : <span>Update Size</span>}
          <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            X
          </IconButton>
        </DialogTitle>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={type === "create" ? createData : initData}
          validationSchema={validate}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
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
                style={{ width: "100%" }}
                name="value"
                label="Size value"
                value={values.value}
                onChange={handleChange}
                error={touched.value && !!errors.value}
                helperText={touched.value && errors.value}
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button
                  style={{ width: "150px", margin: "0px 20px" }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

const PromotionModal = ({ open, setOpen, type, initData, addCall, updateCall }) => {
  const handleFormSubmit = (values) => {
    if (type === "create") {
      addCall(values);
    }
    if (type === "edit") {
      updateCall({ data: values });
    }
    setOpen(false);
  };

  const validate = Yup.object().shape({
    code: Yup.string().required("Required"),
    percent: Yup.string().required("Required"),
    maxValue: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    startDate: Yup.string().required("Required"),
    exprireDate: Yup.string().required("Required")
  });

  const createData = {
    code: undefined,
    percent: undefined,
    maxValue: undefined,
    description: undefined,
    tartDate: new Date(),
    expireDate: new Date()
  };

  if (type === "edit") {
    console.log("edit=", initData);
  }

  function generateRandomString() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperComponent={({ children }) => (
          <Paper
            style={{
              width: "70%",
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
          {type === "create" ? <span>New Promos</span> : <span>Update Promos</span>}
          <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            X
          </IconButton>
        </DialogTitle>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={type === "create" ? createData : initData}
          validationSchema={validate}
        >
          {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => (
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
                style={{ width: "100%" }}
                name="code"
                label="Code"
                value={values.code}
                onChange={handleChange}
                error={touched.code && !!errors.code}
                helperText={touched.code && errors.code}
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button
                  style={{ width: "150px", margin: "0px 20px" }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};
