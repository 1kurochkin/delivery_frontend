import React, {useEffect, useState} from 'react';
import Title from "antd/lib/typography/Title";
import {Button, Col, Divider, Form, Input, Modal, notification, Row, Space, Typography} from "antd";
import {useForm} from "antd/es/form/Form";
import {useAppSelector} from "../../hooks/useAppSelector";
import {
    useContactUsMutation,
    useUpdateCourierSettingsMutation,
    useUpdateCustomerSettingsMutation
} from "../../store/reducers/backend/backend.api";
import {UserRoleEnum} from "../../store/reducers/backend/backend.api.types";
import {FormFinishInfo} from "rc-field-form/lib/FormContext";

export function SettingsPage() {
    const [supportForm] = useForm();
    const {role, phone, name} = useAppSelector(({settings}) => settings)
    const [visible, setVisible] = useState(false);

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
    const [
        fetchContactUs,
        {error: error3, isLoading: fetchingContactUs, data: contactUsData}
    ] = useContactUsMutation();
    const {data: {message: errorContactUs = undefined} = {}} = error3 as any || {};

    useEffect(() => {
        setVisible(false);
    }, [contactUsData])

    //--------CATCH-ERRORS------//
    useEffect(() => {
        if (errorUpdateCourierSettings || errorUpdateCustomerSettings || errorContactUs) {
            notification.error({
                message:
                    errorUpdateCourierSettings ||
                    errorUpdateCustomerSettings ||
                    errorContactUs
            });
        }
    }, [errorUpdateCustomerSettings, errorUpdateCourierSettings, errorContactUs])
    //-------------------------//

    const onFinishFormHandler = (name: string, {forms}: FormFinishInfo) => {
        const values = forms[name].getFieldsValue()
        if(name === 'supportForm') {
            fetchContactUs(values);
        }
        if(name === 'settingsForm') {
            role === UserRoleEnum.Customer ?
                fetchUpdateCustomerSettings(values) :
                fetchUpdateCourierSettings(values)
        }

    }

    const onCancelModalHandler = () => {
        setVisible(false)
        supportForm.resetFields()
    }

    return (
        <div style={{display: 'flex', alignItems: 'center'}} className={'container'}>
            <Form.Provider onFormFinish={onFinishFormHandler}>
                <Modal
                    title="Support"
                    visible={visible}
                    onCancel={onCancelModalHandler}
                    footer={null}
                >
                    <Form name={'supportForm'} wrapperCol={{span: 12}} layout="horizontal">
                        <Col>
                            <Form.Item
                                rules={[{required: true, message: ''}]}
                                wrapperCol={{span: 24}}
                                colon={false}
                                label={'Your email'}
                                name={'email'}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                wrapperCol={{span: 24}}
                                rules={[{required: true, message: ''}]}
                                colon={false}
                                label={'Subject'}
                                name={'subject'}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                rules={[{required: true, message: ''}]}
                                wrapperCol={{span: 24}}
                                colon={false}
                                label={'Text'}
                                name={'text'}
                            >
                                <Input.TextArea rows={4}/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Button htmlType={'submit'} loading={fetchingContactUs}>
                                Send
                            </Button>
                        </Col>
                    </Form>
                </Modal>
                <Space size={50} direction={'vertical'}>
                    <Row justify={'start'}>
                        <Title>Settings</Title>
                    </Row>
                    <Row justify={'space-evenly'}>
                        <Form form={supportForm} wrapperCol={{span: 12}}
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
                            {/*</Row>*/}
                            {/*<Row justify={'center'}>*/}
                            <Col>
                                <Form.Item
                                    wrapperCol={{span: 24}}
                                    colon={false}
                                    label={'Phone'}
                                    name={'phone'}
                                    // wrapperCol={{span: 24}}
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
            </Form.Provider>
            {/*<Row justify={'center'}>*/}

            {/*</Row>*/}
        </div>
    );
};
