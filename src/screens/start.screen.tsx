import React from 'react';
import {Anchor, Button, Col, Form, Image, Row, Space, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {ROUTES} from "../configs/app.constants";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {SearchPlaces} from "../components/searchPlaces.component";
import courierPic from "../assets/pictures/courier.jpg"
import {useForm} from "antd/es/form/Form";
import {VALIDATION_CONFIG} from "../configs/validation.config";

export function StartScreen() {

    const [orderForm] = useForm();
    const navigate = useNavigate();

    const onFinishFormHandler = (values: any) => {
        const {pickupAddress, deliveryAddress} = values;
        navigate(
            ROUTES.CREATE_ORDER,
            {state: {pickupAddress, deliveryAddress}}
        );
    }

    const orderFormInputsView = [
        {
            label: 'Specify the address from where to pick up the package',
            placeholder: 'Enter your pickup address',
            name: 'pickupAddress'
        },
        {
            label: 'Specify the address where to deliver the package',
            placeholder: 'Enter the destination address',
            name: 'deliveryAddress'
        },
    ];

    const loginButtonsView = [
        {userRole: UserRoleEnum.Courier, label: ' courier'},
        {userRole: UserRoleEnum.Customer, label: ' customer'},
    ];

    return (
        <Form style={{width: "100%"}}
              form={orderForm}
              onFinish={onFinishFormHandler}
        >
            <Space direction={"vertical"} size={'large'}>
                <Row style={{marginBottom: 10}}>
                    <Typography.Title>
                        Express Delivery<br/>Service in New York
                    </Typography.Title>
                </Row>
                <Row style={{marginBottom: 20}}>
                    {orderFormInputsView.map(({label, placeholder, name}) =>
                        <Form.Item style={{width: '100%'}} rules={VALIDATION_CONFIG.address}
                                   colon={false}
                                   label={label}
                                   name={name}
                        >
                            <SearchPlaces placeholder={placeholder}/>
                        </Form.Item>
                    )}
                    <Button size={"large"} style={{marginTop: 20}} htmlType={'submit'}>Create order</Button>
                </Row>
                <Row justify={'space-between'}>
                    {loginButtonsView.map(({userRole, label}, index) =>
                        <Col offset={index} span={index === 0 ? 11 : 12}>
                            <Button type={'primary'}>
                                <Link to={ROUTES.LOGIN.PATH + `/${userRole}`}>
                                    {`Login as ${label}`}
                                </Link>
                            </Button>
                        </Col>
                    )}
                </Row>
                {/*<Row style={{textAlign: 'center'}} justify={'center'}>*/}
                {/*    <Col style={{marginBottom: 5}} span={24}>*/}
                {/*        <Link className={'font-bold'} style={{textDecoration: 'underline'}} to={ROUTES.COURIER_FAQ}>*/}
                {/*            {'How it works for a courier?'}*/}
                {/*        </Link>*/}
                {/*    </Col>*/}
                {/*    <Col span={24}>*/}
                {/*        <Link className={'font-bold'} style={{textDecoration: 'underline'}} to={ROUTES.CUSTOMER_FAQ}>*/}
                {/*            {'How it works for a customer?'}*/}
                {/*        </Link>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
            </Space>
        </Form>
    );
};
