import React, {useEffect} from 'react';
import {useAppSelector} from "../hooks/useAppSelector";
import {useModalSupport} from "../components/modalSupport.component";
import {useForm} from "antd/es/form/Form";
import {useLogoutMutation, useUpdateUserSettingsMutation} from "../store/reducers/backend/backend.api";
import {Badge, Button, Form, Input, InputNumber, Row, Typography} from "antd";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";

export function SettingsScreen() {
    const [settingsForm] = useForm()
    const settingsReduxState = useAppSelector(({settings}) => settings)
    const {id: user_id, wallet: {value: balance = 0} = {}} = settingsReduxState || {};
    const IS_USER_ROLE_CUSTOMER = settingsReduxState.role === UserRoleEnum.Customer
    const [
        fetchLogout,
        {isLoading: fetchingLogout}
    ] = useLogoutMutation();
    const [
        fetchUpdateUserSettings,
        {isLoading: fetchingUpdateUserSettings}
    ] = useUpdateUserSettingsMutation();
    const {modal: modalSupport, setVisible: setVisibleModalSupport} = useModalSupport()

    useEffect(() => {
        settingsForm.setFieldsValue(settingsReduxState);
    }, [settingsReduxState])

    const onFinishFormHandler = (values: any) => {
        fetchUpdateUserSettings(values);
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
                <Typography.Title level={3}>
                    Your profile
                </Typography.Title>
            </Row>
            <Row>
                <Form style={{width: '100%'}} form={settingsForm} onFinish={onFinishFormHandler}>
                    <Form.Item style={{width: '100%'}} colon={false} label={'Your are'} name={'role'}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item style={{width: '100%'}} colon={false} label={'Your name'} name={'name'}>
                        <Input placeholder={'Pablo Escobar'}/>
                    </Form.Item>
                    <Form.Item style={{width: '100%', marginBottom: 20}} colon={false} label={'Your phone'} name={'phone'}>
                        <InputNumber style={{width: '100%'}} prefix={'+'} placeholder={'000000'}/>
                    </Form.Item>
                    <Form.Item style={{width: '100%'}}>
                        <Button size={'large'} loading={fetchingUpdateUserSettings} htmlType={'submit'}>Save</Button>
                    </Form.Item>
                </Form>
            </Row>
            {
                !IS_USER_ROLE_CUSTOMER &&
                    <>
                        <Row style={{marginTop: 20}}>
                            <Badge size="default" color={balance > 0 ? "green": "red"} dot={true} offset={[10, 15]}>
                                <Typography.Title level={3} style={{marginBottom: 0}}>
                                    Your wallet
                                </Typography.Title>
                            </Badge>
                            <Typography.Paragraph style={{fontSize: 12}}>
                                { balance > 0 ? 'Your account is activated, you can start working!' : 'Top up balance for work'}
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
                        <Row>
                            <form style={{width: '100%'}} method="POST" action="https://btcpay0.voltageapp.io/apps/2F54NRZLuXEYPSdWJJkaXiNhr7ra/pos">
                                <input type="hidden" name="courier_id" value={user_id} />
                                <input type="hidden" name="notificationUrl" value="https://bringa.me/api/btcpay/notification" />
                                <input type="hidden" name="redirectUrl" value="https://bringa.me/thankyou" />
                                <Button size={'large'} htmlType={'submit'}>
                                    Top up balance
                                </Button>
                            </form>
                        </Row>
                    </>

            }
            <Row style={{marginTop: 60, marginBottom: 30}}>
                <Button size={'large'} loading={fetchingLogout} type={'primary'} onClick={onClickLogoutButton}>
                    Logout
                </Button>
            </Row>
            <Row justify={'center'}>
                <Typography.Paragraph style={{marginBottom: 20, textDecoration: "underline"}} onClick={() => setVisibleModalSupport(true)}>
                    Support
                </Typography.Paragraph>
            </Row>
        </>
    );
};
