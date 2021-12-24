import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './PopupEditOrder.css';
import '../../../orders/orderForm/OrderForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { popupAfterEditDisplayOrder, popupCalendarEditDisplayOrder, setMastersLoaded } from '../../../../constarts/actionOrderСreaters';
import { longEmail, longValue, needEmail, requiredField, shortValue } from '../../../../constarts/validationMessage';
import { getCity } from '../../../../actions/city';
import { largeClockSize, mediumClockSize, smallClockSize } from '../../../../constarts/clockSize';
import { getMastersForOrder, updateOrder } from '../../../../actions/order';
import OrderEditMaster from '../../../orders/orderEditMaster/OrderEditMaster';
import { maxEmailLength, maxLength, minLength } from '../../../../constarts/validationValue';

const PopupEditOrder = ({ currentOrderId }) => {
    const dispatch = useDispatch();

    const [startOrder, setStartOrder] = useState(new Date());

    const { loaded: loadedMasters, masters } = useSelector((state) => state.orderFormReducer);
    const orderObj = useSelector((state) => state.cityReducer.cities).map((city) => ({
        city_name: city.city_name,
        _id: city._id,
    }));
    const popupOrderEditDisplay = useSelector((state) => state.orderReducer.popupCalendarEditDisplay);
    const orderEdit = useSelector((state) => (currentOrderId ? state.orderReducer.orders.find((m) => m._id === currentOrderId) : null));

    const defaultData = {
        clientName: '',
        clientEmail: '',
        orderSize: '',
        orderCity: '',
        orderDate: '',
    };

    const orderEditData = {
        clientName: orderEdit?.client.client_name,
        clientEmail: orderEdit?.client.client_email,
        orderSize: orderEdit?.size,
        orderCity: orderEdit?.city,
        orderDate: new Date(orderEdit?.start_time),
    };

    const initialData = orderEdit ? orderEditData : defaultData;

    const formik = useFormik({
        initialValues: initialData,
        enableReinitialize: true,
        validationSchema: Yup.object({
            clientName: Yup.string().required(requiredField).min(minLength, shortValue).max(maxLength, longValue),
            clientEmail: Yup.string().required(requiredField).email(needEmail).max(maxEmailLength, longEmail),
            orderSize: Yup.string().required(requiredField),
            orderCity: Yup.string().required(requiredField),
        }),
        onSubmit: (values) => {
            dispatch(getMastersForOrder(values.orderCity, startOrder, endDate));
            dispatch(setMastersLoaded(false));
        },
    });

    let endDate = +startOrder + Number(formik.values.orderSize);

    useEffect(() => {
        dispatch(getCity());
    }, [dispatch]);

    const citySelect = orderObj.map((city) => (
        <option key={city._id} value={city._id}>
            {city.city_name}
        </option>
    ));

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
    };

    const editOrderHandler = useCallback(
        (currentMasterId) => {
            const body = {
                master: currentMasterId,
                client_name: formik.values.clientName,
                client_email: formik.values.clientEmail,
                city: formik.values.orderCity,
                size: Number(formik.values.orderSize),
                start_time: startOrder,
                end_time: new Date(endDate),
            };
            dispatch(updateOrder(currentOrderId, body));
            dispatch(popupAfterEditDisplayOrder(true));
        },
        [
            dispatch,
            formik.values.clientName,
            formik.values.clientEmail,
            formik.values.orderCity,
            formik.values.orderSize,
            startOrder,
            endDate,
            currentOrderId,
        ],
    );

    const mastersResultList = masters.map((master) => <OrderEditMaster editOrderHandler={editOrderHandler} key={master._id} master={master} />);

    const mastersResult = () => {
        if (loadedMasters && mastersResultList.length === 0) {
            return <div className="find-master-result">Masters not found. Try searching using different settings</div>;
        } else {
            return <div className="find-master-result">{mastersResultList}</div>;
        }
    };

    const popupOrderEditClose = useCallback(() => {
        dispatch(popupCalendarEditDisplayOrder(false));
    }, [dispatch]);

    if (!popupOrderEditDisplay) {
        return null;
    }

    return (
        <div className="popup popup-edit-order" onClick={popupOrderEditClose}>
            <div className="popup-content" onClick={(event) => event.stopPropagation()}>
                <div className="popup-header">
                    <div className="popup-title">Edit Order</div>
                    <button className="popup-close" onClick={() => dispatch(popupCalendarEditDisplayOrder(false))}>
                        X
                    </button>
                </div>
                <div className="order-edit-form">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="label-form">
                            <label htmlFor="client-name">Your name</label>
                            {formik.errors.clientName && formik.touched.clientName && (
                                <span className="validation-text">{formik.errors.clientName}</span>
                            )}
                        </div>
                        <input
                            value={formik.values.clientName}
                            onChange={formik.handleChange}
                            id="client-name"
                            onBlur={formik.handleBlur}
                            name="clientName"
                            className="input-text"
                            type="text"
                            placeholder="Your name"
                            maxLength="30"
                        />
                        <div className="label-form">
                            <label htmlFor="client-email">Your email</label>
                            {formik.errors.clientEmail && formik.touched.clientEmail && (
                                <span className="validation-text">{formik.errors.clientEmail}</span>
                            )}
                        </div>
                        <input
                            value={formik.values.clientEmail}
                            id="client-email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="clientEmail"
                            className="input-text"
                            type="text"
                            placeholder="Your email"
                            maxLength="60"
                        />
                        <div className="label-form">
                            <label htmlFor="size-select">Choose size of watch</label>
                            {formik.errors.orderSize && formik.touched.orderSize && (
                                <span className="validation-text">{formik.errors.orderSize}</span>
                            )}
                        </div>
                        <select
                            name="orderSize"
                            id="size-select"
                            value={formik.values.orderSize}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Choose size of watch</option>
                            <option value={smallClockSize}>small</option>
                            <option value={mediumClockSize}>medium</option>
                            <option value={largeClockSize}>large</option>
                        </select>
                        <div className="city">
                            <div className="label-form">
                                <label htmlFor="city-select">Select your city</label>
                                {formik.errors.orderCity && formik.touched.orderCity && (
                                    <span className="validation-text">{formik.errors.orderCity}</span>
                                )}
                            </div>
                            <select
                                name="orderCity"
                                id="city-select"
                                value={formik.values.orderCity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {citySelect}
                            </select>
                        </div>
                        <div className="subtitle-form">Choose a time that is convenient for you</div>
                        <div className="datetime-picker">
                            <DatePicker
                                selected={startOrder}
                                value={startOrder}
                                onChange={(date) => setStartOrder(date)}
                                onBlur={formik.handleBlur}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={60}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h aa"
                                minDate={new Date()}
                                filterTime={filterPassedTime}
                                name="orderDate"
                            />
                        </div>
                        <div className="master-name">
                            Current master: <b>{orderEdit.master.name}</b>
                        </div>
                        <button type="submit">Сheck the availability of the masters</button>
                    </form>
                    {mastersResult()}
                </div>
            </div>
        </div>
    );
};

export default PopupEditOrder;
