import React, { useCallback, useMemo } from 'react';
import './PopupAdd.css';
import { useDispatch, useSelector } from 'react-redux';
import { createCity } from '../../../actions/city';
import { setPopupAddDisplay } from '../../../constarts/actionCityСreaters';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { longValue, requiredField } from '../../../constarts/validationMessage';
import { maxLength } from '../../../constarts/validationValue';

const PopupAdd = () => {
    const dispatch = useDispatch();
    const popupDisplay = useSelector((state) => state.cityReducer.popupAddDisplay);

    const initialValues = useMemo(
        () => ({
            cityName: '',
        }),
        [],
    );

    const validationSchema = useMemo(
        () =>
            Yup.object({
                cityName: Yup.string().required(requiredField).max(maxLength, longValue),
            }),
        [],
    );
    const onSubmit = useCallback(
        (values) => {
            dispatch(createCity(values.cityName));
            dispatch(setPopupAddDisplay(false));
        },
        [dispatch],
    );

    if (!popupDisplay) {
        return null;
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <div className="popup popup-add" onClick={() => dispatch(setPopupAddDisplay(false))}>
                    <div className="popup-content" onClick={(event) => event.stopPropagation()}>
                        <div className="popup-header">
                            <div className="popup-title">Add new city</div>
                            <button className="popup-close" onClick={() => dispatch(setPopupAddDisplay(false))}>
                                X
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {errors.cityName && touched.cityName && <span className="validation-text">{errors.cityName}</span>}
                            <input
                                value={values.cityName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="cityName"
                                className="input-text"
                                type="text"
                                placeholder="New city name"
                                maxLength="30"
                            />
                            <button className="popup-send" type="submit">
                                add city
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default PopupAdd;
