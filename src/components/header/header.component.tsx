import {Button, Col, Row} from 'antd';
import React from 'react';
import {Link} from "react-router-dom";
import {ROUTES} from "../../configs/constants";
import './header.component.scss';
import {useAppSelector} from "../../hooks/useAppSelector";
import Title from "antd/lib/typography/Title";
import {UserRoleEnum} from "../../store/reducers/backend/backend.api.types";


export function Header() {
    const auth = useAppSelector(({app}) => app.auth)
    const userRole = useAppSelector(({settings}) => settings.role)
    const navigationConfig = {
        authTrue: {
            courier: [
                {link: ROUTES.CREATE_ORDER, label: "Orders"},
                {link: ROUTES.SETTINGS_PAGE, label: "Settings"},
            ],
            customer: [
                {link: ROUTES.CREATE_ORDER, label: "Create Order"},
                {link: ROUTES.CREATE_ORDER, label: "My Orders"},
                {link: ROUTES.SETTINGS_PAGE, label: "Settings"},
            ]
        },
        authFalse: [
            {link: ROUTES.BECOME_COURIER, label: "Become a courier"},
            {link: ROUTES.CREATE_ORDER, label: "Create order"},
            {link: ROUTES.LOGIN_PAGE, label: "Login and Sign up"},
        ]
    }

    const getViewByNavigationConfig = (navConfig: Array<{link: string, label: string}>) => {
        return navConfig.map(({link, label}, i) =>
            <Col offset={i > 0 ? 1 : 0} span={7}>
                <Button>
                    <Link to={link}>{label}</Link>
                </Button>
            </Col>
        );
    }

    const getNavigationView = () => {
        let result;
        if(auth) {
            // @ts-ignore
            result = getViewByNavigationConfig(navigationConfig?.authTrue[userRole]);
        } else {
            result = getViewByNavigationConfig(navigationConfig?.authFalse)
        }
        return <>{result}</>;
    }

    return (
        <div className="header">
            <Row justify={'space-around'}>
                <Col span={3}>
                    <Link to={ROUTES.MAIN_PAGE}>
                        <Title level={2}>Bringa.me</Title>
                    </Link>
                </Col>
                <Col style={{display: 'flex'}} span={14}>
                    {getNavigationView()}
                </Col>
            </Row>
        </div>
);
}
