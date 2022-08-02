import React from 'react';
import './App.scss';
import {Layout} from 'antd';
import 'antd/dist/antd.css';
import {Header} from "./components/Header/Header";
import {Route, Routes} from 'react-router-dom';
import {ROUTES} from './configs/constants';
import {MainPage} from './pages/MainPage/MainPage';
import {AuthPage} from './pages/AuthPage';
import { Content } from 'antd/lib/layout/layout';
import { Footer } from './components/Footer/Footer';



function App() {
    return (
        <div className={'app'}>
            <Header/>
            {/*<div className={'container'}>*/}
                <Routes>
                    <Route path={ROUTES.MAIN_PAGE} element={<MainPage/>}/>
                    <Route path={ROUTES.AUTH_PAGE} element={<AuthPage/>}/>
                </Routes>
            {/*</div>*/}
            <Footer/>
            {/*<Footer style={{textAlign: 'center'}}>Bringa.me ©2022</Footer>*/}
        </div>
    );
}

// {/*<Header/>*/}
// {/*<Content>*/}
// {/*</Content>*/}
// {/*<Footer>*/}
// {/*    Bringa.me Delivery app ©2022*/}
// {/*</Footer>*/}

export default App;
