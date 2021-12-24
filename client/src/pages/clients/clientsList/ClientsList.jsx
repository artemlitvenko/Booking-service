import React, { useEffect, useState } from 'react';
import './ClientsList.css';
import Clients from '../clients/Clients';
import { useDispatch } from 'react-redux';
import { getClient } from '../../../actions/client';

const ClientsList = () => {
    const dispatch = useDispatch();
    const [currentClientId, setCurrentClientId] = useState(null);

    useEffect(() => {
        dispatch(getClient());
    }, [dispatch]);

    return (
        <div>
            <h1>ClientsList</h1>
            <Clients currentClientId={currentClientId} setCurrentClientId={setCurrentClientId} />
        </div>
    );
};

export default ClientsList;
