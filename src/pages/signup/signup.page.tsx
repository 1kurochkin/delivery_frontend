import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
// @ts-ignore
import ReCAPTCHA, {ReCAPTCHAProps} from "react-google-recaptcha";
import {Button, Carousel, Col, Form, Input, notification, Row, Select} from "antd";
import './signup.page.style.scss';
import {ROUTES} from "../../configs/app.constants";
import {CarouselRef} from "antd/lib/carousel";
import {validation} from "../../tools/validation";
import {useLazyGetCodeQuery, useSignupMutation} from "../../store/reducers/backend/backend.api";
import {useForm} from "antd/es/form/Form";
import Title from 'antd/lib/typography/Title';
import {FormFinishInfo} from "rc-field-form/lib/FormContext";
import {FieldData} from "rc-field-form/lib/interface";
import {batch} from "react-redux";
import {useActions} from "../../hooks/useActions";
import {UserRoleEnum} from "../../store/reducers/backend/backend.api.types";

export function SignupPage() {

    const navigate = useNavigate();
    const {setAuth} = useActions();
    const [signupForm] = useForm();
    const [verificationForm] = useForm();

    const [currentSlide, setCurrentSlide] = useState(0)
    const carouselRef = useRef<CarouselRef>(null)

    //----REQUESTS----//
    const [
        fetchSignup,
        {isLoading: fetchingSignup, error: error2, data: signupData}
    ] = useSignupMutation()
    const {data: {message: errorSignup = undefined} = {}} = error2 as any || {};
    useEffect(() => {
        if (signupData?.sid) {
            navigate(ROUTES.MAIN_PAGE)
        }
    }, [signupData])

    const [
        fetchGetCode,
        {isFetching: fetchingGetCode, error: error3, data: getCodeData}
    ] = useLazyGetCodeQuery()
    const {data: {message: errorGetCode = undefined} = {}} = error3 as any || {};

    //--------CATCH-ERRORS------//
    useEffect(() => {
        if (errorGetCode || errorSignup) {
            if(errorGetCode) carouselRef?.current?.prev()
            notification.error({message: errorGetCode || errorSignup});
        }
    }, [errorGetCode, errorSignup])
    //-------------------------//

    const onFinishFormHandler = (name: 'signupForm' | 'verificationForm' | string, {forms}: FormFinishInfo) => {
        if (name === 'signupForm') {
            console.log(signupForm.getFieldsValue(), 'PHONE')
            fetchGetCode(signupForm.getFieldValue('phone'));
            notification.success({message: 'We have sent code to your phone'});
            carouselRef?.current?.next()
        }
        if (name === 'verificationForm') {
            fetchSignup({
                data: signupForm.getFieldsValue(),
                code: verificationForm.getFieldValue('code')
            });
        }
    }

    const onClickBackBtn = () => {
        carouselRef?.current?.prev()
    }

    return (
        <div className={'signup-page container'}>
            <Row justify={'start'}>
                <Col>
                    <Title>Sign Up</Title>
                </Col>
            </Row>
            <Form.Provider onFormFinish={onFinishFormHandler}>
                <Carousel afterChange={setCurrentSlide} ref={carouselRef} dots={false}>
                    <div>
                        <Form form={signupForm} name={'signupForm'} layout="horizontal">
                            <Row justify={'center'}>
                                <Col span={7}>
                                    <Form.Item
                                        colon={false}
                                        name={'role'}
                                        rules={[{ required: true, message: '' }]}
                                        label="I'm a">
                                        <Select value={UserRoleEnum.Customer}>
                                            {[UserRoleEnum.Courier, UserRoleEnum.Customer].map(el =>
                                                <Select.Option value={el}>{el}</Select.Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={8}>
                                    <Form.Item
                                        colon={false}
                                        label={'Name'}
                                        name={'name'}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Input placeholder={'Pablo'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify={'center'}>
                                <Col span={7}>
                                    <Form.Item
                                        label={'Phone'}
                                        colon={false}
                                        rules={[{ required: true, message: '' }]}
                                        name={'phone'}
                                    >
                                        <Input placeholder={'19008003020'}/>
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={8}>
                                    <Form.Item wrapperCol={{span: 24}}>
                                        <Button loading={fetchingGetCode} htmlType={'submit'}>Next</Button>
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
                        <Form form={verificationForm} name={'verificationForm'} layout={'horizontal'}>
                            <Row justify={'center'}>
                                <Col span={7}>
                                    <Form.Item
                                        rules={[{ required: true, message: '' }]}
                                        label={'Code'}
                                        colon={false}
                                        name={'code'}
                                    >
                                        <Input placeholder={'Verification code'}/>
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={9}>
                                    <Form.Item wrapperCol={{span: 24}}>
                                        <Button loading={fetchingSignup} htmlType={'submit'}>{`Sign up`}</Button>
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
                            <Button onClick={() => navigate(ROUTES.AUTH.LOGIN_PAGE)}>I have an account</Button> :
                            <Button onClick={onClickBackBtn}>Back</Button>
                    }
                </Col>
            </Row>

        </div>
    );
};


