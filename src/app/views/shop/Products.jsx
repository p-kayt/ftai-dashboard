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
  TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addNewProduct,
  deleteProductById,
  getAllBrands,
  getAllCategories,
  getAllColors,
  getAllProducts,
  getAllSizes
} from "api/productApi";
import { FieldArray, Formik } from "formik";
import React from "react";

import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import Swal from "sweetalert2";

const Products = () => {
  const {
    data: products,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });

  const cateQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories
  });

  const brandQuery = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands
  });

  const colorQuery = useQuery({
    queryKey: ["colors"],
    queryFn: getAllColors
  });

  const sizeQuery = useQuery({
    queryKey: ["sizes"],
    queryFn: getAllSizes
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteProductById"],
    mutationFn: (id) => deleteProductById({ id }),
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const addMutation = useMutation({
    mutationKey: ["addProduct"],
    mutationFn: (data) => addNewProduct(data),
    onSuccess: () => {
      console.log("add success");
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const [open, setOpen] = useState(false);
  const [func, setFunc] = useState(null);
  const [product, setProduct] = useState({
    name: null,
    description: null,
    defaultImage: null,
    tryOnImage: null,
    canTryOn: false,
    edgeImage: null,
    category: null,
    brand: {},
    properties: [],
    images: [],
    productVariants: []
  });

  const handleEdit = (id) => {
    const editedProduct = products.find((product) => product.id === id);
    setProduct(editedProduct);
    setOpen(true);
    setFunc("edit");
    // console.log("Edit: ", id);
    // console.log("product", editedProduct);
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
        deleteMutation.mutate(id, {
          onSuccess: () => {
            console.log("success");
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          },
          onError: (error) => {
            console.log(error);
            Swal.fire("Error!", "An error occurred while deleting the item.", "error");
          }
        });
        console.log("Delete: ", id);
      }
    });
  };

  const handleAdd = (data) => {
    console.log("add", data);
    // addMutation.mutate(
    //   { data },
    //   {
    //     onSuccess: () => {
    //       Swal.fire("Added!", "Your item has been added.", "success");
    //     },
    //     onError: (error) => {
    //       Swal.fire("Error!", "An error occurred while adding the item.", "error");
    //     }
    //   }
    // );
  };

  const handleUpdate = (data) => {
    console.log(data);
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
      field: "description",
      headerName: "Description",
      sortable: false,
      width: 400
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
      width: 250
    },

    {
      field: "options",
      headerName: "Options",
      headerAlign: "right",
      sortable: false,
      width: 180,
      renderCell: (params) => (
        <strong>
          <div style={{ margin: "0 auto" }}>
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
          </div>
        </strong>
      )
    }
  ];

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "20px" }}>
      <div style={{ margin: "10px 0px" }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
            setFunc("create");
          }}
        >
          Add new product
        </Button>
      </div>
      {isSuccess && (
        <DataGrid
          rows={products}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          pageSizeOptions={[10, 20]}
        />
      )}
      {cateQuery.isSuccess &&
        brandQuery.isSuccess &&
        colorQuery.isSuccess &&
        sizeQuery.isSuccess && (
          <Modal
            open={open}
            setOpen={setOpen}
            type={func}
            initProduct={product}
            setProduct={setProduct}
            categories={cateQuery.data.data}
            brands={brandQuery.data.data}
            colors={colorQuery.data.data}
            sizes={sizeQuery.data.data}
            addCall={handleAdd}
            updateCall={handleUpdate}
          />
        )}
    </div>
  );
};

export default Products;

const Modal = ({
  open,
  setOpen,
  type,
  initProduct,
  setProduct,
  categories,
  brands,
  colors,
  sizes,
  addCall,
  updateCall
}) => {
  const handleFormSubmit = (values) => {
    let newProduct = {
      name: values.name,
      description: values.description,
      defaultImage: values.defaultImage,
      tryOnImage: values.tryOnImage,
      canTryOn: values.canTryOn,
      edgeImage: values.edgeImage,
      category: values.category,
      brand: values.brand,
      // properties: [],
      // images: [],
      productVariants: values.productVariants
    };

    if (values.subCategories) {
      newProduct = {
        ...newProduct,
        category: {
          ...newProduct.category,
          subCategories: [values.subCategories]
        }
      };
    }
    setProduct(newProduct);
    // console.log("new", newProduct);
    if (type === "create") {
      addCall(newProduct);
    } else {
      updateCall(newProduct);
    }
    setOpen(false);
  };

  const initCate = categories[0];
  const initSubCate = initCate.subCategories[0];

  let initData = {
    name: null,
    description: null,
    defaultImage: null,
    tryOnImage: null,
    canTryOn: false,
    edgeImage: null,
    category: initCate,
    subCategories: initSubCate,
    brand: brands[0],
    // color: colors[0],
    // size: sizes[0],
    // quantity: 1,
    // price: 0,
    productVariants: [
      {
        color: colors[0],
        size: sizes[0],
        quantity: 1,
        price: 0
      }
    ]
  };

  if (type === "edit") {
    initData = {
      ...initData,
      name: initProduct.name,
      description: initProduct.description,
      defaultImage: initProduct.defaultImage,
      tryOnImage: initProduct.tryOnImage,
      canTryOn: initProduct.canTryOn,
      edgeImage: initProduct.edgeImage,
      category: initProduct.category,
      brand: initProduct.brand,
      productVariants: initProduct.productVariants,
      subCategories: initProduct.category ? initProduct.category.subCategories : initSubCate
    };
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
              minHeight: "80%",
              maxHeight: "90%",
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
          {type === "create" ? <span>New Product</span> : <span>Update Product</span>}
          <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            X
          </IconButton>
        </DialogTitle>
        <Formik onSubmit={handleFormSubmit} initialValues={initData}>
          {({ values, handleChange, handleSubmit }) => (
            <form
              style={{
                display: "flex",
                height: "100%",
                padding: "10px 10px 20px 10px",
                marginBottom: "10px",
                flexDirection: "column",
                justifyContent: "flex-start"
              }}
              onSubmit={handleSubmit}
            >
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                <TextField
                  style={{ width: "100%" }}
                  name="name"
                  label="Name"
                  value={values?.name}
                  onChange={handleChange}
                />
                <TextField
                  style={{ width: "100%" }}
                  inputProps={{ style: { height: "100px" } }}
                  name="description"
                  label="Description"
                  multiline
                  row={2}
                  value={values?.description}
                  onChange={handleChange}
                />
                <TextField
                  style={{ width: "100%" }}
                  name="defaultImage"
                  label="Image"
                  value={values?.defaultImage}
                  onChange={handleChange}
                />

                {/* <div style={{ display: "flex", flexDirection: "row", width: "100%" }}> */}
                <FormControlLabel
                  style={{ width: "150px", height: "100%", margin: "0 10px" }}
                  control={
                    <Checkbox name="canTryOn" checked={values?.canTryOn} onChange={handleChange} />
                  }
                  label="Can Try On"
                />
                {values.canTryOn && (
                  <div
                    style={{ display: "flex", width: "100%", flexDirection: "row", gap: "10px" }}
                  >
                    <TextField
                      style={{ flex: "1" }}
                      name="edgeImage"
                      label="Edge Image"
                      value={values?.edgeImage}
                      onChange={handleChange}
                    />
                    <TextField
                      style={{ flex: "1" }}
                      name="tryOnImage"
                      label="Try On Image"
                      value={values?.tryOnImage}
                      onChange={handleChange}
                    />
                  </div>
                )}
                {/* </div> */}
                <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                  <div>
                    <InputLabel id="brand-label">Brand</InputLabel>
                    <Select
                      style={{ width: "150px" }}
                      name="brand"
                      labelId="brand-label"
                      value={values.brand}
                      onChange={handleChange}
                      renderValue={(brand) => brand.name}
                    >
                      {brands.map((brands) => (
                        <MenuItem key={brands.id} value={brands}>
                          {brands.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                    <div>
                      <InputLabel id="cate-label">Category</InputLabel>
                      <Select
                        name="category"
                        labelId="cate-label"
                        value={values.category}
                        onChange={handleChange}
                        renderValue={(category) => category.name}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div>
                      {values.category.subCategories.length !== 0 && (
                        <>
                          <InputLabel id="subCate-label">Sub Category</InputLabel>
                          <Select
                            name="subCategories"
                            labelId="subC ate-label"
                            value={values.subCategories}
                            onChange={handleChange}
                            renderValue={(subCategories) => subCategories.name}
                          >
                            {values.category?.subCategories.map((subCategory) => (
                              <MenuItem key={subCategory.id} value={subCategory}>
                                {subCategory.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <InputLabel id="variant-label">Variant</InputLabel>
                  <FieldArray name="productVariants">
                    {({ push, remove }) => (
                      <div>
                        {values.productVariants.map((variant, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                              margin: "10px 0"
                            }}
                          >
                            <InputLabel id={`variant-label-${index}`}>
                              Variant {index + 1}
                            </InputLabel>
                            <div>
                              <InputLabel id={`color-label-${index}`}>Color</InputLabel>
                              <Select
                                name={`productVariants[${index}].color`}
                                style={{ width: "120px" }}
                                labelId={`color-label-${index}`}
                                value={variant.color}
                                onChange={handleChange}
                                renderValue={(color) => color.colorCode}
                              >
                                {colors.map((color) => (
                                  <MenuItem key={color.id} value={color}>
                                    <div
                                      style={{
                                        display: "flex",
                                        width: "100%",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        textAlign: "center"
                                      }}
                                    >
                                      {color.colorCode}
                                      <div
                                        style={{
                                          height: "30px",
                                          width: "30px",
                                          margin: "0 10px",
                                          backgroundColor: color.colorCode
                                        }}
                                      ></div>
                                    </div>
                                  </MenuItem>
                                ))}
                              </Select>
                            </div>
                            <div>
                              <InputLabel id={`size-label-${index}`}>Size</InputLabel>
                              <Select
                                name={`productVariants[${index}].size`}
                                style={{ width: "100px" }}
                                labelId={`size-label-${index}`}
                                value={variant.size}
                                onChange={handleChange}
                                renderValue={(size) => size.value}
                              >
                                {sizes.map((size) => (
                                  <MenuItem key={size.id} value={size}>
                                    {size.value}
                                  </MenuItem>
                                ))}
                              </Select>
                            </div>
                            <div>
                              <InputLabel id={`quantity-label-${index}`}>Quantity</InputLabel>
                              <TextField
                                name={`productVariants[${index}].quantity`}
                                labelId={`quantity-label-${index}`}
                                value={variant.quantity}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ min: "1" }}
                              />
                            </div>

                            <div>
                              <InputLabel id={`price-label-${index}`}>Price (VNĐ)</InputLabel>
                              <TextField
                                name={`productVariants[${index}].price`}
                                labelId={`price-label-${index}`}
                                value={variant.price}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ min: "0" }}
                              />
                            </div>

                            <Button onClick={() => remove(index)}>Remove</Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => push({ color: "", size: "", quantity: 1, price: 0 })}
                        >
                          Add Variant
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
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
