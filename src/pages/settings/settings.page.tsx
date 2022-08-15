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
import {useActions} from "../../hooks/useActions";
import {batch} from "react-redux";
import {useForm} from "antd/es/form/Form";
import {FieldData} from "rc-field-form/lib/interface";

export function SettingsPage() {
    const {setSettingsField} = useActions()
    const [settingsForm] = useForm()
    const settingsReduxState = useAppSelector(({settings}) => settings)
    const fields = Object
        .entries(settingsReduxState)
        .map(([key, value]) => ({name: key, value}))
    console.log(fields)
    const {role, id, phone, name} = settingsReduxState;
    const {modal, setVisible} = useModalSupport()

    const [
        fetchUpdateCustomerSettings,
        {error: error1, isLoading: fetchingUpdateCourierSettings, data: updateCustomerData}
    ] = useUpdateCustomerSettingsMutation();
    const {data: {message: errorUpdateCourierSettings = undefined} = {}} = error1 as any || {};
    const [
        fetchUpdateCourierSettings,
        {error: error2, isLoading: fetchingUpdateCustomerSettings, data: updateCourierData}
    ] = useUpdateCourierSettingsMutation();
    const {data: {message: errorUpdateCustomerSettings = undefined} = {}} = error2 as any || {};
    useEffect(() => {
        if(updateCustomerData || updateCustomerData) {
            notification.success({message: 'Your settings updated successful!'})
        }
    }, [updateCustomerData, updateCourierData])

    //--------CATCH-ERRORS------//
    useEffect(() => {
        if (errorUpdateCourierSettings || errorUpdateCustomerSettings) {
            notification.error({
                message: errorUpdateCourierSettings || errorUpdateCustomerSettings
            });
        }
    }, [errorUpdateCustomerSettings, errorUpdateCourierSettings])
    //-------------------------//

    const onFinishFormHandler = (values: any) => {
        role === UserRoleEnum.Customer ?
            fetchUpdateCustomerSettings(values) :
            fetchUpdateCourierSettings(values)
    }

    const onValuesChangeHandler = (values: any) => {
        console.log('onValuesChangeHandler')
        for (const key in values) {
            setSettingsField({field: key, value: values[key]})
        }
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
                    <Form form={settingsForm} onFinish={onFinishFormHandler}
                          onValuesChange={onValuesChangeHandler}
                          initialValues={settingsReduxState}
                          // fields={fields}
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
