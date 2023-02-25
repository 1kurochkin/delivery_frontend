import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useLocation } from 'react-router-dom';
import { Preloader } from "./components/preloader.component";
import { useAppSelector } from "./hooks/useAppSelector";
import AppRoutes from "./routes/routes";
import { useGetUserInfoQuery } from "./store/reducers/backend/backend.api";
import './styles/App.css';

function App() {
    const {pathname} = useLocation();
    const auth = useAppSelector(({app}) => app.auth)
    const loadingApp = useAppSelector(({app}) => app.loading)
    useGetUserInfoQuery(undefined, {skip: !auth});

    return (
        <Layout>
            {/* <PWAPrompt timesToShow={2} copyBody={'This website has app functionality. Add it to your home screen to use it in fullscreen.'} /> */}
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
