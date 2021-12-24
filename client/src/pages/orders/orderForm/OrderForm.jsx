import React, { useCallback, useEffect, useState } from 'react';
import './OrderForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCity } from '../../../actions/city';
import { createOrder, getMastersForOrder } from '../../../actions/order';
import OrderMaster from '../orderMaster/OrderMaster';
import PopupCreate from '../popupCreate/PopupCreate';
import { setMastersLoaded, setPopupCreateDisplayOrder } from '../../../constarts/actionOrderСreaters';
import { largeClockSize, mediumClockSize, smallClockSize } from '../../../constarts/clockSize';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { longEmail, longValue, needEmail, requiredField, shortValue } from '../../../constarts/validationMessage';
import { maxEmailLength, maxLength, minLength } from '../../../constarts/validationValue';

const OrderForm = () => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            clientName: '',
            clientEmail: '',
            orderSize: '',
            orderCity: '',
            orderDate: '',
            endDate: '',
        },
        validationSchema: Yup.object({
            clientName: Yup.string().required(requiredField).min(minLength, shortValue).max(maxLength, longValue),
            clientEmail: Yup.string().required(requiredField).email(needEmail).max(maxEmailLength, longEmail),
            orderSize: Yup.string().required(requiredField),
            orderCity: Yup.string().required(requiredField),
        }),
        onSubmit: (values) => {
            dispatch(getMastersForOrder(values.orderCity, orderDate, endDate));
            //console.log('Order Form >>> values.orderCity, orderDate, endDate', values.orderCity, orderDate, endDate);
            dispatch(setMastersLoaded(false));
        },
    });

    useEffect(() => {
        dispatch(getCity());
    }, [dispatch]);

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');

    const [orderDate, setOrderDate] = useState(new Date());

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
    };

    const [orderSize, setOrderSize] = useState({ size: '' });
    const [orderCity, setOrderCity] = useState({
        city: { city_name: '', _id: '' },
    });
    const orderObj = useSelector((state) => state.cityReducer.cities).map((city) => ({
        city_name: city.city_name,
        _id: city._id,
    }));
    const citySelect = orderObj.map((city) => (
        <option key={city._id} value={city._id}>
            {city.city_name}
        </option>
    ));

    let startDate = orderDate;
    let endDate = +startDate + Number(formik.values.orderSize);

    const createOrderHandler = useCallback(
        (currentMasterId) => {
            dispatch(
                createOrder(
                    formik.values.clientName,
                    formik.values.clientEmail,
                    currentMasterId,
                    formik.values.orderCity,
                    Number(formik.values.orderSize),
                    orderDate,
                    new Date(endDate),
                ),
            );
            dispatch(setPopupCreateDisplayOrder(true));
        },
        [dispatch, clientName, clientEmail, orderCity, Number(orderSize), startDate, endDate],
    );

    const { loaded: loadedMasters, masters } = useSelector((state) => state.orderFormReducer);
    const mastersResultList = masters.map((master) => <OrderMaster key={master._id} createOrderHandler={createOrderHandler} master={master} />);

    const mastersResult = () => {
        if (loadedMasters && mastersResultList.length === 0) {
            return <div className="find-master-result">Masters not found. Try searching using different settings</div>;
        } else {
            return <div className="find-master-result">{mastersResultList}</div>;
        }
    };

    return (
        <div className="order-form-container">
            <div className="order-form">
                <div className="title">
                    <h1>Fill out the form and select the right master for you</h1>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="label-form">
                        <label htmlFor="client-name">Your name</label>
                        {formik.errors.clientName && formik.touched.clientName && <span className="validation-text">{formik.errors.clientName}</span>}
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
                        <label htmlFor="size-select">Size</label>
                        {formik.errors.orderSize && formik.touched.orderSize && <span className="validation-text">{formik.errors.orderSize}</span>}
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
                            <label htmlFor="city-select">City</label>
                            {formik.errors.orderCity && formik.touched.orderCity && (
                                <span className="validation-text">{formik.errors.orderCity}</span>
                            )}
                        </div>
                        <select
                            name="orderCity"
                            id="city-select"
                            value={formik.values.orderCity._id}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Choose city of master</option>
                            {citySelect}
                        </select>
                    </div>
                    <div className="subtitle-form">Choose a time that is convenient for you</div>
                    <div className="datetime-picker">
                        <DatePicker
                            selected={orderDate}
                            value={orderDate}
                            onChange={(date) => setOrderDate(date)}
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
                    <button type="submit">Find master</button>
                </form>
                {mastersResult()}
                <PopupCreate />
            </div>
        </div>
    );
};

export default OrderForm;
