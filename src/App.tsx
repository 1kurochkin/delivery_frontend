import React, {useEffect} from 'react';
import './styles/App.css'
// import './App.less';
// import 'antd/dist/antd.css';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {ROUTES} from './configs/app.constants';
import {useAppSelector} from "./hooks/useAppSelector";
import {useLazyGetUserInfoQuery} from "./store/reducers/backend/backend.api";
import {Button, Layout, notification, Row} from "antd";
import {useActions} from "./hooks/useActions";
import {Content} from "antd/es/layout/layout";
import {ProtectedRoute} from "./components/protectedRoute/protected.route.component";
import {NotFoundPage} from "./screens/404/404.page";
import {NotAuthorizedPage} from "./screens/403/403.page";
import {usePrevious} from "./hooks/usePrevious";
import {PreloaderScreen} from "./screens/preloader.screen";
import {StartScreen} from "./screens/start.screen";
import {CreateScreen} from "./screens/create.screen";
import {ListScreen} from "./screens/list.screen";
import {SettingsScreen} from "./screens/settings.screen";
import {ButtonBack} from "./components/button/buttonBack.component";
import {MenuOutlined} from "@ant-design/icons";
import {Header} from "./components/header.component";

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
    const {pathname} = useLocation()


    const [
        fetchGetUserInfo,
        {error: error2, isFetching: fetchingGetUserInfo}
    ] = useLazyGetUserInfoQuery();
    const {data: {message: errorGetUserInfo = undefined} = {}} = error2 as any || {};

    // useEffect(() => {Cookies.set('sid', '1e6ed700-e403-42ce-8a36-41d91d0be86e')}, [])

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
        <Layout style={{minHeight: "100vh"}}>
            {auth && <Header/>}
            <Content className={'app_content'}>
                {
                    (fetchingGetUserInfo) ?
                        <PreloaderScreen/> :
                        <>
                            <Routes>
                                {/*<Route path={ROUTES.AUTH.LOGIN_PAGE.PATH + ROUTES.AUTH.LOGIN_PAGE.PARAMS} element={<LoginScreen/>}/>*/}
                                {/*<Route path={ROUTES.AUTH.SIGNUP_PAGE} element={<SignupPage/>}/>*/}
                                {/*<Route path={ROUTES.ORDER.CREATE_PAGE} element={<CreateScreen/>}/>*/}
                                <Route path={ROUTES.MAIN_PAGE} element={<StartScreen/>}/>
                                <Route path={ROUTES["404"]} element={<NotFoundPage/>}/>
                                <Route path={ROUTES["403"]} element={<NotAuthorizedPage/>}/>
                                {/*<Route path="*" element={<Navigate to={ROUTES["404"]}/>}/>*/}
                                <Route path={ROUTES.ORDER.LIST_PAGE}
                                    element={
                                        <ProtectedRoute auth={auth}>
                                            <ListScreen/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path={ROUTES.ORDER.UPDATE_PAGE.PATH + ROUTES.ORDER.UPDATE_PAGE.PARAMS}
                                    element={
                                        <ProtectedRoute auth={auth}>
                                            <CreateScreen/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path={ROUTES.SETTINGS_PAGE}
                                    element={
                                        <ProtectedRoute auth={auth}>
                                            <SettingsScreen/>
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
