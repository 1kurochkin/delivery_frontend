import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
// @ts-ignore
import ReCAPTCHA, {ReCAPTCHAProps} from "react-google-recaptcha";
import {Button, Carousel, Col, Form, Input, notification, Row, Select} from "antd";
import './signup.page.style.scss';
import {ROUTES} from "../../configs/constants";
import {CarouselRef} from "antd/lib/carousel";
import {validation} from "../../tools/validation";
import {useLazyGetCodeQuery, useSignupMutation} from "../../store/reducers/backend/backend.api";
import {useForm} from "antd/es/form/Form";
import Title from 'antd/lib/typography/Title';
import {FormFinishInfo} from "rc-field-form/lib/FormContext";
import {FieldData} from "rc-field-form/lib/interface";
import {batch} from "react-redux";
import {useActions} from "../../hooks/useActions";

export function SignupPage() {
    const carouselRef = useRef<CarouselRef>(null)
    const navigate = useNavigate();
    const {setCookies, setAuth} = useActions();
    // const [form] = useForm()
    // const captchaRef = useRef<ReCAPTCHAProps>(null)
    const [{name, phone, code}, setFormState] = useState({
        name: {isError: false},
        // lastName: {isError: false},
        // birth: {isError: false},
        phone: {isError: false},
        // captcha: {isError: false},
        code: {isError: false},
    })
    const [currentSlide, setCurrentSlide] = useState(0)
    //----REQUESTS----//

    const [
        fetchSignup,
        {isLoading: fetchingSignup, error: error2, data: signupData}
    ] = useSignupMutation()
    const {data: {message: errorSignup = undefined} = {}} = error2 as any || {};
    useEffect(() => {
        if (signupData?.sid) {
            batch(() => {
                setCookies({name: 'sid', value: signupData?.sid})
                setAuth(true)
            });
            navigate(ROUTES.SETTINGS_PAGE)
        }
    }, [signupData])

    const [
        fetchGetCode,
        {isFetching: fetchingGetCode, error: error3}
    ] = useLazyGetCodeQuery()
    const {data: {message: errorGetCode = undefined} = {}} = error3 as any || {};

    //--------CATCH-ERRORS------//
    useEffect(() => {
        if (errorGetCode || errorSignup) {
            notification.error({message: errorGetCode || errorSignup});
        }
    }, [errorGetCode, errorSignup])
    //-------------------------//

    const setFormStateHandler = (field: string, isError: boolean) => {
        setFormState(
            (prev) => ({...prev, [field]: {isError}})
        )
    }

    const checkBadFields = (values: any) => {
        const badFields = [];
        for (const [key, value] of Object.entries(values)) {
            const {isValid} = validation(key, value)
            if (!isValid) badFields.push(key);
        }
        return badFields;
    }

    const setErrorsFromBadFields = (badFields: Array<string>) => {
        for (const badField of badFields) {
            setFormStateHandler(badField, true);
        }
    }

    const onFinishFormHandler = (name: string, {forms}: FormFinishInfo) => {
        const currentValues = forms[name].getFieldsValue()
        const badFields = checkBadFields(currentValues);
        if (badFields.length) {
            setErrorsFromBadFields(badFields); return;
        }
        if (name === '0') {
            const phone = currentValues['phone']
            fetchGetCode(phone);
            carouselRef?.current?.next()
        }
        if (name === '1') {
            fetchSignup({
                data: forms[0].getFieldsValue(),
                code: currentValues.code
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
                        <Form name={'0'} layout="horizontal">
                            <Row justify={'center'}>
                                <Col span={7}>
                                    <Form.Item
                                        wrapperCol={{span: 24}}
                                        colon={false}
                                        name={'role'}
                                        rules={[{ required: true, message: '' }]}
                                        label="I'm a">
                                        <Select value={'Customer'}>
                                            <Select.Option value="courier">Courier</Select.Option>
                                            <Select.Option value="customer">Customer</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={8}>
                                    <Form.Item
                                        colon={false}
                                        label={'Name'}
                                        name={'name'}
                                        rules={[{ required: true, message: '' }]}
                                        wrapperCol={{span: 24}}
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
                                        wrapperCol={{span: 24}}
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

                        <Form name={'1'} layout={'horizontal'}>
                            <Row justify={'center'}>
                                <Col span={7}>
                                    <Form.Item
                                        rules={[{ required: true, message: '' }]}
                                        label={'Code'}
                                        colon={false}
                                        wrapperCol={{span: 24}}
                                        name={'code'}
                                    >
                                        <Input placeholder={'123456'}/>
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
                            <Button onClick={() => navigate(ROUTES.LOGIN_PAGE)}>I have an account</Button> :
                            <Button onClick={onClickBackBtn}>Back</Button>
                    }
                </Col>
            </Row>

        </div>
    );
};


