import React, { useCallback, useEffect, useState } from 'react';
import './CitiesList.css';
import Cities from '../cities/Cities';
import { useDispatch } from 'react-redux';
import { getCity } from '../../../actions/city';
import PopupAdd from '../popupAdd/PopupAdd';
import PopupEdit from '../popupEdit/PopupEdit';
import { setPopupAddDisplay } from '../../../constarts/actionCityСreaters';

const CitiesList = () => {
    const [currentId, setCurrentId] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCity());
    }, [dispatch]); // если массив зависимости пустой, то функция вызовется один раз после отрисовки компонента

    const showPopupDeleteHandler = useCallback(() => {
        dispatch(setPopupAddDisplay(true));
    }, [dispatch]);

    return (
        <div className="cities-list">
            <div className="item-list-title">
                <h1>CityList</h1>
                <button className="add-city" onClick={showPopupDeleteHandler}>
                    add city
                </button>
            </div>
            <Cities setCurrentId={setCurrentId} />
            <PopupAdd />
            <PopupEdit currentId={currentId} setCurrentId={setCurrentId} />
        </div>
    );
};
export default CitiesList;
