import {Button, Col, Form, Input, Modal, notification, Row} from "antd";
import React, {useEffect, useState} from "react";
import {useContactUsMutation} from "../store/reducers/backend/backend.api";
import {useForm} from "antd/es/form/Form";

export const useModalSupport = () => {

    const [visible, setVisible] = useState(false);
    const [supportForm] = useForm();

    const [
        fetchContactUs,
        {error: error3, isLoading: fetchingContactUs}
    ] = useContactUsMutation();
    const {data: {message: errorContactUs = undefined} = {}} = error3 as any || {};

    const onFinishFormHandler = async () => {
        try {
            await supportForm.validateFields()
            console.log(supportForm.getFieldsValue())
            fetchContactUs(supportForm.getFieldsValue())
                .unwrap()
                .then(() => {
                    setVisible(false);
                    notification.success({message: 'We will contact you within 24 hours'})
                    supportForm.resetFields();
                }).catch(() => {
                notification.error({message: errorContactUs});
            })
        } catch (e) {
            return;
        }
    }
    const onCancelModalHandler = () => {
        setVisible(false)
        supportForm.resetFields()
    }

    return {
        modal: (
            <Modal
                title="Support"
                visible={visible}
                confirmLoading={fetchingContactUs}
                onCancel={onCancelModalHandler}
                onOk={onFinishFormHandler}
                footer={
                    <Row justify={"space-around"}>
                        <Col span={10}>
                            <Button style={{backgroundColor: 'red'}} onClick={onCancelModalHandler}>Cancel</Button>
                        </Col>
                        <Col span={10}>
                            <Button onClick={onFinishFormHandler}>Send</Button>
                        </Col>
                    </Row>
                }
            >
                <Form form={supportForm} name={'supportForm'} wrapperCol={{span: 12}} layout="horizontal">
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
                            label={'Your Message'}
                            name={'text'}
                        >
                            <Input.TextArea rows={4}/>
                        </Form.Item>
                    </Col>
                </Form>
            </Modal>
        ),
        setVisible,
    }
};