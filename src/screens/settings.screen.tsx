import React, {useEffect} from 'react';
import {useAppSelector} from "../hooks/useAppSelector";
import {useModalSupport} from "../components/modal/modal.support.component";
import {useForm} from "antd/es/form/Form";
import {useLogoutMutation, useUpdateUserSettingsMutation} from "../store/reducers/backend/backend.api";
import {Badge, Button, Form, Input, InputNumber, Row, Typography} from "antd";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../configs/app.constants";

export function SettingsScreen() {
    const [settingsForm] = useForm()
    const settingsReduxState = useAppSelector(({settings}) => settings)
    const {modal, setVisible} = useModalSupport()
    const IS_USER_ROLE_CUSTOMER = settingsReduxState.role === UserRoleEnum.Customer
    const navigate = useNavigate();
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
            <Row justify={'space-between'} style={{marginBottom: 20}}>
                <Typography.Title level={1} style={{textAlign: 'center'}}>
                    Settings
                </Typography.Title>
            </Row>
            <Row>
                <Typography.Title level={3}>
                    Your profile
                </Typography.Title>
            </Row>
            <Row style={{marginBottom: 40}}>
                <Form style={{width: '100%'}} form={settingsForm} onFinish={onFinishFormHandler}>
                    <Form.Item style={{width: '100%'}} colon={false} label={'User role'} name={'role'}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item style={{width: '100%'}} colon={false} label={'Your name'} name={'name'}>
                        <Input placeholder={'Pablo Escobar'}/>
                    </Form.Item>
                    <Form.Item style={{width: '100%', marginBottom: 20}} colon={false} label={'Your phone'} name={'phone'}>
                        <InputNumber style={{width: '100%'}} prefix={'+'} placeholder={'000000'}/>
                    </Form.Item>
                    <Form.Item style={{width: '100%'}}>
                        <Button loading={fetchingUpdateUserSettings} htmlType={'submit'}>Save</Button>
                    </Form.Item>
                </Form>
            </Row>
            {
                !IS_USER_ROLE_CUSTOMER &&
                <Row style={{marginBottom: 10}}>
                    <Badge size="default" color={"red"} dot={true} offset={[10, 15]}>
                        <Typography.Title level={3}>
                            Your wallet
                        </Typography.Title>
                    </Badge>
                </Row>
            }
            <Row>
                <Button style={{marginBottom: 20}} size={'large'} onClick={() => setVisibleModalSupport(true)}>
                    Support
                </Button>
                <Button loading={fetchingLogout} type={'primary'} onClick={onClickLogoutButton}>
                    Logout
                </Button>
            </Row>
        </>
        // <div style={{display: 'flex', alignItems: 'center'}} className={'container'}>
        //     {modal}
        //     <Space size={50} direction={'vertical'}>
        //         <Row justify={'start'}>
        //             <Title>Settings</Title>
        //         </Row>
        //         <Row justify={'space-evenly'}>
        //             <Form form={settingsForm} onFinish={onFinishFormHandler}
        //                   wrapperCol={{span: 12}}
        //                   name={'settingsForm'}
        //                   layout="horizontal">
        //                 <Col>
        //                     <Form.Item
        //                         wrapperCol={{span: 24}}
        //                         colon={false}
        //                         label={'Im the'}
        //                         name={'role'}
        //                     >
        //                         <Input disabled/>
        //                     </Form.Item>
        //                 </Col>
        //                 <Col>
        //                     <Form.Item
        //                         wrapperCol={{span: 24}}
        //                         colon={false}
        //                         label={'Phone'}
        //                         name={'phone'}
        //                     >
        //                         <Input disabled/>
        //                     </Form.Item>
        //                 </Col>
        //                 {/*</Row>*/}
        //                 {/*<Row justify={'center'}>*/}
        //                 <Col>
        //                     <Form.Item
        //                         wrapperCol={{span: 24}}
        //                         colon={false}
        //                         label={'Name'}
        //                         name={'name'}
        //                         // wrapperCol={{span: 24}}
        //                     >
        //                         <Input/>
        //                     </Form.Item>
        //                 </Col>
        //                 {/*</Row>*/}
        //                 {/*<Row justify={'center'}>*/}
        //                 <Col>
        //                     <Form.Item wrapperCol={{span: 24}}>
        //                         <Button
        //                             loading={fetchingUpdateUserSettings}
        //                             htmlType={'submit'}
        //                         >Save
        //                         </Button>
        //                     </Form.Item>
        //                 </Col>
        //                 {/*</Row>*/}
        //             </Form>
        //             <Col style={{display: "flex", justifyContent: 'center'}} span={1}>
        //                 <Divider type={'vertical'} style={{height: "100%", borderColor: 'black', borderWidth: 3}}/>
        //             </Col>
        //             <Col span={7}>
        //                 <Typography.Paragraph>
        //                     If you would like to change some settings or you have any problems,
        //                     please contact technical support and we will respond to you within 24 hours
        //                 </Typography.Paragraph>
        //                 <Button onClick={() => setVisible(true)}>Support</Button>
        //             </Col>
        //         </Row>
        //     </Space>
        //     <form method="POST" action="https://mainnet.demo.btcpayserver.org/apps/2CBLwWjCHE8bV3c3Lb9TPr2NusZN/pos">
        //         <input type="hidden" name="email" value="customer@example.com" />
        //         <input type="hidden" name="orderId" value="CustomOrderId" />
        //         {/*<input type="hidden" name="notificationUrl" value="https://example.com/callbacks" />*/}
        //         {/*<input type="hidden" name="redirectUrl" value="https://example.com/thanksyou" />*/}
        //         <button type="submit" name="choiceKey" value="working access">Buy now</button>
        //     </form>
        // </div>
    );
};
