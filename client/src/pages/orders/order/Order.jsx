import React, { useCallback } from 'react';
import './Order.css';
import { useDispatch } from 'react-redux';
import { deleteOrder } from '../../../actions/order';
import { largeClockSize, mediumClockSize, smallClockSize } from '../../../constarts/clockSize';

const Order = ({ order }) => {
    const dispatch = useDispatch();
    const deleteClickHandler = useCallback(
        (e) => {
            e.stopPropagation();
            dispatch(deleteOrder(order._id));
        },
        [dispatch, order._id],
    );

    const startTime = new Date(order.start_time).toLocaleString();
    const endTime = new Date(order.end_time).toLocaleString();
    let clockSize;
    switch (order.size) {
        case smallClockSize:
            clockSize = 'small';
            break;
        case mediumClockSize:
            clockSize = 'medium';
            break;
        case largeClockSize:
            clockSize = 'large';
            break;
        default:
            clockSize = 'custom';
    }

    return (
        <div className="list-item">
            <div className="list-order-content">
                <div className="list-order-item-master">
                    <span>Master:</span> {order.master.name}
                </div>
                <div className="list-order-item-master">
                    <span>Client:</span> {order.client.client_name}
                </div>
                <div className="list-order-item-size">
                    <span>Size:</span> {clockSize}
                </div>
                <div className="list-order-item-time">
                    <span>Start:</span> {startTime}
                </div>
                <div className="list-order-item-time">
                    <span>End:</span> {endTime}
                </div>
                <div className="btn-item">
                    <button className="delete-btn" onClick={deleteClickHandler}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Order;
