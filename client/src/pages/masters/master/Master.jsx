import React, { useCallback } from 'react';
import './Master.css';
import { useDispatch } from 'react-redux';
import { deleteMaster } from '../../../actions/master';
import { setPopupEditDisplayMaster } from '../../../constarts/actionMasterСreaters';

const Master = ({ master, setCurrentMasterId }) => {
    const dispatch = useDispatch();

    const deleteClickHandler = useCallback(
        (e) => {
            e.stopPropagation();
            dispatch(deleteMaster(master._id));
        },
        [dispatch, master._id],
    );

    const showPopupEditHandler = useCallback(() => {
        dispatch(setPopupEditDisplayMaster(true));
        setCurrentMasterId(master._id);
    }, [dispatch, setCurrentMasterId, master._id]);

    return (
        <div className="masters-item">
            <div className="list-content-item">{master.name}</div>
            <div className="list-content-item">{master.city.city_name}</div>
            <div className="list-content-item">
                <span>Rating:</span> {master.rating}
            </div>
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

export default Master;
