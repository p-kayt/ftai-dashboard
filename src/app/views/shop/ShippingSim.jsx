import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptOrderbyIdnStatus, cancelOrderbyIdnStatus, getAllOrders } from "api/orderApi";
import Loading from "app/components/MatxLoading";
import { dateConvert, transNumberFormatter } from "app/utils/utils";
import { Fragment } from "react";
import Swal from "sweetalert2";

export const processNumber = (number) => {
  switch (number) {
    case 5:
      return "Delivering";
    case 2:
      return "Delivered";
    default:
      return "Unknow Status";
  }
};
export const processNumberColor = (number) => {
  switch (number) {
    case 5:
      return "info";
    case 2:
      return "success";
    default:
      return "default";
  }
};
export default function ShippingSim() {
  const {
    data: orders,
    isSuccess,
    isFetching
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders
  });
  const queryClient = useQueryClient();

  const acceptOrder = useMutation({
    mutationKey: ["acceptorder"],
    mutationFn: (data) => acceptOrderbyIdnStatus(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["acceptorder"]);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const rejectOrder = useMutation({
    mutationKey: ["cancelorder"],
    mutationFn: (data) => cancelOrderbyIdnStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["cancelorder"]);
    },
    onError: (error) => {
      console.log(error);
    }
  });
  const handleDelivered = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to confirm delivered this order",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          orderId: id,
          status: 6
        };
        acceptOrder.mutate(data);
      }
    });
  };
  const handleCancelled = async (id) => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Cancel Reason",
      inputPlaceholder: "Out of stock...",
      inputAttributes: {
        "aria-label": "Out of stock"
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to tell cancel reason!";
        }
      },
      showCancelButton: true
    });
    if (text) {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to cancel this order",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            orderId: id,
            status: 3,
            cancelReason: text
          };
          rejectOrder.mutate(data);
        }
      });
    }
  };

  const columns = [
    {
      field: "shippingCode",
      headerName: "Shipping Code",
      width: 150
    },
    {
      field: "recipientName",
      headerName: "Name",
      width: 180
    },
    {
      field: "recipientPhone",
      headerName: "Phone Number",
      width: 150
    },
    {
      field: "totalAmount",
      headerName: "Total Order",
      width: 150,
      renderCell: (params) => (
        <strong>
          <div style={{ margin: "0 auto" }}>{transNumberFormatter(params.row.totalAmount)}đ</div>
        </strong>
      )
    },
    {
      field: "user",
      headerName: "Email Customer",
      width: 250,
      valueGetter: (value) => value.email
    },
    {
      field: "status",
      headerName: "Order Status",
      width: 200,
      renderCell: (params) => (
        <div style={{ margin: "0 auto" }}>
          <Chip
            style={{
              fontFamily: "Poppins",
              fontWeight: 600
            }}
            label={processNumber(params.row.status)}
            color={processNumberColor(params.row.status)}
          />
        </div>
      )
    },
    {
      field: "createAt",
      headerName: "Order Created Date",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <div style={{ margin: "0 auto", textAlign: "center" }}>
          {dateConvert(params.row.createAt)}
        </div>
      )
    }, {
      field: "options",
      headerName: "Options",
      headerAlign: "center",
      width: 500,
      renderCell: (params) => (
        <Fragment>

          {params.row.status === 5 ? <div
            style={{
              margin: "0 auto",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button variant="outlined" onClick={() => handleDelivered(params.row.id)}>
              Confirm delivered
            </Button>
            <Button variant="outlined" color="error" onClick={() => handleCancelled(params.row.id)}>
              Cancel delivered
            </Button>
          </div> : null}
        </Fragment>
      )
    }
  ];




  if (isFetching) {
    return <Loading />;
  }

  const orderStatusCounts = [
    {
      title: "Delivering Orders",
      count: orders?.data?.filter((order) => order.status === 5).length || 0
    },
    {
      title: "Completed Orders",
      count: orders?.data?.filter((order) => order.status === 2).length || 0
    }
  ];
  const OrderStatusCard = ({ title, count, icon }) => (
    <Box
      sx={{
        width: "150px",
        borderRadius: "5px",
        border: "1px solid #E0E0E0",
        display: "flex",
        flexDirection: "row",
        height: "80px",
        alignItems: "center",
        padding: "10px",
        gap: "10px"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "12px", fontFamily: "Poppins", fontWeight: 500, color: "#9BA4B5" }}>
          {title}
        </div>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "Poppins",
            fontWeight: 700,
            color: title === "Cancelled Orders" ? "red" : "inherit"
          }}
        >
          {count}
        </div>
      </div>
    </Box>
  );
  return (
    <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "20px" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          marginBottom: "20px"
        }}
      >
        {orderStatusCounts.map((status) => (
          <OrderStatusCard key={status.title} {...status} />
        ))}
      </Box>
      {isSuccess && (
        <DataGrid
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
          }}
          rows={orders?.data?.filter((order) => order.status === 5 || order.status === 2)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          pageSizeOptions={[10, 20]}
        />
      )}
    </div>
  );
}
