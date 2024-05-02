import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from 'api/orderApi';
import Loading from 'app/components/MatxLoading';
import { dateConvert, transNumberFormatter } from 'app/utils/utils';
import { useNavigate } from 'react-router-dom';
import { processStatusPayment, processStatusPaymentColor } from './PaymentDislay';

export const processNumber = (number) => {
    switch (number) {
        case 1:
            return "Pending";
        case 2:
            return "Completed";
        case 3:
            return "Cancelled";
        case 4:
            return "Waiting For Confirmation";
        case 5:
            return "Delivering";
        case 6:
            return "Delivered";
        case 7:
            return "Confirmed";
        default:
            return "Unknow Status";
    }
}
export const processNumberColor = (number) => {
    switch (number) {
        case 1:
            return "default";
        case 2:
            return "primary";
        case 3:
            return "error";
        case 4:
            return "secondary";
        case 5:
            return "info";
        case 6:
            return "success";
        case 7:
            return "success";
        default:
            return "default";
    }
}
export default function Orders() {
    //https://ftai-api.monoinfinity.net/api/order
    const {
        data: orders,
        isSuccess,
        isFetching
    } = useQuery({
        queryKey: ["orders"],
        queryFn: getAllOrders
    });
    const navigate = useNavigate()

    console.log('orders', orders)

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 70
        },
        {
            field: "recipientName",
            headerName: "Name",
            width: 180,
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
                    <div style={{ margin: "0 auto" }}>
                        {transNumberFormatter(params.row.totalAmount)}đ
                    </div>
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
                    <Chip style={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                    }} label={processNumber(params.row?.status)} color={processNumberColor(params.row?.status)} />
                </div>
            )
        },
        {
            field: "payment",
            headerName: "Payment Status",
            width: 200,
            renderCell: (params) => (
                <div style={{ margin: "0 auto" }}>
                    <Chip label={processStatusPayment(params.row.payment?.status)} color={processStatusPaymentColor(params.row.payment?.status)} style={{
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                    }} />
                </div>
            )
        },
        {
            field: "createAt",
            headerName: "Order Created Date",
            headerAlign: "center",
            width: 200,
            renderCell: (params) => (
                <div style={{ margin: "0 auto", textAlign: 'center' }}>
                    {dateConvert(params.row.createAt)}
                </div>
            )
        },
        {
            field: "options",
            headerName: "Options",
            headerAlign: "center",
            width: 200,
            renderCell: (params) => (
                <div style={{ margin: "0 auto", textAlign: 'center' }}>
                    <Button variant="outlined" onClick={() => navigate(`/shop/orders/${params.row.id}`)}>View detail order</Button>
                </div>
            )
        }
    ]

    if (isFetching) {
        return <Loading />
    }


    const orderStatusCounts = [
        { title: 'All Orders', count: orders?.data?.length || 0 },
        { title: 'Waiting Orders', count: orders?.data?.filter((order) => order.status === 4).length || 0 },
        { title: 'Delivering Orders', count: orders?.data?.filter((order) => order.status === 5).length || 0 },
        { title: 'Delivered Orders', count: orders?.data?.filter((order) => order.status === 6).length || 0 },
        { title: 'Cancelled Orders', count: orders?.data?.filter((order) => order.status === 3).length || 0 },
    ];
    const OrderStatusCard = ({ title, count, icon }) => (
        <Box
            sx={{
                width: '150px',
                borderRadius: '5px',
                border: '1px solid #E0E0E0',
                display: 'flex',
                flexDirection: 'row',
                height: '80px',
                alignItems: 'center',
                padding: '10px',
                gap: '10px',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px', fontFamily: 'Poppins', fontWeight: 500, color: '#9BA4B5' }}>{title}</div>
                <div style={{ fontSize: '20px', fontFamily: 'Poppins', fontWeight: 700, color: title === 'Cancelled Orders' ? 'red' : 'inherit' }}>{count}</div>
            </div>
        </Box>
    );
    return (
        <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "20px" }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
                {orderStatusCounts.map((status) => (
                    <OrderStatusCard key={status.title} {...status} />
                ))}
            </Box>
            {isSuccess && <DataGrid
                sx={{
                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                        outline: "none !important",
                    },
                }}
                rows={orders?.data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 }
                    }
                }}
                pageSizeOptions={[10, 20]}
            />}

        </div>
    )
}
