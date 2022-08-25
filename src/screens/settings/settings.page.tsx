import React, {useEffect} from 'react';
import Title from "antd/lib/typography/Title";
import {Button, Col, Divider, Form, Input, Row, Space, Typography} from "antd";
import {useAppSelector} from "../../hooks/useAppSelector";
import {useModalSupport} from "../../components/modal/modal.support.component";
import {useForm} from "antd/es/form/Form";
import {useUpdateUserSettingsMutation} from "../../store/reducers/backend/backend.api";

export function SettingsPage() {
    const [settingsForm] = useForm()
    const settingsReduxState = useAppSelector(({settings}) => settings)
    const {modal, setVisible} = useModalSupport()

    useEffect(() => {
        settingsForm.setFieldsValue(settingsReduxState);
    }, [settingsReduxState])

    const [
        fetchUpdateUserSettings,
        {isLoading: fetchingUpdateUserSettings}
    ] = useUpdateUserSettingsMutation();

    const onFinishFormHandler = (values: any) => {
        fetchUpdateUserSettings(values);
    }


    return (
        <div style={{display: 'flex', alignItems: 'center'}} className={'container'}>
            {modal}
            <Space size={50} direction={'vertical'}>
                <Row justify={'start'}>
                    <Title>Settings</Title>
                </Row>
                <Row justify={'space-evenly'}>
                    <Form form={settingsForm} onFinish={onFinishFormHandler}
                          wrapperCol={{span: 12}}
                          name={'settingsForm'}
                          layout="horizontal">
                        <Col>
                            <Form.Item
                                wrapperCol={{span: 24}}
                                colon={false}
                                label={'Im the'}
                                name={'role'}
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                wrapperCol={{span: 24}}
                                colon={false}
                                label={'Phone'}
                                name={'phone'}
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        {/*</Row>*/}
                        {/*<Row justify={'center'}>*/}
                        <Col>
                            <Form.Item
                                wrapperCol={{span: 24}}
                                colon={false}
                                label={'Name'}
                                name={'name'}
                                // wrapperCol={{span: 24}}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        {/*</Row>*/}
                        {/*<Row justify={'center'}>*/}
                        <Col>
                            <Form.Item wrapperCol={{span: 24}}>
                                <Button
                                    loading={fetchingUpdateUserSettings}
                                    htmlType={'submit'}
                                >Save
                                </Button>
                            </Form.Item>
                        </Col>
                        {/*</Row>*/}
                    </Form>
                    <Col style={{display: "flex", justifyContent: 'center'}} span={1}>
                        <Divider type={'vertical'} style={{height: "100%", borderColor: 'black', borderWidth: 3}}/>
                    </Col>
                    <Col span={7}>
                        <Typography.Paragraph>
                            If you would like to change some settings or you have any problems,
                            please contact technical support and we will respond to you within 24 hours
                        </Typography.Paragraph>
                        <Button onClick={() => setVisible(true)}>Support</Button>
                    </Col>
                </Row>
            </Space>
            <form method="POST" action="https://mainnet.demo.btcpayserver.org/apps/2CBLwWjCHE8bV3c3Lb9TPr2NusZN/pos">
                <input type="hidden" name="email" value="customer@example.com" />
                <input type="hidden" name="orderId" value="CustomOrderId" />
                {/*<input type="hidden" name="notificationUrl" value="https://example.com/callbacks" />*/}
                {/*<input type="hidden" name="redirectUrl" value="https://example.com/thanksyou" />*/}
                <button type="submit" name="choiceKey" value="working access">Buy now</button>
            </form>
        </div>
    );
};
