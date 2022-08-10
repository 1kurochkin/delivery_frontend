import React, {useEffect} from 'react';
import Title from "antd/lib/typography/Title";
import {Button, Col, Divider, Form, Input, notification, Row, Space, Typography} from "antd";
import {useAppSelector} from "../../hooks/useAppSelector";
import {
    useUpdateCourierSettingsMutation,
    useUpdateCustomerSettingsMutation
} from "../../store/reducers/backend/backend.api";
import {UserRoleEnum} from "../../store/reducers/backend/backend.api.types";
import {useModalSupport} from "../../components/modal/modal.support.component";

export function SettingsPage() {
    const {role, phone, name} = useAppSelector(({settings}) => settings)
    const {modal, setVisible} = useModalSupport()

    const [
        fetchUpdateCourierSettings,
        {error: error1, isLoading: fetchingUpdateCourierSettings}
    ] = useUpdateCustomerSettingsMutation();
    const {data: {message: errorUpdateCourierSettings = undefined} = {}} = error1 as any || {};
    const [
        fetchUpdateCustomerSettings,
        {error: error2, isLoading: fetchingUpdateCustomerSettings}
    ] = useUpdateCourierSettingsMutation();
    const {data: {message: errorUpdateCustomerSettings = undefined} = {}} = error2 as any || {};

    //--------CATCH-ERRORS------//
    useEffect(() => {
        if (errorUpdateCourierSettings || errorUpdateCustomerSettings) {
            notification.error({
                message: errorUpdateCourierSettings || errorUpdateCustomerSettings});
        }
    }, [errorUpdateCustomerSettings, errorUpdateCourierSettings])
    //-------------------------//

    const onFinishFormHandler = (values: any) => {
        role === UserRoleEnum.Customer ?
            fetchUpdateCustomerSettings(values) :
            fetchUpdateCourierSettings(values)

    }

    // const onCancelModalHandler = () => {
    //     setVisible(false)
    //     supportForm.resetFields()
    // }

    return (
        <div style={{display: 'flex', alignItems: 'center'}} className={'container'}>
            {modal}
            <Space size={50} direction={'vertical'}>
                <Row justify={'start'}>
                    <Title>Settings</Title>
                </Row>
                <Row justify={'space-evenly'}>
                    <Form onFinish={onFinishFormHandler}
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
                                <Input disabled value={role}/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                wrapperCol={{span: 24}}
                                colon={false}
                                label={'Phone'}
                                name={'phone'}
                            >
                                <Input disabled value={phone}/>
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
                                <Input value={name}/>
                            </Form.Item>
                        </Col>
                        {/*</Row>*/}
                        {/*<Row justify={'center'}>*/}
                        <Col>
                            <Form.Item wrapperCol={{span: 24}}>
                                <Button
                                    loading={fetchingUpdateCourierSettings || fetchingUpdateCustomerSettings}
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

        </div>
    );
};
