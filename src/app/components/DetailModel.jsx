import { CircularProgress, Dialog, DialogTitle, IconButton, Paper, Rating } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductById, getProductReview } from "api/productApi";
import { useEffect, useState } from "react";

// import Rating from "@mui/material/Rating";

const DetailModal = ({ open, setOpen, productId }) => {
  const queryClient = useQueryClient();

  const productQuery = useQuery({
    queryKey: ["product"],
    queryFn: () => getProductById({ id: productId })
  });

  const reviewQuery = useQuery({
    queryKey: ["review"],
    queryFn: () => getProductReview({ id: productId })
  });

  const [selectedImg, setSelectedImg] = useState(null);
  useEffect(() => {
    setSelectedImg(null);
  }, [productQuery.isSuccess]);

  useEffect(() => {
    queryClient.invalidateQueries("product");
    queryClient.invalidateQueries("review");
  }, [productId]);
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
          <span>Detail Product</span>
          <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            X
          </IconButton>
        </DialogTitle>
        {!productQuery.isFetching ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 30px",
              height: "100%",
              marginBottom: "20px"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: "1",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <div style={{ minWidth: "200px", height: "300px" }}>
                  <img
                    style={{ objectFit: "cover", height: "100%" }}
                    src={selectedImg ? selectedImg.imageUrl : productQuery.data.data.defaultImage}
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                >
                  {productQuery.data.data.images.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        height: "100%",
                        width: "110px",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      onClick={() => setSelectedImg(item)}
                    >
                      <img
                        style={
                          selectedImg === item
                            ? {
                                objectFit: "cover",
                                height: "100%",
                                position: "absolute",
                                top: "-5px",
                                border: "solid 1px black"
                              }
                            : { objectFit: "cover", height: "100%" }
                        }
                        src={item.imageUrl}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  flex: "1"
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                    height: "50px",
                    textAlign: "left",
                    fontWeight: "600"
                  }}
                >
                  {productQuery.data.data.name}
                </div>

                <div>
                  <strong>Category:</strong> {productQuery.data.data.category.name}
                </div>
                <div>
                  <strong>Brand:</strong> {productQuery.data.data.brand.name}
                </div>
                <div>
                  <strong>Description:</strong> <br /> {productQuery.data.data.description}
                </div>
                {productQuery.data.data.properties.map((item, index) => (
                  <div key={index}>
                    <strong>{item.name}</strong>: {item.value}
                  </div>
                ))}

                <div>
                  <div>
                    <strong>Available variant:</strong>
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "5px", padding: "10px 2px" }}
                  >
                    {productQuery.data.data.productVariants.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          minWidth: `${item.sku.length * 10}px`,
                          display: "flex",
                          alignItems: "center",
                          padding: "2px 5px",
                          backgroundColor: "#53609D",
                          color: "white",
                          border: "solid 1px gray",
                          borderRadius: "10px",
                          marginRight: "5px",
                          height: "30px"
                        }}
                      >
                        {item.sku}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {!reviewQuery.isLoading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginTop: "20px"
                }}
              >
                {reviewQuery.data.data.map((item, index) => (
                  <div
                    style={{
                      border: "solid 1px #53609D",
                      padding: "10px 15px",
                      borderRadius: "5px"
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        alignItems: "center"
                      }}
                    >
                      <img
                        style={{
                          height: "50px",
                          width: "50px",
                          borderRadius: "25px"
                        }}
                        src={item.user.profilePicture}
                      />

                      <div>
                        <div style={{ fontWeight: "400", fontSize: "16px" }}>
                          {item.user.fullName}
                        </div>

                        <Rating name="read-only" size="small" value={item.rating} readOnly />
                      </div>
                    </div>

                    <div
                      style={{
                        minHeight: "20px",
                        textAlign: "left",
                        padding: "10px",
                        fontSize: "15px"
                      }}
                    >
                      {item.comment}
                    </div>
                  </div>
                ))}
              </div>
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
          </div>
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

export default DetailModal;
