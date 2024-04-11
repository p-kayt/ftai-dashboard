import React from 'react'
import OrderItemDetails from './OrderItemDetails'
import OrderItemRender from './OrderItemRender'

export default function OrderItemMainSection({ order }) {
    return (
        <div>
            <OrderItemDetails order={order} />
            <OrderItemRender order={order} />
        </div>
    )
}
