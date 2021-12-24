import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import OrderForm from './pages/orders/orderForm/OrderForm';
import CitiesList from './pages/city/citiesList/CitiesList';
import MastersList from './pages/masters/mastersList/MastersList';
import ClientsList from './pages/clients/clientsList/ClientsList';
import OrdersList from './pages/orders/ordersList/OrdersList';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Registration from './pages/registration/Registration';
import Login from './pages/login/login/Login';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from './actions/user';
import Dashboard from './pages/dashboard/dashboard/Dashboard';

const App = () => {
    const isAuth = useSelector((state) => state.user.isAuth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(auth());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <div className="App">
                <Header />
                <div className="container main">
                    {!isAuth && (
                        <Switch>
                            <Route exact path="/" render={() => <OrderForm />} />
                            <Route exact path="/login" render={() => <Login />} />
                            <Route exact path="/registration" render={() => <Registration />} />
                            <Redirect to={{ pathname: '/' }} />
                        </Switch>
                    )}
                    {isAuth && (
                        <Switch>
                            <Route exact path="/" render={() => <OrderForm />} />
                            <Route exact path="/dashboard" render={() => <Dashboard />} />
                            <Route exact path="/citieslist" render={() => <CitiesList />} />
                            <Route exact path="/masterslist" render={() => <MastersList />} />
                            <Route exact path="/orderslist" render={() => <OrdersList />} />
                            <Route exact path="/clientslist" render={() => <ClientsList />} />
                        </Switch>
                    )}
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default App;
