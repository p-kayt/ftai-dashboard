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
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imageWithUrl } from "api/firebaseConfig";
import { getAllBrands, getAllCategories, getAllColors, getAllSizes } from "api/othersApi";
import { addNewProduct, deleteProductById, getAllProducts, updateProduct } from "api/productApi";
import ImageUpload from "app/components/firebase/ImageUpload";
import { FieldArray, Formik } from "formik";
import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

const Products = () => {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries("products");
      // console.log("success");
    },
    onError: (error) => {
      // console.log(error);
    }
  });

  const addMutation = useMutation({
    mutationKey: ["addProduct"],
    mutationFn: (data) => addNewProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      // console.log("add success");
    },
    onError: (error) => {
      // console.log(error);
    }
  });

  const updateMutation = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: ({ id, data }) => updateProduct({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      // console.log("update success");
    },
    onError: (error) => {
      // console.log(error);
    }
  });

  const [open, setOpen] = useState(false);
  const [func, setFunc] = useState(null);
  const [imagesFetched, setImagesFetched] = useState(true);
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
    setImagesFetched(false);
    // // console.log("Edit: ", id);
    // // console.log("product", editedProduct);
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
            // console.log("success");
            queryClient.invalidateQueries("products");
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
    // console.log("add", data);
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to add an item. This item will be avaliable on shop pages",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!"
    }).then((result) => {
      if (result.isConfirmed) {
        addMutation.mutate(
          { data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("products");
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
    // console.log("update", data);
    updateMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
        Swal.fire("Updated!", "Your item has been updated.", "success");
      },
      onError: (error) => {
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
      field: "description",
      headerName: "Description",
      sortable: false,
      flex: 2
    },
    {
      field: "totalSold",
      headerName: "Total sold",
      // sortable: false,
      width: 100
    },
    {
      field: "brand",
      headerName: "Brand",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 100,
      valueGetter: (value) => value.name
    },
    {
      field: "category",
      headerName: "Category",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 100,
      valueGetter: (value) => value.name
    },
    {
      field: "defaultImage",
      headerName: "Image",
      sortable: false,
      flex: 2
    },

    {
      field: "options",
      headerName: "Options",
      headerAlign: "center",
      sortable: false,
      width: 200,
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
          style={{ marginBottom: "10px" }}
          variant="contained"
          onClick={() => {
            setProduct(null);
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
            imagesFetched={imagesFetched}
            setImagesFetched={setImagesFetched}
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
  updateCall,
  imagesFetched,
  setImagesFetched
}) => {
  const handleFormSubmit = (values) => {
    // setProduct(newProduct);
    if (type === "create") {
      let newProduct = {
        name: values.name,
        description: values.description,
        defaultImage: values.images[0].url,
        tryOnImage: values.tryOnImage,
        canTryOn: values.canTryOn,
        edgeImage: values.edgeImage,
        categoryId: values.categoryId,
        brandId: values.brandId,
        // properties: [],
        images: values.images.map((item) => {
          return { url: item.url };
        }),
        productVariants: values.productVariants
      };
      addCall(newProduct);
    } else {
      //filter and assign obj
      const obj1 = { ...initProduct };
      // console.log(obj1.hasOwnProperty("brand"));
      delete obj1.brand;
      delete obj1.category;
      let result = Object.assign({}, obj1, values);
      // replace variant
      result.productVariants = values.productVariants.map((variant) => {
        let size = sizes.find((size) => size.id === variant.sizeId);
        let color = colors.find((color) => color.id === variant.colorId);

        return {
          ...variant,
          productId: initProduct.id,
          size: size,
          color: color
        };
      });
      // Replace imageUrl in images array
      result.images = values.images.map((image) => {
        return {
          imageUrl: image.url
        };
      });

      updateCall({ id: initProduct.id, data: result });
    }
    setOpen(false);
  };

  const createData = {
    name: null,
    description: null,
    defaultImage: null,
    tryOnImage: null,
    canTryOn: false,
    edgeImage: null,
    categoryId: categories[0].id,
    brandId: brands[0].id,
    images: [],
    productVariants: [
      {
        colorId: colors[0].id,
        sizeId: sizes[0].id,
        quantity: 1,
        price: 0
      }
    ]
  };

  const [initData, setInitData] = useState();
  // console.log(initProduct);
  if (type === "edit") {
    if (!imagesFetched) {
      let newImgs = [];
      // Use Promise.all to wait for all promises to resolve
      Promise.all(
        // Map over the images array and call imageWithUrl for each image
        initProduct.images.map((image) => imageWithUrl({ url: image.imageUrl }))
      )
        .then((newImages) => {
          // newImages is an array of image objects
          newImgs = [...newImages.flat()];

          setInitData({
            ...createData,
            name: initProduct.name,
            description: initProduct.description,
            defaultImage: initProduct.defaultImage,
            tryOnImage: initProduct.tryOnImage,
            canTryOn: initProduct.canTryOn,
            edgeImage: initProduct.edgeImage,
            categoryId: initProduct.category.id,
            brandId: initProduct.brand.id,
            productVariants: initProduct.productVariants.map((variant) => ({
              colorId: variant.colorId,
              sizeId: variant.sizeId,
              quantity: variant.quantity,
              price: variant.price
            })),
            images: newImgs
          });
          // console.log(initData);
          setImagesFetched(true); // Set imagesFetched to true after images have been fetched
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  const imageSchema = Yup.object().shape({
    // Define validation for each property of the image object
    name: Yup.string().required("Required"),
    url: Yup.string().url("Must be a valid URL").required("Required")
    // Add other properties as needed
  });

  const validate = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    defaultImage: Yup.string().nullable(),
    tryOnImage: Yup.string().nullable(),
    canTryOn: Yup.boolean(),
    edgeImage: Yup.string().nullable(),
    categoryId: Yup.string().nullable(),
    brandId: Yup.string().nullable(),
    images: Yup.array().of(imageSchema).min(1, "At least one image is required"),
    productVariants: Yup.array().of(
      Yup.object().shape({
        colorId: Yup.string().nullable(),
        sizeId: Yup.string().nullable(),
        quantity: Yup.number().min(1),
        price: Yup.number().min(0)
      })
    )
  });

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
        {imagesFetched ? (
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
                  justifyContent: "flex-start"
                }}
                onSubmit={handleSubmit}
              >
                <div
                  style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}
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
                  <TextField
                    style={{ width: "100%" }}
                    inputProps={{ style: { height: "100px" } }}
                    name="description"
                    label="Description"
                    multiline
                    row={2}
                    value={values.description}
                    onChange={handleChange}
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                  {/* <TextField
                  style={{ width: "100%" }}
                  name="defaultImage"
                  label="Image"
                  value={values?.defaultImage}
                  onChange={handleChange}
                /> */}

                  <div>
                    <InputLabel id="images-label">Images</InputLabel>
                    <ImageUpload
                      onUpload={(imgData) => {
                        setFieldValue("images", [...values.images, imgData]);
                      }}
                    />
                    {/* Display a list of uploaded images */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {values.images &&
                        values.images.map((imgData, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                              justifyContent: "flex-start"
                            }}
                          >
                            <div
                              style={{
                                width: "30%",
                                flexDirection: "column",
                                alignItems: "center"
                              }}
                            >
                              <TextField
                                style={{ width: "100%" }}
                                label="Name"
                                defaultValue={imgData.name}
                                InputProps={{
                                  readOnly: true
                                }}
                                focused={false}
                              />
                            </div>
                            <div
                              style={{
                                width: "55%",
                                display: "flex",
                                flexDirection: "row",
                                alignContent: "center",
                                gap: "10px"
                              }}
                            >
                              <TextField
                                label="Image URL"
                                style={{ width: "80%" }}
                                defaultValue={imgData.url}
                                InputProps={{
                                  readOnly: true
                                }}
                                focused={false}
                              />
                              <Button
                                style={{ width: "100px", alignItems: "center" }}
                                href={imgData.url}
                                target="_blank"
                              >
                                Open link
                              </Button>
                            </div>
                            <Button
                              onClick={() => {
                                // Remove the image from the images array
                                const newImages = values.images.filter((_, i) => i !== index);
                                setFieldValue("images", newImages);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      {errors.images && touched.images ? (
                        <div style={{ color: "red" }}>{errors.images}</div>
                      ) : null}
                    </div>
                  </div>
                  {/* <div style={{ display: "flex", flexDirection: "row", width: "100%" }}> */}
                  <FormControlLabel
                    style={{ width: "150px", height: "100%", margin: "0 10px" }}
                    control={
                      <Checkbox
                        name="canTryOn"
                        checked={values?.canTryOn}
                        onChange={handleChange}
                      />
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
                        name="brandId"
                        labelId="brand-label"
                        value={values.brandId}
                        onChange={handleChange}
                        renderValue={(brandId) => brands.find((brand) => brand.id === brandId).name}
                      >
                        {brands.map((brand) => (
                          <MenuItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                      <div>
                        <InputLabel id="cate-label">Category</InputLabel>
                        <Select
                          name="categoryId"
                          labelid="cate-label"
                          style={{ width: "150px" }}
                          value={values.categoryId}
                          onChange={handleChange}
                          renderValue={(categoryId) =>
                            categories.find((category) => category.id === categoryId).name
                          }
                        >
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      {/* <div>
                      {values.category?.subCategories?.length !== 0 && (
                        <>
                          <InputLabel id="subCate-label">Sub Category</InputLabel>
                          <Select
                            name="subCategories"
                            labelid="subC ate-label"
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
                    </div> */}
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
                                  name={`productVariants[${index}].colorId`}
                                  style={{ width: "120px" }}
                                  labelId={`color-label-${index}`}
                                  value={variant.colorId}
                                  onChange={handleChange}
                                  renderValue={(colorId) =>
                                    colors.find((color) => color.id === colorId).colorCode
                                  }
                                >
                                  {colors.map((color) => (
                                    <MenuItem key={color.id} value={color.id}>
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
                                  name={`productVariants[${index}].sizeId`}
                                  style={{ width: "100px" }}
                                  labelId={`size-label-${index}`}
                                  value={variant.sizeId}
                                  onChange={handleChange}
                                  renderValue={(sizeId) =>
                                    sizes.find((size) => size.id === sizeId).value
                                  }
                                >
                                  {sizes.map((size) => (
                                    <MenuItem key={size.id} value={size.id}>
                                      {size.value}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </div>
                              <div>
                                <InputLabel id={`quantity-label-${index}`}>Quantity</InputLabel>
                                <TextField
                                  name={`productVariants[${index}].quantity`}
                                  labelid={`quantity-label-${index}`}
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
                                  labelid={`price-label-${index}`}
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
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <CircularProgress />
          </div>
        )}
      </Dialog>
    </div>
  );
};
