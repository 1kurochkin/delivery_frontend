import React, {useRef, useState} from 'react';
import {Button, Carousel, Form, InputNumber, notification, Row, Typography} from "antd";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import {CarouselRef} from "antd/lib/carousel";
import {useCreateOrderMutation, useLazyGetCodeQuery, useLoginMutation} from "../store/reducers/backend/backend.api";
import {ROUTES} from "../configs/app.constants";
import {OrderType, UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {UserOutlined} from "@ant-design/icons";
import {ButtonBack} from "../components/buttonBack.component";
import ReactCodeInput from 'react-verification-code-input';
import {VALIDATION_CONFIG} from "../configs/validation.config";
import {ReactComponent as Phone} from '../assets/svgs/phone.svg';

export function LoginScreen() {

    const {state} = useLocation();
    const {orderData = undefined} = (state || {}) as any;
    console.log(state, orderData, "STATE")
    const [loginForm] = useForm();
    const navigate = useNavigate();
    const {userRole: role} = useParams();
    if (role !== UserRoleEnum.Courier && role !== UserRoleEnum.Customer) {
        navigate(ROUTES.START)
    }
    const carouselRef = useRef<CarouselRef>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    //----REQUESTS----//

    const [fetchGetCode, {isFetching: fetchingGetCode}] = useLazyGetCodeQuery()
    const [fetchLogin, {isLoading: fetchingLogin}] = useLoginMutation()
    const [
        fetchCreateOrder,
        {isLoading: fetchingCreateOrder}
    ] = useCreateOrderMutation();

    // console.log(orderData, "ORDER DATA")


    const onFinishFormHandler = async () => {
        console.log('onFinishFormHandler')
        const {phone, code} = loginForm.getFieldsValue();
        try {
            if (currentSlide === 0) {
                await loginForm.validateFields(['phone']);
                fetchGetCode(phone);
                carouselRef?.current?.goTo(1);
            }
            if (currentSlide === 1) {
                await loginForm.validateFields(['code']);
                // @ts-ignore
                fetchLogin({data: {phone, role}, code}).unwrap().then(data => {
                    if (orderData) {
                        fetchCreateOrder(JSON.parse(orderData))
                    }
                })
            }
        } catch {}
    }

    const onClickButtonBackHandler = () => {
        if (currentSlide === 0) navigate(-1);
        if (currentSlide === 1) carouselRef?.current?.prev();
    }
    const sliderViewConfig = [
        {
            title: 'Login',
            paragraph: (
                <Typography.Paragraph>
                    Please enter <span className={'font-bold'}>your phone number</span> so we can verify you
                </Typography.Paragraph>
            ),
            formItem: {
                label: 'Enter your phone number',
                name: 'phone',
                rules: VALIDATION_CONFIG.phone,
                children: <InputNumber maxLength={11} autoFocus={false} placeholder={'19088702157'} style={{width: '100%'}} prefix={<Phone/>}/>
            }
        },
        {
            title: 'Verify your details',
            paragraph: (
                <Typography.Paragraph>
                    Check your text messages. Please find the code we sent you to <span
                    className={'font-bold'}>{loginForm.getFieldValue('phone')}</span>
                </Typography.Paragraph>
            ),
            formItem: {
                label: '',
                name: 'code',
                rules: VALIDATION_CONFIG.code,
                children: <ReactCodeInput autoFocus={false} className={'react-code-input'}/>
            }
        },
    ]
    return (
        <>
            <Row style={{marginBottom: 40}}>
                <ButtonBack onClick={onClickButtonBackHandler}/>
            </Row>
            {
                orderData &&
                <Row>
                    <Typography.Paragraph style={{whiteSpace: 'pre-line'}}>
                        For create the order you should be authorized
                    </Typography.Paragraph>
                </Row>
            }
            <Form style={{width: "100%"}} form={loginForm}>
                <Carousel swipe={false} effect={'fade'} afterChange={setCurrentSlide} ref={carouselRef} dots={false}>
                    {sliderViewConfig.map(({title, paragraph, formItem}, i) => <>
                        <Row>
                            <Typography.Title>
                                {title}
                            </Typography.Title>
                        </Row>
                        <Row style={{marginBottom: 60}}>
                            {paragraph}
                        </Row>
                        <Row style={{marginBottom: 20}}>
                            <Form.Item rules={formItem.rules}
                                       colon={false}
                                       hasFeedback={true}
                                       label={formItem.label}
                                       name={formItem.name}
                            >
                                {formItem.children}
                            </Form.Item>
                        </Row>
                    </>)}
                </Carousel>
                <Row>
                    <Button onClick={onFinishFormHandler} loading={fetchingGetCode || fetchingLogin}
                            size={"large"}>Next</Button>
                </Row>
            </Form>
        </>
    );
}

;