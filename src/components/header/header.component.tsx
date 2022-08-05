import { Button } from 'antd';
import React from 'react';
import {Link} from "react-router-dom";
import {ROUTES} from "../../configs/constants";
import './header.component.scss';


export function Header() {
    return (
        <div className="header">
            <div className={'header__container'}>
                <div className={'header__logo'}>
                    {/*<img className={'header__logo-img'} src={logo} alt={'logo'}/>*/}
                    <span className={'title'}>Bringa.me</span>
                    <div className={'header__logo-location'}>
                        {/*<EnvironmentFilled  />*/}
                        {/*<span className={'header__logo-location-span'}>NYC</span>*/}
                    </div>
                </div>

                <div className={'header__nav'}>
                    <Button className={'button-pink'}>
                        <Link to={ROUTES.BECOME_COURIER}>Become a courier</Link>
                    </Button>
                    <Button className={'header__nav-link button-pink'}>
                        <Link  to={ROUTES.CREATE_ORDER}>Make order</Link>
                    </Button>
                    <Button className={'header__nav-link button-pink'}>
                        <Link to={ROUTES.LOGIN_PAGE}>Login and Sign up</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
