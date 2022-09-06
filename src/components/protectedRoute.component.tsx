import {Navigate} from 'react-router-dom';
import React from 'react';
import {ROUTES} from "../configs/app.constants";
import {StartScreen} from "../screens/start.screen";

type ProtectedRouteType = {auth: boolean, children: any}
export const ProtectedRoute: React.FC<ProtectedRouteType> = (props) => {
    const { auth, children } = props;
    return !auth ? <Navigate replace to={ROUTES.START}/> : children;
};