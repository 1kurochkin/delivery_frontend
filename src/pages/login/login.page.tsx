import React, {useEffect, useRef, useState} from 'react';
import {Button, Carousel, Col, Form, Input, notification, Row, Select} from "antd";
import './login.page.style.scss';
// import {Button} from "../../components/button/button.component";
import {ROUTES} from "../../configs/app.constants";
import {useNavigate} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import {useLazyExistUserQuery, useLazyGetCodeQuery, useLoginMutation} from '../../store/reducers/backend/backend.api';
import Title from "antd/lib/typography/Title";
import {CarouselRef} from "antd/lib/carousel";
import {FormFinishInfo} from "rc-field-form/lib/FormContext";
import {useActions} from "../../hooks/useActions";
import {batch} from "react-redux";

export function LoginPage() {

    const carouselRef = useRef<CarouselRef>(null)
    const [form] = useForm();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0)
    const {setAuth, setCookies} = useActions()



    //----REQUESTS----//
    const [
        fetchExistUser,
        {isFetching: fetchingExistUser, error: error1, data: existUserData},
    ] = useLazyExistUserQuery()
    const {data: {message: errorExistUser = undefined} = {}} = error1 as any || {};
    useEffect(() => {
        if(existUserData?.exist) {
            fetchGetCode(form.getFieldValue('phone'));
            carouselRef?.current?.next();
        }
    }, [existUserData])

    const [
        fetchGetCode,
        {error: error2, isFetching: fetchingGetCode}
    ] = useLazyGetCodeQuery()
    const {data: {message: errorGetCode = undefined} = {}} = error2 as any || {};

    const [
        fetchLogin,
        {data: loginData, error: error3, isLoading: fetchingLogin}
    ] = useLoginMutation()
    const {data: {message: errorLogin = undefined} = {}} = error3 as any || {};
    useEffect(() => {
        if (loginData?.sid) {
            batch(() => {
                setCookies({name: 'sid', value: loginData?.sid})
                setAuth(true)
            });
            navigate(ROUTES.MAIN_PAGE)
        }
    }, [loginData])

    //--------CATCH-ERRORS------//
    useEffect(() => {
        if (errorExistUser || errorGetCode || errorLogin) {
            console.log('ERROR')
            notification.error({message: errorExistUser || errorGetCode});
        }
    }, [errorExistUser, errorGetCode, errorLogin])
    //-------------------------//

    const onFinishFormHandler = (name: string, {forms}: FormFinishInfo) => {
        const currentValues = forms[name].getFieldsValue()
        if (name === '0') {
            const phone = forms[0].getFieldValue('phone')
            fetchExistUser(phone)
        }
        if (name === '1') {
            fetchLogin({
                ...forms[0].getFieldsValue(),
                code: currentValues.code,
            });
        }
    }

    const onClickBackBtn = () => {
        carouselRef?.current?.prev()
    }

    return (
        <div className={'login-page container'}>
            <Row justify={'start'}>
                <Col>
                    <Title>Login</Title>
                </Col>
            </Row>
            <Form.Provider onFormFinish={onFinishFormHandler}>
                <Carousel afterChange={setCurrentSlide} ref={carouselRef} dots={false}>
                    <div>
                        <Form form={form} name={'0'}>
                            <Row justify={'center'}>
                                <Col span={7}>
                                    <Form.Item
                                        rules={[{ required: true, message: '' }]}
                                        colon={false}
                                        name={'role'}
                                        label="I'm a">
                                        <Select value={'Customer'}>
                                            <Select.Option value="courier">Courier</Select.Option>
                                            <Select.Option value="customer">Customer</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={8}>
                                    <Form.Item
                                        rules={[{ required: true, message: '' }]}
                                        label={'Phone'}
                                        colon={false}
                                        wrapperCol={{span: 24}}
                                        name={'phone'}
                                    >
                                        <Input placeholder={'19008003020'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify={'center'}>
                                <Col span={16}>
                                    <Form.Item wrapperCol={{span: 24}}>
                                        <Button loading={fetchingExistUser || fetchingGetCode} htmlType={'submit'}>
                                            Get code
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div>
                        <Row justify={'center'} style={{marginBottom: 30}}>
                            <Col>
                                <Title level={3}>We sent verification code to your phone number</Title>
                            </Col>
                        </Row>

                        <Form name={'1'} layout={'horizontal'}>
                            <Row justify={'center'}>
                                <Col span={7}>
                                    <Form.Item
                                        label={'Code'}
                                        colon={false}
                                        wrapperCol={{span: 24}}
                                        name={'code'}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Input placeholder={'123456'}/>
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={9}>
                                    <Form.Item wrapperCol={{span: 24}}>
                                        <Button loading={fetchingLogin} htmlType={'submit'}>{`Login`}</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Carousel>
            </Form.Provider>
            <Row justify={'center'}>
                <Col span={9}>
                    {
                        currentSlide === 0 ?
                            <Button onClick={() => navigate(ROUTES.AUTH.SIGNUP_PAGE)}>I dont have an account</Button> :
                            <Button onClick={onClickBackBtn}>Back</Button>
                    }
                </Col>
            </Row>
        </div>
    );
};
