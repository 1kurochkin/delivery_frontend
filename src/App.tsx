import React from 'react';
import './styles/App.css'
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {ROUTES} from './configs/app.constants';
import {useAppSelector} from "./hooks/useAppSelector";
import {useGetUserInfoQuery} from "./store/reducers/backend/backend.api";
import {Layout} from "antd";
import {Content, Footer} from "antd/es/layout/layout";
import {ProtectedRoute} from "./components/protectedRoute.component";
import {PreloaderScreen} from "./screens/preloader.screen";
import {StartScreen} from "./screens/start.screen";
import {CreateScreen} from "./screens/create.screen";
import {ListScreen} from "./screens/list.screen";
import {SettingsScreen} from "./screens/settings.screen";
import {BottomNavigation} from "./components/bottomNavigation.component";
import {LoginScreen} from "./screens/login.screen";
import {OrderScreen} from "./screens/order.screen";
import PWAPrompt from 'react-ios-pwa-prompt'
import {PrivacyPolicyScreen} from "./screens/privacyPolicy.screen";
import {TermsAndConditionsScreen} from "./screens/termsAndConditions.screen";
import {CheckoutScreen} from "./screens/checkout.screen";
import {CustomerFaqScreen} from "./screens/customerFaq.screen";
import {CourierFaq} from "./screens/courierFaq.screen";
import AppRoutes from "./routes/routes";
import {Preloader} from "./components/preloader.component";

function App() {
    const {pathname} = useLocation();
    const auth = useAppSelector(({app}) => app.auth)
    const loadingApp = useAppSelector(({app}) => app.loading)
    useGetUserInfoQuery(undefined, {skip: !auth});

    return (
        <Layout style={{minHeight: "100vh"}}>
            <PWAPrompt timesToShow={2} copyBody={'This website has app functionality. Add it to your home screen to use it in fullscreen.'} />
            {
                loadingApp &&
                <Preloader type={'fullscreen'} />
            }
            <Content>
                <AppRoutes isAuth={auth} pathname={pathname}/>
            </Content>
        </Layout>
    );
}

export default App;
