import { Button, Col, Form, Row, Space, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { SearchPlaces } from "../components/searchPlaces.component";
import { ROUTES } from "../configs/app.constants";
import { VALIDATION_CONFIG } from "../configs/validation.config";
import { UserRoleEnum } from "../store/reducers/backend/backend.api.types";

export function StartScreen() {

    const [orderForm] = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const onFinishFormHandler = (values: any) => {
        const {pickupAddress, deliveryAddress} = values;
        navigate(
            ROUTES.CREATE_ORDER,
            {state: {pickupAddress, deliveryAddress}}
        );
    }

    const orderFormInputsView = [
        {
            label: 'Pick up address',
            placeholder: 'Enter your pickup address',
            name: 'pickupAddress'
        },
        {
            label: 'Deliver address',
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
                {/*<Row>*/}
                <Row style={{textAlign: 'center'}} justify={'space-around'}>
                    <Col style={{marginBottom: 5}} span={10}>
                        <Link style={{textDecoration: 'underline'}} to={ROUTES.COURIER_FAQ}>
                            {'Courier FAQ'}
                        </Link>
                    </Col>
                    <Col span={10}>
                        <Link style={{textDecoration: 'underline'}} to={ROUTES.CUSTOMER_FAQ}>
                            {'Customer FAQ'}
                        </Link>
                    </Col>
                {/*</Row>*/}
                {/*<Row style={{textAlign: 'center'}} justify={'space-around'}>*/}
                    <Col span={10}>
                    <Link style={{textDecoration: 'underline'}} to={ROUTES.PRIVACY_POLICY}>
                        {'Privacy policy'}
                    </Link>
                    </Col>
                        <Col span={10}>
                    <Link style={{textDecoration: 'underline'}} to={ROUTES.TERMS_AND_CONDITIONS}>
                        {'Terms and confitions'}
                    </Link>
                        </Col>
                </Row>
                {/*</Row>*/}
            </Space>
        </Form>
    );
};
