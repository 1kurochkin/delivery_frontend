import React from 'react';
import './styles/App.css'
import {useLocation} from 'react-router-dom';
import {useAppSelector} from "./hooks/useAppSelector";
import {useGetUserInfoQuery} from "./store/reducers/backend/backend.api";
import {Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import PWAPrompt from 'react-ios-pwa-prompt'
import AppRoutes from "./routes/routes";
import {Preloader} from "./components/preloader.component";
import {isMobile} from 'react-device-detect';

function App() {
    const {pathname} = useLocation();
    const auth = useAppSelector(({app}) => app.auth)
    const loadingApp = useAppSelector(({app}) => app.loading)
    useGetUserInfoQuery(undefined, {skip: !auth});

    return (
        <Layout>
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
