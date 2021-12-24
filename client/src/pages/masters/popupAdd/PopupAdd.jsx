import React, { useCallback, useEffect, useMemo } from 'react';
import './PopupAdd.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPopupAddDisplayMaster } from '../../../constarts/actionMasterСreaters';
import { createMaster } from '../../../actions/master';
import { getCity } from '../../../actions/city';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { longValue, requiredField, shortValue } from '../../../constarts/validationMessage';
import { ratings } from '../../../constarts/ratings';
import { maxLength, minLength } from '../../../constarts/validationValue';

const PopupAdd = () => {
    const dispatch = useDispatch();

    const popupDisplay = useSelector((state) => state.masterReducer.popupAddDisplay);
    const cityObj = useSelector((state) => state.cityReducer.cities).map((city) => ({
        city_name: city.city_name,
        _id: city._id,
    }));
    const citySelect = cityObj.map((city) => <option value={city._id}>{city.city_name}</option>);

    const ratingsSelect = ratings.map((rating) => <option value={rating}>{rating}</option>);

    useEffect(() => {
        dispatch(getCity());
    }, [dispatch]);

    const initialValues = useMemo(
        () => ({
            masterName: '',
            masterRating: '',
            masterCity: '',
        }),
        [],
    );

    const validationSchema = useMemo(
        () =>
            Yup.object({
                masterName: Yup.string().required(requiredField).min(minLength, shortValue).max(maxLength, longValue),
                masterRating: Yup.string().required(requiredField),
                masterCity: Yup.string().required(requiredField),
            }),
        [],
    );
    const onSubmit = useCallback(
        (values) => {
            dispatch(createMaster(values.masterName, Number(values.masterRating), values.masterCity));
            dispatch(setPopupAddDisplayMaster(false));
        },
        [dispatch],
    );

    if (!popupDisplay) {
        return null;
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <div className="popup popup-add" onClick={() => dispatch(setPopupAddDisplayMaster(false))}>
                    <div className="popup-content" onClick={(event) => event.stopPropagation()}>
                        <div className="popup-header">
                            <div className="popup-title">Add new city</div>
                            <button className="popup-close" onClick={() => dispatch(setPopupAddDisplayMaster(false))}>
                                X
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {errors.masterName && touched.masterName && <span className="validation-text">{errors.masterName}</span>}
                            <input
                                value={values.masterName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="masterName"
                                className="input-text"
                                type="text"
                                placeholder="New master name"
                                maxLength="30"
                            />
                            <h4>Master rating</h4>
                            {errors.masterRating && touched.masterRating && <span className="validation-text">{errors.masterRating}</span>}
                            <select name="masterRating" value={values.masterRating} onChange={handleChange} onBlur={handleBlur}>
                                <option value="">Choose rating of master</option>
                                {ratingsSelect}
                            </select>
                            <h4>Add city of master</h4>
                            {errors.masterCity && touched.masterCity && <span className="validation-text">{errors.masterCity}</span>}
                            <select name="masterCity" value={values.masterCity} onChange={handleChange} onBlur={handleBlur}>
                                <option value="">Choose city of master</option>
                                {citySelect}
                            </select>
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
