import React, {useState} from 'react';
import {Button, Col, Drawer, Menu, MenuProps, Row} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {ButtonBack} from "./button/buttonBack.component";
import {AppstoreOutlined, MenuOutlined, SettingOutlined} from "@ant-design/icons";
import {ROUTES} from "../configs/app.constants";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {useAppSelector} from "../hooks/useAppSelector";

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

export function Header() {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    // const auth = useAppSelector(({app}) => app.auth)
    const userRole = useAppSelector(({settings}) => settings.role)
    const IS_USER_ROLE_CUSTOMER = userRole === UserRoleEnum.Customer
    const {pathname} = useLocation()

    const onSelectMenuItemHandler = ({key, keyPath}: any) => {
        setVisible(false);
        navigate(key);
    }

    const items: MenuItem[] = [
        ...(
            IS_USER_ROLE_CUSTOMER ?
                [getItem('Create', ROUTES.ORDER.CREATE_PAGE)] :
                []
        ),
        getItem('Orders', ROUTES.ORDER.LIST_PAGE),
        getItem('Settings', ROUTES.SETTINGS_PAGE),
        //
        // ...(
        //     !auth ?
        //         [
        //             getItem('Login', ROUTES.AUTH.LOGIN_PAGE.PATH),
        //         ]
        //         :
        //         [
        //             getItem('Orders', ROUTES.ORDER.LIST_PAGE),
        //             getItem('Settings', ROUTES.SETTINGS_PAGE),
        //         ]
        // ),
    ]
    return (
        <>
            <Row justify={"space-between"}>
                {/*<Col>*/}
                {/*    <ButtonBack onClick={() => navigate(-1)}/>*/}
                {/*</Col>*/}
                <Col span={5}>
                    <Button size={"large"} onClick={() => setVisible(true)}>
                        <MenuOutlined/>
                    </Button>
                </Col>


            </Row>
            <Row>
                <Drawer
                    placement={'bottom'}
                    // title="Multi-level drawer"
                    height={'auto'}
                    closable={false}
                    onClose={() => setVisible(false)}
                    visible={visible}
                >
                    <Menu onSelect={onSelectMenuItemHandler}
                        theme={'light'}
                        defaultOpenKeys={[ROUTES.AUTH.PATH, ROUTES.ORDER.PATH]}
                        selectedKeys={[pathname]}
                        mode="inline"
                        items={items}
                    />
                </Drawer>
            </Row>
        </>
    );
};
