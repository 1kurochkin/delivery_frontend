import {AutoComplete, Button, Col, Form, Input, Modal, notification} from "antd";
import React, {useEffect, useState} from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import {SelectHandler} from "rc-select/lib/Select";
import {FormFinishInfo} from "rc-field-form/lib/FormContext";
import {UserRoleEnum} from "../../store/reducers/backend/backend.api.types";
import {useContactUsMutation} from "../../store/reducers/backend/backend.api";
import {useForm} from "antd/es/form/Form";

type ModalSupportProps = {
    // onChange: (value: string) => void;
    // onSelect: (value: string) => void;
}

export const useModalSupport = () => {

    const [visible, setVisible] = useState(false);
    const [supportForm] = useForm();

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
        if (errorContactUs) {
            notification.error({message: errorContactUs});
        }
    }, [errorContactUs])
    //-------------------------//
    const onFinishFormHandler = (values: any) => {
        fetchContactUs(values);
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
                onCancel={onCancelModalHandler}
                footer={null}
            >
                <Form onFinish={onFinishFormHandler}
                      name={'supportForm'}
                      wrapperCol={{span: 12}}
                      layout="horizontal"
                >
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
        ),
        setVisible,
    }
};