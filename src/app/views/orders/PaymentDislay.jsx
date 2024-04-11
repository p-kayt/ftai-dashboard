import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import { transNumberFormatter } from 'app/utils/utils';
import moment from 'moment';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
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

export default function PaymentDislay({ order }) {
    const baseCharge = order?.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log('order', order)
    const formatDate = (date) => moment(date).format("DD-MM-YYYY");



    const discountAmount = () => {
        const discount = order?.promotion?.percent ? (baseCharge * order?.promotion?.percent) / 100 : 0;
        if (discount > order?.promotion?.maxValue) {
            return order?.promotion?.maxValue
        } else {
            return discount
        }
    }


    const [status, setStatus] = useState('');

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const blue = {
        100: '#DAECFF',
        200: '#b6daff',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        900: '#003A75',
    };

    const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
    };

    const Textarea = styled(BaseTextareaAutosize)(
        ({ theme }) => `
          box-sizing: border-box;
          width: 100%;
          font-family: 'Roboto', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5;
          padding: 8px 12px;
          border-radius: 8px;
          color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
          background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
          border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
          box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
      
          &:hover {
            border-color: ${blue[400]};
          }
      
          &:focus {
            border-color: ${blue[400]};
            box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
          }
      
          // firefox
          &:focus-visible {
            outline: 0;
          }
        `,
    );
    return (
        <div>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.title}>Payment</div>
                    <Chip label={processStatusPayment(order?.payment?.status)} color={processStatusPaymentColor(order?.payment.status)} style={{
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                    }} />
                </div>
                <div style={styles.content}>
                    <div style={styles.chargeRow}>
                        <div style={styles.chargeLabel}>Payment method</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {order?.payment?.paymentMethod?.name === 'Zalopay' && <img src='/assets/images/logos/7044033_zalo_icon.png' alt='temporary' />}
                            <div style={styles.chargeAmount}>{order?.payment?.paymentMethod?.name}</div>
                        </div>
                    </div>
                    <div style={styles.chargeRow}>
                        <div style={styles.chargeLabel}>Transaction id</div>
                        <div style={styles.date}>{order?.payment?.transactionId}</div>
                    </div>
                    <div style={styles.chargeRow}>
                        <div style={styles.chargeLabel}>Transaction date</div>
                        <div style={styles.date}>{formatDate(order?.payment?.transactionDate)}</div>
                    </div>
                    <div style={styles.textCharge}>Charge</div>
                    <div style={styles.charges}>
                        <div style={styles.chargeRow}>
                            <div style={styles.chargeLabel}>Base charge</div>
                            <div style={styles.chargeAmount}>{transNumberFormatter(baseCharge)} VNĐ</div>
                        </div>
                        <div style={styles.chargeRow}>
                            <div style={styles.chargeLabel}>Shipping charge</div>
                            <div style={styles.chargeAmount}>{transNumberFormatter(order?.shippingFee)} VNĐ</div>
                        </div>

                        {/* check co discount moi render */}
                        {order?.promotion !== null && <div style={styles.chargeRow}>
                            <div style={styles.chargeLabel}>{`Voucher (${order?.promotion?.percent}%)`}</div>
                            <div style={{ ...styles.chargeAmount, textDecorationLine: 'line-through' }}> {transNumberFormatter(discountAmount())} VNĐ</div>
                        </div>}
                        {/*  */}

                        <div style={styles.chargeRow}>
                            <div style={styles.totalLabel}>Total charge</div>
                            <div style={styles.totalAmount}>{transNumberFormatter(order?.totalAmount)} VNĐ</div>
                        </div>
                    </div>
                </div>
            </div>
            {order?.status === 4 && <div style={{ ...styles.container, marginTop: '15px' }}>
                <div style={styles.header}>
                    <div style={styles.title}>Order Control</div>

                </div>
                <div style={styles.content}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Order Status Update</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            label="Order Status Update"
                            onChange={handleChange}
                        >
                            <MenuItem value={7}>Accept Order</MenuItem>
                            <MenuItem value={3}>Cancel Order</MenuItem>
                        </Select>
                    </FormControl>
                    {status === 3 && <Box fullWidth>
                        <div style={styles.labelText}>Cancel Reason</div>
                        <Textarea
                            maxRows={6}
                            minRows={4}
                            aria-label="maximum height"
                            placeholder="Stock runs out..."
                        />
                    </Box>}
                    <Button disabled={!status} variant="contained">Confirm</Button>
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
