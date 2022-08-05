import React from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import {Header} from "./components/header/header.component";
import {Route, Routes} from 'react-router-dom';
import {ROUTES} from './configs/constants';
import {MainPage} from './pages/main/main.page';
import { Footer} from './components/footer/footer.component';
import {SignupPage} from "./pages/signup/signup.page";
import {LoginPage} from "./pages/login/login.page";



function App() {
    return (
        <div className={'app'}>
            <Header/>
            {/*<div className={'container'}>*/}
                <Routes>
                    <Route path={ROUTES.MAIN_PAGE} element={<MainPage/>}/>
                    <Route path={ROUTES.LOGIN_PAGE} element={<LoginPage/>}/>
                    <Route path={ROUTES.SIGNUP_PAGE} element={<SignupPage/>}/>
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
