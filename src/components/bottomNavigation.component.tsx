import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {OrderedListOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons";
import {ROUTES} from "../configs/app.constants";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {useAppSelector} from "../hooks/useAppSelector";
//@ ts-ignore
import BottomNavigationModule from 'reactjs-bottom-navigation'
import 'reactjs-bottom-navigation/dist/index.css'
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
            icon: <OrderedListOutlined/>,
            activeIcon: <OrderedListOutlined color={'green'}/>,
            route: ROUTES.ORDER.LIST_PAGE
        },
        ...(
            IS_USER_ROLE_CUSTOMER ?
                [{
                    title: 'Create',
                    icon: <PlusOutlined/>,
                    activeIcon: <PlusOutlined color={'green'}/>,
                    route: ROUTES.ORDER.CREATE_PAGE
                }] :
                []
        ),
        {
            title: 'Settings',
            icon: <SettingOutlined/>,
            activeIcon: <SettingOutlined color={'green'}/>,
            route: ROUTES.SETTINGS_PAGE
        },
    ]
    return (
        <>
            <BottomNavigationModule
                activeBgColor={'#27CB84'}
                items={bottomNavItems}
                defaultSelected={bottomNavItems.findIndex(({route}) => route === pathname)}
                onItemClick={({route}: any) => navigate(route)}
            />
        </>
    );
}
