import React from 'react';
import Chip from '@mui/material/Chip';
import { processNumber, processNumberColor } from './Orders';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


export default function PackageStatus({ order }) {
    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
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
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 12px;
        border-radius: 12px 12px 0 12px;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    
        &:hover {
          border-color: ${blue[400]};
        }
    
        &:focus {
          outline: 0;
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
                    <div style={styles.title}>Package Status</div>
                    <Chip style={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                    }} label={processNumber(order.status)} color={processNumberColor(order.status)} />
                </div>
                <div style={styles.content}>
                    <div style={styles.dateWrapper}>
                        <div style={styles.line}></div>
                        <div style={styles.date}>{formatDate(order.createAt)}</div>
                        <div style={styles.line}></div>
                    </div>
                    <div style={styles.label}>
                        <div style={styles.labelText}>Label Ready</div>
                    </div>
                    <div style={styles.details}>
                        <div style={styles.detailsLeft}>
                            <div style={styles.detailsText}>Shipment Generated</div>
                            <div style={styles.detailsAddress}>72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam</div>
                        </div>
                        <div style={styles.detailsRight}>
                            <div style={styles.detailsTime}>{formatTime(order.createAt)}</div>
                        </div>
                    </div>
                </div>
                {(order.status === 5 || order.status === 6) && <div style={styles.content}>
                    <div style={styles.dateWrapper}>
                        <div style={styles.line}></div>
                        {/* <div style={styles.date}>{formatDate(order.createAt)}</div> */}
                        <div style={styles.line}></div>
                    </div>
                    <div style={{ ...styles.label, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div style={styles.labelText}>Confirmed Order</div>
                        {/* <div style={styles.detailsTime}>{formatTime(order.createAt)}</div> */}
                    </div>
                    <div style={styles.details}>
                        <div style={styles.detailsLeft}>
                            {/* <div style={styles.detailsText}>Expected Delivery time</div> */}
                            <div style={styles.detailsAddress}>72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam</div>
                        </div>
                        <div style={styles.detailsRight}>
                            {/* <div style={styles.detailsTime}>{formatTime(dataAfterConfirm?.data?.expected_delivery_time)}</div> */}
                        </div>
                    </div>
                </div>}
                {order.status === 6 && <div style={styles.content}>
                    <div style={styles.dateWrapper}>
                        <div style={styles.line}></div>
                        {/* <div style={styles.date}>{formatDate(order.createAt)}</div> */}
                        <div style={styles.line}></div>
                    </div>
                    <div style={{ ...styles.label, display: 'flex', flexDirection: 'row', gap: '2px', alignItems: 'center' }}>
                        <CheckCircleIcon color='success' fontSize='small' />
                        <div style={{ ...styles.labelText, color: 'green' }}>Delivered</div>
                    </div>
                    <div style={styles.details}>
                        <div style={styles.detailsLeft}>
                            <div style={styles.detailsText}>Delivered at Customer's House</div>
                            <div style={styles.detailsAddress}>{order.recipientAddress}</div>
                        </div>
                        <div style={styles.detailsRight}>
                            {/* <div style={styles.detailsTime}>{formatTime(order.createAt)}</div> */}
                        </div>
                    </div>
                </div>}
            </div>
            {order.status === 3 && <div style={{ ...styles.container, marginTop: '15px' }}>
                <div style={styles.header}>
                    <div style={styles.title}>Cancel Reason</div>
                </div>
                <div style={styles.content}>
                    <Box fullWidth>
                        <Textarea fullW aria-label="empty textarea" disabled defaultValue={order.cancelReason} />
                    </Box>
                </div>
            </div>}
        </div>
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
        flexDirection: 'column',
    },
    dateWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    line: {
        flex: '1',
        borderBottom: '1px solid #DCDFE4',
        margin: '0 10px',
    },
    date: {
        color: '#9BA4B5',
        fontFamily: "Poppins",
        fontWeight: 400,
    },
    label: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#344054',
        marginTop: '10px',
    },
    labelText: {
        fontSize: '14px',
        fontFamily: "Poppins",
        fontWeight: 600,
        color: '#344054',
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    detailsLeft: {
        flex: '1',
    },
    detailsRight: {},
    detailsText: {
        color: '#4C596B',
        fontFamily: "Poppins",
        fontWeight: 500,
    },
    detailsAddress: {
        fontSize: '13px',
        color: '#747D90',
    },
    detailsTime: {
        color: '#9BA4B5',
        fontFamily: "Poppins",
        fontWeight: 400,
    },
};
