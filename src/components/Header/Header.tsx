import React from 'react';
import {Link} from "react-router-dom";
import {ROUTES} from "../../configs/constants";
import {Icon} from "../Icon";
import logo from "../../images/logo.jpg";
import './Header.scss';
import { Content } from 'antd/lib/layout/layout';
import { EnvironmentFilled } from '@ant-design/icons';


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
                    <Link className={'header__nav-link button'} to={ROUTES.BECOME_COURIER}>Become a courier</Link>
                    <Link className={'header__nav-link button'} to={ROUTES.CREATE_ORDER}>Make order</Link>
                    <Link className={'header__nav-link button'} to={ROUTES.AUTH_PAGE}>Login and Sign up</Link>
                </div>
            </div>
        </div>
    );
}
