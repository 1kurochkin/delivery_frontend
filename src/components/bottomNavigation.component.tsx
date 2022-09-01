import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {OrderedListOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons";
import {ROUTES} from "../configs/app.constants";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {useAppSelector} from "../hooks/useAppSelector";
//@ ts-ignore
import BottomNavigationModule from 'reactjs-bottom-navigation'
import 'reactjs-bottom-navigation/dist/index.css'
import {ReactComponent as Home} from '../assets/svgs/home.svg';
import {ReactComponent as Package} from '../assets/svgs/package.svg';
import {ReactComponent as User} from '../assets/svgs/user.svg';
//
// type MenuItem = Required<MenuProps>['items'][number];
//
// function getItem(
//     label: React.ReactNode,
//     key?: React.Key | null,
//     icon?: React.ReactNode,
//     children?: MenuItem[],
//     type?: 'group',
// ): MenuItem {
//     return {
//         key,
//         icon,
//         children,
//         label,
//         type,
//     } as MenuItem;
// }

export function BottomNavigation() {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const userRole = useAppSelector(({settings}) => settings.role)
    const IS_USER_ROLE_CUSTOMER = userRole === UserRoleEnum.Customer
    const bottomNavItems = [
        {
            title: 'Orders',
            icon: <Home/>,
            activeIcon: <Home/>,
            route: ROUTES.ORDER.LIST_PAGE
        },
        ...(
            IS_USER_ROLE_CUSTOMER ?
                [{
                    title: 'Create',
                    icon: <Package/>,
                    activeIcon: <Package/>,
                    route: ROUTES.ORDER.CREATE_PAGE
                }] :
                []
        ),
        {
            title: 'Settings',
            icon: <User/>,
            activeIcon: <User/>,
            route: ROUTES.SETTINGS_PAGE
        },
    ]
    const [selected, setSelected] = useState(bottomNavItems.findIndex(({route}) => route === pathname));
    useEffect(() => {
        setSelected(bottomNavItems.findIndex(({route}) => route === pathname))
    }, [pathname])
    return (
        <>
            <BottomNavigationModule
                activeBgColor={'black'}
                items={bottomNavItems}
                defaultSelected={selected}
                onItemClick={({route}: any) => navigate(route)}
            />
        </>
    );
}
