import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Calendar.css';
import moment from 'moment';
import CalendarHeader from '../calendarHeader/CalendarHeader';
import CalendarBody from '../calendarBody/CalendarBody';
import { useDispatch } from 'react-redux';
import { getOrder } from '../../../../actions/order';

const Calendar = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOrder());
    }, [dispatch]);

    useEffect(() => {
        moment.updateLocale('en', { week: { dow: 1 } });
    }, [moment.updateLocale('en', { week: { dow: 1 } })]);

    const [today, setToday] = useState(moment());

    const startDay = useMemo(() => {
        return today.clone().startOf('month').startOf('week');
    }, [today]);

    const todayHandler = useCallback(() => {
        setToday(moment());
    }, [setToday]);

    const nextHandler = useCallback(() => {
        setToday((next) => next.clone().add(1, 'month'));
    }, [setToday]);

    const prevHandler = useCallback(() => {
        setToday((prev) => prev.clone().subtract(1, 'month'));
    }, [setToday]);

    return (
        <div className="calendar">
            <div className="calendar-container">
                <CalendarHeader today={today} prevHandler={prevHandler} todayHandler={todayHandler} nextHandler={nextHandler} />
                <CalendarBody startDay={startDay} today={today} />
            </div>
        </div>
    );
};

export default Calendar;
