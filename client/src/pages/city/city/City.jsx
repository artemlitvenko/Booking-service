import React, { useCallback } from 'react';
import './City.css';
import { useDispatch } from 'react-redux';
import { deleteCity } from '../../../actions/city';
import { setPopupEditDisplay } from '../../../constarts/actionCityСreaters';

const City = ({ city, setCurrentId }) => {
    const dispatch = useDispatch();

    const deleteClickHandler = useCallback(
        (e) => {
            e.stopPropagation();
            dispatch(deleteCity(city._id));
        },
        [city._id, dispatch],
    );

    const showPopupEditHandler = useCallback(() => {
        dispatch(setPopupEditDisplay(true));
        setCurrentId(city._id);
    }, [city._id, setCurrentId, dispatch]);

    return (
        <div className="cities-item">
            <div className="list-content">{city.city_name}</div>
            <div className="btn-item">
                <button className="edit-btn" onClick={showPopupEditHandler}>
                    Edit
                </button>
                <button className="delete-btn" onClick={deleteClickHandler}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default City;
