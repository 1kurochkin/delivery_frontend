import React, {useEffect} from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import {CustomSider} from "./components/sider/sider.component";
import {Route, Routes} from 'react-router-dom';
import {ROUTES} from './configs/app.constants';
import {MainPage} from './pages/main/main.page';
import {SignupPage} from "./pages/signup/signup.page";
import {LoginPage} from "./pages/login/login.page";
import {useAppSelector} from "./hooks/useAppSelector";
import {useLazyGetUserInfoQuery} from "./store/reducers/backend/backend.api";
import {Layout, notification, Spin} from "antd";
import {useActions} from "./hooks/useActions";
import {SettingsPage} from './pages/settings/settings.page';
import {CreatePage} from "./pages/create/create.page";
import {OrdersPage} from "./pages/orders/orders.page";
import {Content} from "antd/es/layout/layout";
import {ProtectedRoute} from "./components/protectedRoute/protected.route.component";
import {NotFoundPage} from "./pages/404/404.page";
import {NotAuthorizedPage} from "./pages/403/403.page";
import {usePrevious} from "./hooks/usePrevious";

// 366625
function App() {

    // const {loadError: errorLoadGoogleMaps} = useLoadScript({
    //     googleMapsApiKey: appConfig.google.maps.apiKey,
    //     libraries: ['places']
    // });
    const auth = useAppSelector(({app}) => app.auth)
    const userRole = useAppSelector(({settings}) => settings.role)
    const prevAuthState = usePrevious(auth)
    const {setAuth, setSettingsField} = useActions()

    const [
        fetchGetUserInfo,
        {error: error2, isFetching: fetchingGetUserInfo}
    ] = useLazyGetUserInfoQuery();
    const {data: {message: errorGetUserInfo = undefined} = {}} = error2 as any || {};

    // useEffect(() => {Cookies.set('sid', '2bb974bc-f4b1-45cd-91cd-5cc14ab377d6')}, [])

    useEffect(() => {
        if (!prevAuthState && auth) {
            fetchGetUserInfo()
        }
    }, [auth])

    // useEffect(() => {
    //     console.log('useEffect getCourierInfoData, getCustomerInfoData')
    //     if (getCourierInfoData || getCustomerInfoData) {
    //         const userData = (getCourierInfoData || getCustomerInfoData)
    //         console.log(userData)
    //         for (const field in userData) {
    //             // @ts-ignore
    //             setSettingsField({field, value: userData[field]})
    //         }
    //     }
    // }, [getCourierInfoData, getCustomerInfoData])

    //--------CATCH-ERRORS------//
    if (errorGetUserInfo) {
        notification.error({message: errorGetUserInfo});
    }
    //-------------------------//

    return (
        // <div className={'app'}>
        <Layout style={{minHeight: "100vh"}}>
            <CustomSider/>
            <Content>
                {
                    (fetchingGetUserInfo) ?
                        <Spin size={"large"}/> :
                        <>
                            <Routes>
                                <Route path={ROUTES.AUTH.LOGIN_PAGE} element={<LoginPage/>}/>
                                <Route path={ROUTES.AUTH.SIGNUP_PAGE} element={<SignupPage/>}/>
                                <Route path={ROUTES.ORDER.CREATE_PAGE} element={<CreatePage/>}/>
                                <Route path={ROUTES.MAIN_PAGE} element={<MainPage/>}/>
                                <Route path={ROUTES["404"]} element={<NotFoundPage/>}/>
                                <Route path={ROUTES["403"]} element={<NotAuthorizedPage/>}/>
                                {/*<Route path="*" element={<Navigate to={ROUTES["404"]}/>}/>*/}
                                <Route path={ROUTES.ORDER.LIST_PAGE}
                                    element={
                                        <ProtectedRoute auth={auth}>
                                            <OrdersPage/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path={ROUTES.ORDER.UPDATE_PAGE.PATH + ROUTES.ORDER.UPDATE_PAGE.PARAMS}
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
