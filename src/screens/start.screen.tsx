import React from 'react';
import {Button, Col, Form, Image, Row, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {ROUTES} from "../configs/app.constants";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {SearchPlaces} from "../components/searchPlaces/search.places.component";
import courierPic from "../assets/pictures/courier.jpg"
import {useForm} from "antd/es/form/Form";

export function StartScreen() {

    const [orderForm] = useForm();
    const navigate = useNavigate();

    const onFinishFormHandler = (values: any) => {
        const {pickupAddress, deliveryAddress} = values;
        navigate(
            ROUTES.ORDER.CREATE_PAGE,
            {state: {pickupAddress, deliveryAddress}}
        );
    }

    const orderFormInputsView = [
        {
            label: 'Specify the address from where to pick up the parcel',
            placeholder: 'Where to pickup A',
            name: 'pickupAddress'
        },
        {
            label: 'Specify the address where to deliver the parcel',
            placeholder: 'Where to pickup B',
            name: 'deliveryAddress'
        },
    ];

    const loginButtonsView = [
        {userRole: UserRoleEnum.Courier, label: ' courier'},
        {userRole: UserRoleEnum.Customer, label: ' customer'},
    ];

    return (
        <Form style={{width: "100%"}} form={orderForm} onFinish={onFinishFormHandler}>
            <Row justify={'center'}>
                <Image src={courierPic}/>
            </Row>
            <Row style={{marginBottom: 10}}>
                <Typography.Title>
                    New york<br/>express delivery
                </Typography.Title>

            </Row>
            <Row style={{marginBottom: 20}}>
                {orderFormInputsView.map(({label, placeholder, name}) =>
                    <Form.Item rules={[{required: true, min: 3, message: ''}]}
                               colon={false}
                               label={label}
                               name={name}
                    >
                        <SearchPlaces placeholder={placeholder}/>
                    </Form.Item>
                )}
                <Button size={"large"} style={{marginTop: 20}} htmlType={'submit'}>Create order</Button>
            </Row>
            <Row style={{marginBottom: 30}} justify={'space-between'}>
                {loginButtonsView.map(({userRole, label}, index) =>
                    <Col offset={index} span={index === 0 ? 11 : 12}>
                        <Button type={'primary'}>
                            <Link to={ROUTES.AUTH.LOGIN_PAGE.PATH + `/${userRole}`}>
                                {`Login as ${label}`}
                            </Link>
                        </Button>
                    </Col>
                )}
            </Row>
            <Row justify={'center'}>
                <Link to={ROUTES.BECOME_COURIER_PAGE}>
                    Do you want to become a courier?<br/>Earn up to $200 per day.
                </Link>
            </Row>
        </Form>
    );
};
