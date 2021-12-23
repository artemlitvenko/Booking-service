import React, { useCallback, useMemo, useState } from 'react';
import './CalendarBody.css';
import moment from 'moment';
import { daysOfGrid, nameDay } from '../../../../constarts/calendarConstant';
import Cell from '../cell/Cell';
import { useSelector } from 'react-redux';
import PopupOrder from '../popupOrder/PopupOrder';
import PopupEditOrder from '../popupEditOrder/PopupEditOrder';
import PopupAfterEdit from '../popupAfterEdit/PopupAfterEdit';

const CalendarBody = ({ startDay, today }) => {
    const [currentOrderId, setCurrentOrderId] = useState(null);

    const totalDays = daysOfGrid;

    const day = useMemo(() => {
        return startDay.clone().subtract(1, 'day');
    }, [startDay.clone().subtract(1, 'day')]);

    const currentDay = useCallback(
        (day) => {
            return moment().isSame(day, 'day');
        },
        [day],
    );

    const currentMonth = useCallback(
        (day) => {
            return today.isSame(day, 'month');
        },
        [today],
    );

    const daysArray = useMemo(() => {
        return [...Array(totalDays)].map(() => day.add(1, 'day').clone());
    }, [day, totalDays]);

    const dayName = useMemo(() => {
        return nameDay.map((day) => (
            <div key={day} className="day">
                {day}
            </div>
        ));
    }, [nameDay]);

    const orderMonth = useSelector((state) => state.orderReducer.orders);

    const orderInDay = useCallback((dayNumber, orderTime) => {
        return dayNumber.isSame(orderTime, 'day');
    }, []);

    const calendarView = daysArray.map((dayNumber) => (
        <Cell
            key={dayNumber.unix()}
            orderInDay={orderInDay}
            orderMonth={orderMonth}
            currentMonth={currentMonth}
            currentDay={currentDay}
            dayNumber={dayNumber}
            setCurrentOrderId={setCurrentOrderId}
        />
    ));

    return (
        <div className="calendar-body">
            <div className="day-name">{dayName}</div>
            <div className="grid-wrapper">{calendarView}</div>
            <PopupOrder currentOrderId={currentOrderId} />
            <PopupEditOrder currentOrderId={currentOrderId} />
            <PopupAfterEdit />
        </div>
    );
};

export default CalendarBody;
