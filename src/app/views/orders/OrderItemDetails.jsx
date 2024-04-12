import React from 'react';
import AdjustIcon from '@mui/icons-material/Adjust';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';

// Component definition remains the same

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
    contactSection: {
        display: 'flex',
        flexDirection: 'row',
        padding: '10px',
        alignItems: 'center',
    },
    addressSection: {
        display: 'flex',
        flexDirection: 'row',
        padding: '10px',
        justifyContent: 'space-between',
        gap: '25px'
    },
    contactInfo: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    content: {
        fontSize: '13px',
        color: '#747D90',

    },
    Maxcontent: {
        fontSize: '14px',
        fontFamily: "Poppins",
        fontWeight: 700,
        color: '#4C596B',
    },
    ship: {
        fontSize: '14px',
        fontFamily: "Poppins",
        fontWeight: 700,
    }
};

export default function OrderItemDetails({ order }) {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.title}>Contact Detail</div>
            </div>
            <div style={styles.contactSection}>
                <div style={styles.contactInfo}>
                    <div style={styles.icon}>
                        <AdjustIcon color='info' />
                        <strong style={styles.ship}>Ship from</strong>
                    </div>
                </div>
                <div style={styles.contactInfo}>
                    <div style={styles.icon}>
                        <LocationOnRoundedIcon color='error' />
                        <strong style={styles.ship}>Ship to</strong>
                    </div>
                </div>
            </div>
            <div style={styles.addressSection}>
                <div style={styles.contactInfo}>
                    <div style={styles.Maxcontent}>FTai Fashion Store</div>
                    <div style={styles.content}>72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam</div>
                </div>
                <div style={styles.contactInfo}>
                    <div style={styles.Maxcontent}>FTai Owner</div>
                    <div style={styles.content}>ftaistore@gmail.com</div>
                </div>
                <div style={styles.contactInfo}>
                    <div style={styles.Maxcontent}>Customer's House</div>
                    <div style={styles.content}>{order.recipientAddress}</div>
                </div>
                <div style={styles.contactInfo}>
                    <div style={styles.Maxcontent}>{order.recipientName}</div>
                    <div style={styles.content}>{order.user.email}</div>
                    <div style={styles.content}>{order.recipientPhone}</div>
                </div>
            </div>
        </div>
    );
}
