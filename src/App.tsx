import React, {useEffect} from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import {Header} from "./components/header/header.component";
import {Route, Routes} from 'react-router-dom';
import {ROUTES} from './configs/app.constants';
import {MainPage} from './pages/main/main.page';
import {Footer} from './components/footer/footer.component';
import {SignupPage} from "./pages/signup/signup.page";
import {LoginPage} from "./pages/login/login.page";
import {useAppSelector} from "./hooks/useAppSelector";
import {useLazyGetCourierInfoQuery, useLazyGetCustomerInfoQuery} from "./store/reducers/backend/backend.api";
import {Layout, notification, Spin} from "antd";
import {UserRoleEnum} from "./store/reducers/backend/backend.api.types";
import {useActions} from "./hooks/useActions";
import {SettingsPage} from './pages/settings/settings.page';
import {CreatePage} from "./pages/create/create.page";
import {OrdersPage} from "./pages/orders/orders.page";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";


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
        if(getCourierInfoData || getCustomerInfoData) {
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
            <Layout>
                <Sider>Sider</Sider>
                <Layout>
                    <Content>
                        {
                            (fetchingGetCustomerInfo || fetchingGetCourierInfo) ?
                                <Spin size={"large"}/> :
                                <>
                                    {/*<Header/>*/}
                                    <Routes>
                                        <Route path={ROUTES.MAIN_PAGE} element={<MainPage/>}/>
                                        <Route path={ROUTES.LOGIN_PAGE} element={<LoginPage/>}/>
                                        <Route path={ROUTES.SIGNUP_PAGE} element={<SignupPage/>}/>
                                        <Route path={ROUTES.SETTINGS_PAGE} element={<SettingsPage/>}/>
                                        <Route path={ROUTES.CREATE_PAGE} element={<CreatePage/>}/>
                                        <Route path={ROUTES.UPDATE_PAGE} element={<CreatePage/>}/>
                                        <Route path={ROUTES.ORDERS_PAGE} element={<OrdersPage/>}/>
                                    </Routes>
                                    {/*<Footer/>*/}
                                </>
                        }
                    </Content>
                </Layout>
            </Layout>
        // </div>
    );
}

export default App;
