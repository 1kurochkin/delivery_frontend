import {Col, Divider, Menu, MenuProps, notification} from 'antd';
import React, {useEffect} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "../../configs/app.constants";
import './sider.component.scss';
import {useAppSelector} from "../../hooks/useAppSelector";
import Title from "antd/lib/typography/Title";
import Sider from "antd/es/layout/Sider";
import {AppstoreOutlined, DesktopOutlined, SettingOutlined} from "@ant-design/icons";
import {UserRoleEnum} from "../../store/reducers/backend/backend.api.types";
import {useModalSupport} from "../modal/modal.support.component";
import {useCountOrderPriceAndDurationMutation, useLogoutMutation} from "../../store/reducers/backend/backend.api";
import {useActions} from "../../hooks/useActions";
import {batch} from "react-redux";

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
    const {setAuth, removeCookies, resetSettingsState} = useActions()

    const navigate = useNavigate();
    const {pathname} = useLocation()


    const [fetchLogout, {error: error1, data: logoutData}] = useLogoutMutation();
    const {data: {message: errorLogout = undefined} = {}} = error1 as any || {};
    useEffect(() => {
        if (logoutData) {
            navigate(ROUTES.MAIN_PAGE);
            notification.success({message: 'You successful logout!'});
            const timeoutId = setTimeout(() => {
                batch(() => {
                    removeCookies('sid');
                    resetSettingsState();
                    setAuth(false);
                })
            }, 300)
            return () => clearTimeout(timeoutId)
        }
    }, [logoutData])
    useEffect(() => {
        if (errorLogout) notification.error({message: errorLogout});
    }, [errorLogout]);

    const {modal: modalSupport, setVisible: setVisibleModalSupport} = useModalSupport();
    const onSelectMenuItemHandler = ({key, keyPath}: any) => {
        switch (key) {
            case 'logout': {
                fetchLogout();
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

// <div className="header">
//     <Row justify={'space-around'}>
//         <Col span={3}>
//             <Link to={ROUTES.MAIN_PAGE}>
//                 <Title level={2}>Bringa.me</Title>
//             </Link>
//         </Col>
//         <Col style={{display: 'flex'}} span={14}>
//             {getNavigationView()}
//         </Col>
//     </Row>
// </div>