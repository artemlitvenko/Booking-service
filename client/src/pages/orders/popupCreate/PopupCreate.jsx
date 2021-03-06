import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPopupCreateDisplayOrder } from '../../../constarts/actionOrder–°reaters';

const PopupCreate = () => {
    const dispatch = useDispatch();
    const popupCreateDisplay = useSelector((state) => state.orderReducer.popupCreateDisplay);

    const popupCreateClose = useCallback(() => {
        dispatch(setPopupCreateDisplayOrder(false));
        window.location.reload();
    }, [dispatch]);

    if (!popupCreateDisplay) {
        return null;
    }

    return (
        <div className="popup popup-create" onClick={popupCreateClose}>
            <div className="popup-content" onClick={(event) => event.stopPropagation()}>
                <div className="popup-header">
                    <div className="popup-title">Order was created</div>
                    <button className="popup-close" onClick={popupCreateClose}>
                        X
                    </button>
                </div>
                <div className="popup-create-content">Please check your email</div>
            </div>
        </div>
    );
};

export default PopupCreate;
