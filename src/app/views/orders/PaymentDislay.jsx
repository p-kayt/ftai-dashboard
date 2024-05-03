import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptOrderbyIdnStatus, cancelOrderbyIdnStatus } from 'api/orderApi';
import { transNumberFormatter } from 'app/utils/utils';
import moment from 'moment';
import { useState } from 'react';
import Swal from "sweetalert2";

export const processStatusPayment = (number) => {
    switch (number) {
        case 1:
            return "Paying...";
        case 2:
            return "Paid";
        case 3:
            return "Unpaid";
        case 4:
            return "Refunded";
        default:
            return "Unknow Status";
    }
}

export const processStatusPaymentColor = (number) => {
    switch (number) {
        case 1:
            return "default";
        case 2:
            return "success";
        case 3:
            return "error";
        case 4:
            return "secondary";
        default:
            return "default";
    }
}

export default function PaymentDislay({ order, refetch }) {
    const baseCharge = order.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const formatDate = (date) => moment(date).format("DD-MM-YYYY");
    const queryClient = useQueryClient()
    const acceptOrder = useMutation({
        mutationKey: ["acceptorder"],
        mutationFn: (data) => acceptOrderbyIdnStatus(data),
        onSuccess: (res) => {
            refetch()
            queryClient.invalidateQueries(['acceptorder'])
            setLoading(false)
        },
        onError: (error) => {
            console.log(error.response.data.message)
            Swal.fire("Error!",error.response.data.message, "error");
            setLoading(false)
        }
    });
    const rejectOrder = useMutation({
        mutationKey: ["cancelorder"],
        mutationFn: (data) => cancelOrderbyIdnStatus(data),
        onSuccess: () => {
            refetch()
            queryClient.invalidateQueries(['cancelorder'])
            setLoading2(false)

        },
        onError: (error) => {
            console.log(error)
            setLoading2(false)
        }
    });

    const discountAmount = () => {
        const discount = order.promotion.percent ? (baseCharge * order.promotion.percent) / 100 : 0;
        if (discount > order.promotion.maxValue) {
            return order.promotion.maxValue
        } else {
            return discount
        }
    }


    const handleCancelOrder = async (status) => {
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
                    setLoading2(true)
                    const data = {
                        orderId: order.id,
                        status: status,
                        cancelReason: text
                    }
                    rejectOrder.mutate(data);
                }
            })
        }
    }


    const handleConfirmOrder = (status) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You are about to accept this order",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, accept it!"
        }).then((result) => {
            setLoading(true)
            if (result.isConfirmed) {
                const data = {
                    orderId: order.id,
                    status: status
                }
                acceptOrder.mutate(data);
            }
        });
    }

    return (
        <div>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.title}>Payment</div>
                    <Chip label={processStatusPayment(order.payment.status)} color={processStatusPaymentColor(order.payment.status)} style={{
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                    }} />
                </div>
                <div style={styles.content}>
                    <div style={styles.chargeRow}>
                        <div style={styles.chargeLabel}>Payment method</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {order.payment.paymentMethod.name === 'Zalopay' && <img src='/assets/images/logos/7044033_zalo_icon.png' alt='temporary' />}
                            <div style={styles.chargeAmount}>{order.payment.paymentMethod.name}</div>
                        </div>
                    </div>
                    {order.payment.paymentMethod.name === 'Zalopay' && <>
                        <div style={styles.chargeRow}>
                            <div style={styles.chargeLabel}>Transaction id</div>
                            <div style={styles.date}>{order.payment.transactionId}</div>
                        </div>
                        <div style={styles.chargeRow}>
                            <div style={styles.chargeLabel}>Transaction date</div>
                            <div style={styles.date}>{formatDate(order.payment.transactionDate)}</div>
                        </div>
                    </>}
                    <div style={styles.textCharge}>Charge</div>
                    <div style={styles.charges}>
                        <div style={styles.chargeRow}>
                            <div style={styles.chargeLabel}>Base charge</div>
                            <div style={styles.chargeAmount}>{transNumberFormatter(baseCharge)} VNĐ</div>
                        </div>
                        <div style={styles.chargeRow}>
                            <div style={styles.chargeLabel}>Shipping charge</div>
                            <div style={styles.chargeAmount}>{transNumberFormatter(order.shippingFee)} VNĐ</div>
                        </div>

                        {/* check co discount moi render */}
                        {order.promotion !== null && <div style={styles.chargeRow}>
                            <div style={styles.chargeLabel}>{`Voucher (${order.promotion.percent}%)`}</div>
                            <div style={{ ...styles.chargeAmount, textDecorationLine: 'line-through' }}> {transNumberFormatter(discountAmount())} VNĐ</div>
                        </div>}
                        {/*  */}

                        <div style={styles.chargeRow}>
                            <div style={styles.totalLabel}>Total charge</div>
                            <div style={styles.totalAmount}>{transNumberFormatter(order.totalAmount)} VNĐ</div>
                        </div>
                    </div>
                </div>
            </div>
            {order.status === 4 && <div style={{ ...styles.container, marginTop: '15px' }}>
                <div style={styles.header}>
                    <div style={styles.title}>Order Control</div>

                </div>
                <div style={styles.content}>
                    <LoadingButton disabled={loading2} loading={loading} color='primary' variant="contained" onClick={() => handleConfirmOrder(7)} >Confirm Order</LoadingButton>
                    <LoadingButton disabled={loading} loading={loading2} color='error' onClick={() => handleCancelOrder(3)} >Cancel Order</LoadingButton>
                </div>
            </div>}
        </div >
    );
}

const styles = {
    container: {
        borderRadius: '5px',
        backgroundColor: 'white',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '10px',
        alignItems: 'center',
    },
    title: {
        fontSize: '18px',
        fontFamily: "Poppins",
        fontWeight: 700,
    },
    content: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    date: {
        color: '#9BA4B5',
        fontFamily: 'Poppins',
        fontWeight: 400,
    },
    charges: {
        display: 'flex',
        flexDirection: 'column',
    },
    chargeRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chargeLabel: {
        color: '#4C596B',
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 500,
    },
    chargeAmount: {
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 600,
        color: '#4C596B',
    },
    totalLabel: {
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 600,
        marginTop: '10px',
    },
    totalAmount: {
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 600,
        marginTop: '10px',

    },
    textCharge: {
        marginTop: '50px',
        fontSize: '15px',
        fontFamily: 'Poppins',
        fontWeight: 600,
    },
    labelText: {
        fontSize: '14px',
        fontFamily: "Poppins",
        fontWeight: 600,
        color: '#344054',
    },
};
