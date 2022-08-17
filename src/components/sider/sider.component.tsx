import {Col, Divider, Menu, MenuProps} from 'antd';
import React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "../../configs/app.constants";
import './sider.component.scss';
import {useAppSelector} from "../../hooks/useAppSelector";
import Title from "antd/lib/typography/Title";
import Sider from "antd/es/layout/Sider";
import {AppstoreOutlined, DesktopOutlined, SettingOutlined} from "@ant-design/icons";
import {UserRoleEnum} from "../../store/reducers/backend/backend.api.types";
import {useModalSupport} from "../modal/modal.support.component";
import {useLogoutMutation} from "../../store/reducers/backend/backend.api";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


export function CustomSider() {
    const auth = useAppSelector(({app}) => app.auth)
    const userRole = useAppSelector(({settings}) => settings.role)

    const navigate = useNavigate();
    const {pathname} = useLocation()


    const [fetchLogout] = useLogoutMutation();

    const {modal: modalSupport, setVisible: setVisibleModalSupport} = useModalSupport();
    const onSelectMenuItemHandler = ({key, keyPath}: any) => {
        switch (key) {
            case 'logout': {
                fetchLogout();
                navigate(ROUTES.MAIN_PAGE);
            }
                return;
            case 'support':
                setVisibleModalSupport(true);
                return;
            default:
                navigate(key);
                return;
        }
    }

    const items: MenuItem[] = [
        ...(!auth ?
                [
                    getItem('Auth', ROUTES.AUTH.PATH, <DesktopOutlined/>, [
                        getItem('Login', ROUTES.AUTH.LOGIN_PAGE),
                        getItem('Signup', ROUTES.AUTH.SIGNUP_PAGE),
                    ]),
                    getItem('Order', ROUTES.ORDER.PATH, <AppstoreOutlined/>, [
                        getItem('Create', ROUTES.ORDER.CREATE_PAGE)
                    ])
                ] : [
                    getItem('Order', ROUTES.ORDER.PATH, <AppstoreOutlined/>, [
                        ...(
                            userRole === UserRoleEnum.Customer ?
                                [getItem('Create', ROUTES.ORDER.CREATE_PAGE)] :
                                []
                        ),
                        getItem('List', ROUTES.ORDER.LIST_PAGE),
                    ]),
                    getItem('Profile', ROUTES.PROFILE.PATH, <SettingOutlined/>, [
                        getItem('Settings', ROUTES.PROFILE.SETTINGS_PAGE),
                        getItem('Logout', 'logout'),
                        getItem('Support', 'support'),
                    ]),
                ]
        ),
    ]

    return (
        <Sider>
            {modalSupport}
            <Col span={24}>
                <Link to={ROUTES.MAIN_PAGE}>
                    <Title level={2} style={{color: 'white', textAlign: 'center'}}>Bringa.me</Title>
                </Link>
                <Divider style={{backgroundColor: 'white'}}/>
            </Col>
            <Col span={24}>
                <Menu onSelect={onSelectMenuItemHandler}
                      theme={'dark'}
                      defaultOpenKeys={[ROUTES.AUTH.PATH, ROUTES.ORDER.PATH, ROUTES.PROFILE.PATH]}
                      selectedKeys={[pathname]}
                      mode="inline"
                      items={items}
                />
            </Col>
        </Sider>
    );
}
