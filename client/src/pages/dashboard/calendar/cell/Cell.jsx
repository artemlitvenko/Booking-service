import React from 'react';
import './Cell.css';
import { saturday, sunday } from '../../../../constarts/calendarConstant';
import OrderInCell from '../orderInCell/OrderInCell';

const Cell = ({ currentMonth, currentDay, dayNumber, orderMonth, orderInDay, setCurrentOrderId }) => {
    let dayType = 'work-day';
    if (currentDay(dayNumber)) {
        dayType = 'current-day';
    } else if (dayNumber.day() === saturday || dayNumber.day() === sunday) {
        dayType = 'weekend';
    }

    let thisMonth = 'this-month';
    if (!currentMonth(dayNumber)) {
        thisMonth = 'other-month';
    }

    return (
        <div className={dayType}>
            <div className={thisMonth}>{dayNumber.format('D')}</div>
            {orderMonth.map((order) => (
                <OrderInCell key={order._id} order={order} orderInDay={orderInDay} dayNumber={dayNumber} setCurrentOrderId={setCurrentOrderId} />
            ))}
        </div>
    );
};

export default Cell;
