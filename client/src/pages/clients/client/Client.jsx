import React, { useCallback } from 'react';
import './Client.css';
import { useDispatch } from 'react-redux';
import { deleteClient } from '../../../actions/client';

const Client = ({ client }) => {
    const dispatch = useDispatch();

    const deleteClickHandler = useCallback(
        (e) => {
            e.stopPropagation();
            dispatch(deleteClient(client._id));
        },
        [client._id, dispatch],
    );
    return (
        <div className="clients-item">
            <div className="list-content-item">{client.client_name}</div>
            <div className="list-content-item">{client.client_email}</div>
            <div className="btn-item">
                <button className="delete-btn" onClick={deleteClickHandler}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default Client;
