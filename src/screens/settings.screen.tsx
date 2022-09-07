import React, {useEffect} from 'react';
import {useAppSelector} from "../hooks/useAppSelector";
import {useModalSupport} from "../components/modalSupport.component";
import {useForm} from "antd/es/form/Form";
import {
    useCreateInvoiceMutation, useLazyGetUserInfoQuery,
    useLogoutMutation,
    useUpdateUserSettingsMutation
} from "../store/reducers/backend/backend.api";
import {Badge, Button, Card, Col, Form, Input, InputNumber, Row, Typography} from "antd";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {VALIDATION_CONFIG} from "../configs/validation.config";
import {ReactComponent as Phone} from '../assets/svgs/phone.svg';
import {ReactComponent as User} from '../assets/svgs/user.svg';
import {Link, useNavigate, useLocation} from "react-router-dom";
import {COLORS, ROUTES} from "../configs/app.constants";

export function SettingsScreen() {
    const [settingsForm] = useForm()
    const navigate = useNavigate()
    const {state: locationState}: any = useLocation();
    const {isFromCheckoutScreen = false} = locationState || {};
    const settingsReduxState = useAppSelector(({settings}) => settings)
    const {id: user_id, phone, payments = [], wallet: {value: balance = 0, hold = 0} = {}} = settingsReduxState || {};
    const IS_USER_ROLE_CUSTOMER = settingsReduxState.role === UserRoleEnum.Customer
    const [
        fetchLogout,
        {isLoading: fetchingLogout}
    ] = useLogoutMutation();
    const [
        fetchUpdateUserSettings,
        {isLoading: fetchingUpdateUserSettings}
    ] = useUpdateUserSettingsMutation();
    const [
        fetchCreateInvoice,
        {isLoading: fetchingCreateInvoice}
    ] = useCreateInvoiceMutation();
    const [
        fetchGetUserInfo,
        {isLoading: fetchingGetUserInfo}
    ] = useLazyGetUserInfoQuery();
    const {modal: modalSupport, setVisible: setVisibleModalSupport} = useModalSupport()

    useEffect(() => {
        settingsForm.setFieldsValue(settingsReduxState);
    }, [settingsReduxState])

    const onFinishSettingsFormHandler = (values: any) => {
        fetchUpdateUserSettings(values);
    }

    const onFinishBalanceFormHandler = (values) => {
        fetchCreateInvoice(values).unwrap().then((data) => {
            navigate(ROUTES.CHECKOUT, {state: data})
        })
    }

    const onClickLogoutButton = () => {
        fetchLogout()
    }


    return (
        <>
            {modalSupport}
            <Row>
                <Typography.Title level={2}>Settings</Typography.Title>
            </Row>
            <Row>
                <Typography.Title style={{marginBottom: 0}} level={3}>
                    Your profile
                </Typography.Title>
                <Typography.Paragraph style={{fontSize: 12}}>
                    Your profile information, that you can change
                </Typography.Paragraph>
            </Row>
            <Row>
                <Form style={{width: '100%'}} form={settingsForm} onFinish={onFinishSettingsFormHandler}>
                    <Form.Item colon={false} label={'Your are'} name={'role'}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item rules={VALIDATION_CONFIG.name} colon={false} label={'Your name'} name={'name'}>
                        <Input prefix={<User/>} placeholder={'Michael'}/>
                    </Form.Item>
                    <Form.Item rules={VALIDATION_CONFIG.phone} style={{marginBottom: 20}} colon={false}
                               label={'Your phone'} name={'phone'}>
                        <InputNumber maxLength={11} style={{width: '100%'}} placeholder={'000000'} prefix={<Phone/>}/>
                    </Form.Item>
                    <Form.Item>
                        <Button size={'large'} loading={fetchingUpdateUserSettings} htmlType={'submit'}>Save</Button>
                    </Form.Item>
                </Form>
            </Row>
            {
                !IS_USER_ROLE_CUSTOMER &&
                <>
                    <Row style={{marginTop: 20}}>
                        <Badge size="default" color={balance > 0 ? "green" : "red"} dot={true} offset={[10, 15]}>
                            <Typography.Title level={3} style={{marginBottom: 0}}>
                                Your wallet
                            </Typography.Title>
                        </Badge>
                        <Typography.Paragraph style={{fontSize: 12}}>
                            {balance > 0 ? 'Your account has been activated. You can start earning!' : 'Top up balance for work'}
                        </Typography.Paragraph>
                    </Row>
                    <Row justify={'space-between'} style={{alignItems: 'center', marginTop: 10}}>
                        <Typography.Paragraph>
                            Balance
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            ${balance}
                        </Typography.Title>
                    </Row>
                    <Row justify={'space-between'} style={{alignItems: 'center', marginTop: 10}}>
                        <Typography.Paragraph>
                            Hold
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            ${hold}
                        </Typography.Title>
                    </Row>
                    <Row style={{marginTop: 20}}>
                        <Form style={{width: '100%'}} onFinish={onFinishBalanceFormHandler}>
                            <Row style={{alignItems: 'flex-start'}}>
                                <Form.Item hasFeedback rules={VALIDATION_CONFIG.balance} name={'amount'}
                                           style={{width: '30%'}}>
                                    <InputNumber placeholder={'10'} prefix={'$'}/>
                                </Form.Item>
                                <Form.Item style={{width: '70%'}}>
                                    <Button loading={fetchingCreateInvoice} className={'font-bold'} htmlType={'submit'}>
                                        Top up
                                    </Button>
                                </Form.Item>
                            </Row>
                        </Form>
                    </Row>
                    {
                        payments.length ?
                            <>
                                <Row justify={'space-between'} style={{marginTop: 30}}>
                                    <Row style={{width: '100%', alignItems: 'center'}} justify={'space-between'}>
                                        <Typography.Title style={{marginBottom: 0}} level={3}>
                                            Last transactions
                                        </Typography.Title>
                                        <Button loading={fetchingGetUserInfo}
                                                type={"primary"}
                                                style={{width: '30%'}}
                                                onClick={() => fetchGetUserInfo()}
                                                size={"small"}>
                                            Update
                                        </Button>
                                    </Row>
                                    <Typography.Paragraph style={{fontSize: 12}}>
                                        Last bitcoinpay transactions
                                    </Typography.Paragraph>
                                </Row>
                                <Row justify={'space-between'}>
                                    {payments.map(({btcPayId}) =>
                                        <Card style={{width: '100%'}} size={'small'}>
                                            <a className={'font-bold'}
                                               style={{textDecoration: 'underline', marginBottom: 5}}
                                               target="_blank"
                                               href={`https://btcpay0.voltageapp.io/i/${btcPayId}`}
                                            >
                                                btcpayserver/{btcPayId}
                                            </a>
                                        </Card>
                                    )}
                                </Row>
                            </> : null
                    }
                </>
            }
            <Row style={{marginTop: 30}}>
                <Typography.Title style={{marginBottom: 0}} level={3}>
                    FAQ
                </Typography.Title>
                <Typography.Paragraph style={{fontSize: 12, width: '100%'}}>
                    Answers to common questions
                </Typography.Paragraph>
            </Row>
            <Row justify={'start'}>
                <Col style={{marginBottom: 5}} span={24}>
                    <Card style={{width: '100%'}} size={'small'}>
                        <Link style={{textDecoration: 'underline'}} to={ROUTES.COURIER_FAQ}>
                            {'How it works for a courier?'}
                        </Link>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card style={{width: '100%'}} size={'small'}>
                        <Link style={{textDecoration: 'underline'}} to={ROUTES.CUSTOMER_FAQ}>
                            {'How it works for a customer?'}
                        </Link>
                    </Card>
                </Col>
            </Row>
            <Row style={{marginTop: 30, marginBottom: 30}}>
                <Button size={'large'} loading={fetchingLogout} type={'primary'} onClick={onClickLogoutButton}>
                    Logout
                </Button>
            </Row>
            <Row justify={'center'}>
                <Typography.Paragraph style={{marginBottom: 20, textDecoration: "underline"}}
                                      onClick={() => setVisibleModalSupport(true)}>
                    Support
                </Typography.Paragraph>
            </Row>
        </>
    );
};
