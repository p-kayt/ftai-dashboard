import { transNumberFormatter } from 'app/utils/utils';
import React from 'react';

// Define styles outside of the component
const styles = {
    container: {
        borderRadius: '5px',
        backgroundColor: 'white',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '15px',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '10px',
        alignItems: 'center',
    },
    headerText: {
        fontSize: '18px',
        fontFamily: 'Poppins',
        fontWeight: 700,
    },
    productContainer: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productImageContainer: {
        width: '50px',
        height: '50px',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    productDetails: {
        display: 'flex',
        flexDirection: 'row',
        gap: '15px',
    },
    productName: {
        fontSize: '15px',
        color: '#4C596B',
        fontWeight: 'bold',
    },
    productInfo: {
        display: 'flex',
        flexDirection: 'row',
    },
    productSizeColor: {
        fontSize: '13px',
        color: '#4C596B',
        fontWeight: 'inherit',
        marginRight: '10px',
    },
    colorIndicator: {
        height: '20px',
        width: '20px',
        borderRadius: '50px',
    },
    productPriceQuantity: {
        display: 'flex',
        flexDirection: 'column',

    },
    productPrice: {
        color: '#4C596B',
        fontSize: '15px',
        fontFamily: 'Poppins',
        fontWeight: 600,
    },
    productQuantity: {
        color: '#4C596B',
        fontFamily: 'Poppins',
        fontWeight: 400,
        fontSize: '12px',
    }
};

export default function OrderItemRender({ order }) {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerText}>
                    Products Ordered
                </div>
            </div>

            {order.orderItems.map((data) => (
                <div key={data.product.id} style={styles.productContainer}>
                    <div style={styles.productDetails}>
                        <div style={styles.productImageContainer}>
                            <img style={styles.productImage} src={data.product.defaultImage} alt='Product' />
                        </div>
                        <div>
                            <div style={styles.productName}>{data.product.name}</div>
                            <div style={styles.productInfo}>
                                <div style={styles.productSizeColor}>Size: {data.size}</div>
                                <div style={{ ...styles.colorIndicator, backgroundColor: `${data.color}` }}></div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.productPriceQuantity}>
                        <div style={styles.productPrice}>{transNumberFormatter(data.price)} VNĐ</div>
                        <div style={styles.productQuantity}>Qty: {data.quantity}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
