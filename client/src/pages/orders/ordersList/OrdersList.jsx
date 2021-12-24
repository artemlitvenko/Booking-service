import React, { useEffect, useState } from 'react';
import './OrdersList.css';
import Orders from '../orders/Orders';
import { getOrder } from '../../../actions/order';
import { useDispatch } from 'react-redux';

const OrdersList = () => {
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOrder());
    }, [dispatch]);

    return (
        <div className="item-list">
            <div className="item-list-title">
                <h1>OrderList</h1>
            </div>
            <Orders currentOrderId={currentOrderId} setCurrentOrderId={setCurrentOrderId} />
        </div>
    );
};

export default OrdersList;
