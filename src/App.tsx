import React, {useEffect} from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import {CustomSider} from "./components/sider/sider.component";
import {Link, Route, Routes, Navigate} from 'react-router-dom';
import {ROUTES} from './configs/app.constants';
import {MainPage} from './pages/main/main.page';
import {SignupPage} from "./pages/signup/signup.page";
import {LoginPage} from "./pages/login/login.page";
import {useAppSelector} from "./hooks/useAppSelector";
import {useLazyGetCourierInfoQuery, useLazyGetCustomerInfoQuery} from "./store/reducers/backend/backend.api";
import {Button, Layout, notification, Result, Spin, Switch} from "antd";
import {UserRoleEnum} from "./store/reducers/backend/backend.api.types";
import {useActions} from "./hooks/useActions";
import {SettingsPage} from './pages/settings/settings.page';
import {CreatePage} from "./pages/create/create.page";
import {OrdersPage} from "./pages/orders/orders.page";
import {Content} from "antd/es/layout/layout";
import {ProtectedRoute} from "./components/protectedRoute/protected.route.component";
import {NotFoundPage} from "./pages/404/404.page";
import {NotAuthorizedPage} from "./pages/403/403.page";


function App() {

    // const {loadError: errorLoadGoogleMaps} = useLoadScript({
    //     googleMapsApiKey: appConfig.google.maps.apiKey,
    //     libraries: ['places']
    // });
    const auth = useAppSelector(({app}) => app.auth)
    const userRole = useAppSelector(({settings}) => settings.role)
    const prevAuthState = useAppSelector(({app}) => app.auth)
    const {setField} = useActions();

    const [
        fetchGetCourierInfo,
        {error: error1, isFetching: fetchingGetCourierInfo, data: getCourierInfoData}
    ] = useLazyGetCourierInfoQuery();
    const {data: {message: errorGetCourierInfo = undefined} = {}} = error1 as any || {};
    const [
        fetchGetCustomerInfo,
        {error: error2, isFetching: fetchingGetCustomerInfo, data: getCustomerInfoData}
    ] = useLazyGetCustomerInfoQuery(undefined);
    const {data: {message: errorGetCustomerInfo = undefined} = {}} = error2 as any || {};

    useEffect(() => {
        if (!prevAuthState && auth) {
            userRole === UserRoleEnum.Courier ?
                fetchGetCourierInfo(undefined) :
                fetchGetCustomerInfo(undefined)
        }
    }, [auth])

    useEffect(() => {
        if (getCourierInfoData || getCustomerInfoData) {
            const userData = (getCourierInfoData || getCustomerInfoData)
            for (const field in userData) {
                // @ts-ignore
                setField({field, value: userData[field]})
            }
        }
    }, [getCourierInfoData, getCustomerInfoData])

    //--------CATCH-ERRORS------//
    // useEffect(() => {
    if (errorGetCourierInfo || errorGetCustomerInfo) {
        notification.error({message: errorGetCourierInfo || errorGetCustomerInfo});
    }
    // else if (errorLoadGoogleMaps) {
    //     notification.error({message: 'Error loading maps!'});
    // }
    // }, [errorGetCourierInfo, errorGetCustomerInfo])
    //-------------------------//

    return (
        // <div className={'app'}>
        <Layout style={{minHeight: "100vh"}}>
            <CustomSider/>
            <Content>
                {
                    (fetchingGetCustomerInfo || fetchingGetCourierInfo) ?
                        <Spin size={"large"}/> :
                        <>
                            <Routes>
                                <Route path={ROUTES.AUTH.LOGIN_PAGE} element={<LoginPage/>}/>
                                <Route path={ROUTES.AUTH.SIGNUP_PAGE} element={<SignupPage/>}/>
                                <Route path={ROUTES.ORDER.CREATE_PAGE} element={<CreatePage/>}/>
                                <Route path={ROUTES.MAIN_PAGE} element={<MainPage/>}/>
                                <Route path={ROUTES["404"]} element={<NotFoundPage/>}/>
                                <Route path={ROUTES["403"]} element={<NotAuthorizedPage/>}/>
                                <Route path="*" element={<Navigate to={ROUTES["404"]}/>}/>
                                <Route path={ROUTES.ORDER.LIST_PAGE}
                                    element={
                                        <ProtectedRoute auth={auth}>
                                            <OrdersPage/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path={ROUTES.ORDER.UPDATE_PAGE}
                                    element={
                                        <ProtectedRoute auth={auth}>
                                            <CreatePage/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path={ROUTES.PROFILE.SETTINGS_PAGE}
                                    element={
                                        <ProtectedRoute auth={auth}>
                                            <SettingsPage/>
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </>
                }
            </Content>
        </Layout>
    );
}

export default App;
