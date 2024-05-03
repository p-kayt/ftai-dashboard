import {
  Button,
  Checkbox,
  CircularProgress,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imageWithUrl } from "api/firebaseConfig";
import { getAllBrands, getAllCategories, getAllColors, getAllSizes } from "api/othersApi";
import {
  addNewProduct,
  deleteProductById,
  getProductsFiltered,
  updateProduct
} from "api/productApi";
import DetailModal from "app/components/DetailModel";
import ImageUpload from "app/components/firebase/ImageUpload";
import { FieldArray, Formik } from "formik";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

const Products = () => {
  const queryClient = useQueryClient();
  const { data: products, isSuccess } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsFiltered(filterParams)
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

  // const productsQuery = useQuery({
  //   queryKey: ["products"],
  //   queryFn: () => getProductsFiltered(filterParams)
  //   // refetchOnWindowFocus: true,
  // });

  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [productId, setProductId] = useState();
  const [func, setFunc] = useState(null);
  const [imagesFetched, setImagesFetched] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterParams, setFilterParams] = useState({
    name: null,
    category: null,
    subCategory: null,
    color: null,
    size: null,
    minPrice: null,
    maxPrice: null
  });
  const handleSearch = () => {
    queryClient.invalidateQueries("products");
  };

  useEffect(() => {
    if (searchValue?.length !== 0) {
      setFilterParams((prevParams) => ({ ...prevParams, name: searchValue }));
    } else {
      setFilterParams({
        name: null,
        category: null,
        subCategory: null,
        color: null,
        size: null,
        minPrice: null,
        maxPrice: null
      });
    }
    // if (paramSearch) {
    //   setFilterParams((prevParams) => ({ ...prevParams, name: paramSearch }));
    // }
    // if (cateParam) {
    //   // console.log("cateParam", cateParam);
    //   setFilterParams((prevParams) => ({ ...prevParams, category: cateParam }));
    // }
  }, [
    searchValue
    // paramSearch, cateParam
  ]);
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
      width: 70,
      renderCell: (params) => (
        <div
          onClick={() => {
            // console.log(params);
            handleRowClick(params.row);
          }}
        >
          {params.value}
        </div>
      )
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => <div onClick={() => handleRowClick(params.row)}>{params.value}</div>
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      flex: 2,
      renderCell: (params) => <div onClick={() => handleRowClick(params.row)}>{params.value}</div>
    },
    {
      field: "totalSold",
      headerName: "Total sold",
      // sortable: false,
      width: 100,
      renderCell: (params) => <div onClick={() => handleRowClick(params.row)}>{params.value}</div>
    },
    {
      field: "brand",
      headerName: "Brand",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 100,
      valueGetter: (value) => value.name,
      renderCell: (params) => <div onClick={() => handleRowClick(params.row)}>{params.value}</div>
    },
    {
      field: "category",
      headerName: "Category",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 100,
      valueGetter: (value) => value.name,
      renderCell: (params) => <div onClick={() => handleRowClick(params.row)}>{params.value}</div>
    },
    {
      field: "sku",
      headerName: "Available variant (SKU codes)",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "5px", padding: "10px 2px" }}
          onClick={() => handleRowClick(params.row)}
        >
          {params.row.productVariants.map((item, index) => {
            if (item.sku)
              return (
                <div
                  key={index}
                  style={{
                    minWidth: `${item.sku.length * 10}px`, // Dynamic minWidth based on content length
                    display: "flex",
                    alignItems: "center", // Vertical alignment within item (optional)
                    padding: "2px 5px",
                    backgroundColor: "#53609D",
                    color: "white",
                    border: "solid 1px gray",
                    borderRadius: "10px",
                    marginRight: "5px", // Optional margin for spacing between items
                    // Optional: Set a fixed or maximum height
                    height: "30px" // Example: Fixed height
                  }}
                >
                  {item.sku}
                </div>
              );
            return null;
          })}
        </div>
      )
    },
    {
      field: "defaultImage",
      headerName: "Image",
      headerAlign: "center",
      sortable: false,
      flex: 2,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%"
          }}
          onClick={() => handleRowClick(params.row)}
        >
          <img
            src={params.row.defaultImage || "path/to/default-image.png"}
            alt="Product imgg"
            style={{
              width: "100px", // Ensures image takes full available width within the cell
              objectFit: "contain", // Resize proportionally to fit while maintaining aspect ratio
              maxHeight: "250px" // Max height aligns with the row height
            }}
            onError={(event) => {
              event.target.src = "path/to/alternative-image.png"; // Optional: Set alternative image on error
            }}
          />
        </div>
      )
    },

    {
      field: "options",
      headerName: "Options",
      headerAlign: "center",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              gap: "10px"
            }}
          >
            <Button
              sx={{ width: "100px" }}
              color="success"
              variant="outlined"
              onClick={() => {
                handleEdit(params.row.id); // Call handleEdit only if not options click

                // Reset flag after click
              }}
            >
              Edit
            </Button>
            <Button
              sx={{ width: "100px" }}
              color="error"
              variant="outlined"
              onClick={() => {
                handleDelete(params.row.id); // Call handleDelete only if not options click
              }}
            >
              Delete
            </Button>
          </div>
        );
      }
    }
  ];

  const handleRowClick = (row) => {
    setProductId(row.id);
    setOpenDetail(true);
  };

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "20px" }}>
      <div
        style={{
          margin: "10px 0px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <Button
          style={{ backgroundColor: "#53609D", height: "40px" }}
          variant="contained"
          onClick={() => {
            setProduct(null);
            setOpen(true);
            setFunc("create");
          }}
        >
          Add new product
        </Button>

        <TextField
          label="Search"
          variant="outlined"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ height: "40px", marginBottom: 0 }}
          InputProps={{
            style: { height: "40px", padding: "0 14px" }
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Button
          variant="contained"
          style={{ backgroundColor: "#53609D", height: "40px" }}
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: "#53609D", height: "40px" }}
          onClick={()=>{
            queryClient.invalidateQueries("products");

          }}
        >
          Refresh
        </Button>
      </div>

      {isSuccess && (
        <DataGrid
          rows={products}
          columns={columns}
          rowHeight={150}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          pageSizeOptions={[10, 20]}
          style={{ minHeight: "500px" }}
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important"
            }
          }}
          // onRowClick={handleRowClick}
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
      {productId && <DetailModal open={openDetail} setOpen={setOpenDetail} productId={productId} />}
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
    console.log("submit",values);
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
        properties: values.properties,
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
      result.properties = values.properties;
      // replace variant
      result.defaultImage = values.images[0].url;
      console.log('values', result.categoryId);
    result.categoryId = values.categoryId;
    result.brandId = values.brandId;  
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
      // console.log(result);
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
    ],
    properties: []
  };
  // console.log(initProduct);
  const [initData, setInitData] = useState();
  // console.log(initData);
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
          // console.log("inside", initProduct);
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
            properties: initProduct.properties,
            images: newImgs
          });
          // console.log("initData", initData);
          setImagesFetched(true); // Set imagesFetched to true after images have been fetched
        })
        .catch((error) => {
          console.error(error);
          setInitData({
            ...createData,
            name: initProduct.name,
            description: initProduct.description,
            defaultImage: initProduct.defaultImage,
            tryOnImage: initProduct.tryOnImage,
            canTryOn: initProduct.canTryOn,
            edgeImage: initProduct.edgeImage,
            categoryId: initProduct.categoryId,
            brandId: initProduct.brandId,
            productVariants: initProduct.productVariants.map((variant) => ({
              colorId: variant.colorId,
              sizeId: variant.sizeId,
              quantity: variant.quantity,
              price: variant.price
            })),
            properties: initProduct.properties,
            images: initProduct.images.map((image) => ({
              url: image.imageUrl,
              name: image.imageUrl
            }))
          });
          // console.log("initData 2", createData);
          // console.log("initData 2", initData);
          setImagesFetched(true);
        })
        .finally();
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
                                defaultValue={imgData?.name ? imgData?.name : ""}
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
                        onChange={(event) => setFieldValue("brandId", event.target.value)}
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
                          onChange={(event) => {
                            console.log(event.target.value);
                            setFieldValue("categoryId", event.target.value)
                          }
                           
                          }
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

                <div>
                  <InputLabel id="prop-label">Other property</InputLabel>
                  <FieldArray name="properties">
                    {({ push, remove }) => (
                      <div>
                        {values.properties.map((property, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                              margin: "10px 0"
                            }}
                          >
                            <InputLabel id={`property-label-${index}`}>
                              Property {index + 1}
                            </InputLabel>
                            <div>
                              <InputLabel id={`name-label-${index}`}>Name</InputLabel>
                              <TextField
                                name={`properties[${index}].name`}
                                variant="outlined"
                                value={property.name}
                                onChange={handleChange}
                              />
                            </div>
                            <div>
                              <InputLabel id={`value-label-${index}`}>Value</InputLabel>
                              <TextField
                                name={`properties[${index}].value`}
                                variant="outlined"
                                value={property.value}
                                onChange={handleChange}
                              />
                            </div>
                            <Button onClick={() => remove(index)}>Remove</Button>
                          </div>
                        ))}
                        <Button onClick={() => push({ name: "", value: "" })}>Add Property</Button>
                      </div>
                    )}
                  </FieldArray>
                  {/* <FieldArray
                    name="properties"
                    render={(arrayHelpers) => (
                      <div>
                        {values.properties &&
                          values.properties.map((property, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "10px",
                                margin: "10px 0"
                              }}
                            >
                              <InputLabel id={`prop-label-${index}`}>
                                Propety {index + 1}
                              </InputLabel>
                              <TextField
                                name={`properties.${index}.name`}
                                label="Name"
                                variant="outlined"
                                value={property.name}
                                onChange={handleChange}
                              />
                              <TextField
                                name={`properties.${index}.value`}
                                label="Value"
                                variant="outlined"
                                value={property.value}
                                onChange={handleChange}
                              />
                              <Button onClick={() => arrayHelpers.remove(index)}>Remove</Button>
                            </div>
                          ))}
                        <Button onClick={() => arrayHelpers.push({ name: "", value: "" })}>
                          Add a property
                        </Button>
                      </div>
                    )}
                  /> */}
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
