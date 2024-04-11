import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from 'api/orderApi';
import { useParams } from 'react-router-dom';
import OrderItemMainSection from './OrderItemMainSection';
import PackageStatus from './PackageStatus';
import PaymentDislay from './PaymentDislay';

export default function OrderDetail() {

    const { orderId } = useParams()
    const {
        data: order,
    } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrderById(orderId)
    });


    return (
        <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <Grid container spacing={2}>
                <Grid item xs={4} md={4}>
                    <PackageStatus order={order?.data} />
                </Grid>
                <Grid item xs={4} md={6}>
                    <OrderItemMainSection order={order?.data} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <PaymentDislay order={order?.data} />
                </Grid>
            </Grid>
        </Box>
    )
}
