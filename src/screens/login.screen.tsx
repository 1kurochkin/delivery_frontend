import React, {useRef, useState} from 'react';
import {Button, Carousel, Form, InputNumber, Row, Typography} from "antd";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import {CarouselRef} from "antd/lib/carousel";
import {useCreateOrderMutation, useLazyGetCodeQuery, useLoginMutation} from "../store/reducers/backend/backend.api";
import {ROUTES} from "../configs/app.constants";
import {OrderType, UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {UserOutlined} from "@ant-design/icons";
import {ButtonBack} from "../components/buttonBack.component";
import ReactCodeInput from 'react-verification-code-input';

export function LoginScreen() {

    const {state} = useLocation();
    const {orderData = undefined} = (state || {}) as any;
    console.log(state, orderData, "STATE")
    const [loginForm] = useForm();
    const navigate = useNavigate();
    const {userRole: role} = useParams();
    if (role !== UserRoleEnum.Courier && role !== UserRoleEnum.Customer) {
        navigate(ROUTES.MAIN_PAGE)
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


    const onFinishFormHandler = ({phone, code}: { phone: string, code: any }) => {
        if (currentSlide === 0) {
            fetchGetCode(phone);
            carouselRef?.current?.goTo(1);
        }
        if (currentSlide === 1) {
            // @ts-ignore
            fetchLogin({data: {phone, role}, code}).unwrap().then(data => {
                if (orderData) {
                    fetchCreateOrder(JSON.parse(orderData))
                }
            })
        }
    }

    const onClickButtonBackHandler = () => {
        if (currentSlide === 0) navigate(-1);
        if (currentSlide === 1) carouselRef?.current?.prev();
    }
    const sliderViewConfig = [
        {
            title: 'Login',
            paragraph: `Please enter your phone number so\nwe can verify you.`,
            formItem: {
                label: 'Enter your phone number',
                name: 'phone',
                rules: [{required: true, message: ''}],
                children: <InputNumber style={{width: '100%'}} prefix={<UserOutlined/>}/>
            }
        },
        {
            title: 'Verify Code',
            paragraph: `Please check your  sms inbox, we've\nsent you the code at ${loginForm.getFieldValue('phone')}`,
            formItem: {
                label: '',
                name: 'code',
                rules: [{required: false, message: ''}],
                children: <ReactCodeInput autoFocus={true} className={'react-code-input'} fieldWidth={51}/>
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
            <Form style={{width: "100%"}} form={loginForm} onFinish={onFinishFormHandler}>
                <Carousel swipe={false} effect={'fade'} afterChange={setCurrentSlide} ref={carouselRef} dots={false}>
                    {sliderViewConfig.map(({title, paragraph, formItem}) => <>
                        <Row>
                            <Typography.Title>
                                {title}
                            </Typography.Title>
                        </Row>
                        <Row style={{marginBottom: 60}}>
                            <Typography.Paragraph style={{whiteSpace: 'pre-line'}}>
                                {paragraph}
                            </Typography.Paragraph>
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
                    <Button loading={fetchingGetCode || fetchingLogin} size={"large"} htmlType={'submit'}>Next</Button>
                </Row>
            </Form>
        </>
    );
}

;