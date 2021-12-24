import React, { useCallback } from 'react';
import './PopupOrder.css';
import { useDispatch, useSelector } from 'react-redux';
import { popupCalendarDisplayOrder, popupCalendarEditDisplayOrder } from '../../../../constarts/actionOrderСreaters';
import { largeClockSize, mediumClockSize, smallClockSize } from '../../../../constarts/clockSize';
import { deleteOrder } from '../../../../actions/order';

const PopupOrder = ({ currentOrderId }) => {
    const dispatch = useDispatch();

    const orderView = useSelector((state) => (currentOrderId ? state.orderReducer.orders.find((m) => m._id === currentOrderId) : null));

    const deleteClickHandler = useCallback(
        (e) => {
            e.stopPropagation();
            dispatch(deleteOrder(currentOrderId));
            dispatch(popupCalendarDisplayOrder(false));
        },
        [dispatch, currentOrderId],
    );

    const popupOrderDisplay = useSelector((state) => state.orderReducer.popupCalendarDisplay);

    const popupOrderClose = useCallback(() => {
        dispatch(popupCalendarDisplayOrder(false));
    }, [dispatch]);

    const showPopupEditOrderHandler = () => {
        dispatch(popupCalendarDisplayOrder(false));
        dispatch(popupCalendarEditDisplayOrder(true));
    };

    if (!popupOrderDisplay) {
        return null;
    }

    const startTime = new Date(orderView.start_time).toLocaleString();
    const endTime = new Date(orderView.end_time).toLocaleString();
    let clockSize;
    switch (orderView.size) {
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
        <div className="popup popup-order" onClick={popupOrderClose}>
            <div className="popup-content" onClick={(event) => event.stopPropagation()}>
                <div className="popup-header">
                    <div className="popup-title">Order information</div>
                    <button className="popup-close" onClick={() => dispatch(popupCalendarDisplayOrder(false))}>
                        X
                    </button>
                </div>
                <div className="order-info">
                    <div className="order-info-item">
                        <span>Master:</span> {orderView.master.name}
                    </div>
                    <div className="order-info-item">
                        <span>Client:</span> {orderView.client.client_name}
                    </div>
                    <div className="order-info-item">
                        <span>Size:</span> {clockSize}
                    </div>
                    <div className="order-info-item">
                        <span>Start:</span> {startTime}
                    </div>
                    <div className="order-info-item">
                        <span>End:</span> {endTime}
                    </div>
                </div>
                <div className="order-info-btn">
                    <button className="order-btn edit-btn" onClick={showPopupEditOrderHandler}>
                        Edit
                    </button>
                    <button className="order-btn delete-btn" onClick={deleteClickHandler}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupOrder;
