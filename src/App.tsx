import React, {useEffect, useState} from 'react';
import './styles/App.css'
// import './App.less';
// import 'antd/dist/antd.css';
import {Link, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {ROUTES} from './configs/app.constants';
import {useAppSelector} from "./hooks/useAppSelector";
import {useGetUserInfoQuery, useLazyGetUserInfoQuery} from "./store/reducers/backend/backend.api";
import {Button, Layout, Result} from "antd";
import {useActions} from "./hooks/useActions";
import {Content, Footer} from "antd/es/layout/layout";
import {ProtectedRoute} from "./components/protectedRoute.component";
import {usePrevious} from "./hooks/usePrevious";
import {PreloaderScreen} from "./screens/preloader.screen";
import {StartScreen} from "./screens/start.screen";
import {CreateScreen} from "./screens/create.screen";
import {ListScreen} from "./screens/list.screen";
import {SettingsScreen} from "./screens/settings.screen";
import {BottomNavigation} from "./components/bottomNavigation.component";
import {LoginScreen} from "./screens/login.screen";
import {OrderScreen} from "./screens/order.screen";

// 366625
function App() {
    const auth = useAppSelector(({app}) => app.auth)
    const loadingApp = useAppSelector(({app}) => app.loading)
    const [hideFooter, setHideFooter] = useState(false);

    // useEffect(() => {
    //     window.addEventListener('resize', (e) => {
    //         alert('resize')
    //     })
    // }, [])

    const {
        // error: error2,
        isFetching: fetchingGetUserInfo = true
    } = useGetUserInfoQuery(undefined, {skip: !auth});

    return (
        <Layout style={{minHeight: "100vh"}}>
            {loadingApp && <PreloaderScreen/>}
            <Content className={'app_content'}>
                <>
                    <Routes>
                        {
                            !auth && <>
                                <Route path={ROUTES.AUTH.LOGIN_PAGE.PATH + ROUTES.AUTH.LOGIN_PAGE.PARAMS}
                                       element={<LoginScreen/>}/>
                                <Route path={ROUTES.MAIN_PAGE} element={<StartScreen/>}/>
                            </>
                        }
                        <Route path={ROUTES.ORDER.CREATE_PAGE} element={<CreateScreen/>}/>
                        <Route path={ROUTES.THANK_YOU} element={
                            <Result
                                status="success"
                                title="Successfully!"
                                subTitle="payment processing will take a few minutes"
                                extra={
                                    <Button type={"primary"}>
                                        <Link to={ROUTES.SETTINGS_PAGE}>OK</Link>
                                    </Button>
                                }
                            />
                        }/>
                        <Route path={ROUTES.ORDER.LIST_PAGE}
                               element={
                                   <ProtectedRoute auth={auth}>
                                       <ListScreen/>
                                   </ProtectedRoute>
                               }
                        />
                        <Route path={ROUTES.ORDER.ORDER_PAGE.PATH + ROUTES.ORDER.ORDER_PAGE.PARAMS}
                               element={
                                   <ProtectedRoute auth={auth}>
                                       <OrderScreen/>
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
                        <Route
                            path="*"
                            element={
                                <Navigate to={
                                    auth ?
                                        ROUTES.ORDER.LIST_PAGE :
                                        ROUTES.MAIN_PAGE
                                } replace/>
                            }
                        />
                    </Routes>
                </>
            </Content>
            {
                auth && !hideFooter &&
                <Footer>
                    <BottomNavigation/>
                </Footer>
            }

        </Layout>
    );
}

export default App;
