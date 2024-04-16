import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from 'api/orderApi';
import Loading from 'app/components/MatxLoading';
import { useParams } from 'react-router-dom';
import OrderItemMainSection from './OrderItemMainSection';
import PackageStatus from './PackageStatus';
import PaymentDislay from './PaymentDislay';

export default function OrderDetail() {

    const { orderId } = useParams()
    const {
        data: order,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrderById(orderId),
        enabled: orderId !== null
    });


    return (
        <Box sx={{ flexGrow: 1, padding: '10px' }}>
            {isFetching ? <Loading /> : <Grid container spacing={2}>
                <Grid item xs={4} md={4}>
                    <PackageStatus order={order.data} />
                </Grid>
                <Grid item xs={4} md={6}>
                    <OrderItemMainSection order={order.data} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <PaymentDislay order={order.data} refetch={refetch} />
                </Grid>
            </Grid>}
        </Box>
    )
}
