import {
  Button,
  Carousel,
  Col,
  Form,
  Row,
  Typography
} from "antd";
import { useForm } from "antd/es/form/Form";
import { CarouselRef } from "antd/lib/carousel";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactCodeInput from "react-verification-code-input";
import { InputPhoneNumber } from "../components/inputPhoneNumber.component";
import { ROUTES } from "../configs/app.constants";
import { VALIDATION_CONFIG } from "../configs/validation.config";
import {
  useLoginMutation,
  useSmsVerificationCodeMutation
} from "../store/reducers/backend/backend.api";
import { ButtonBack } from "../components/buttonBack.component";

export function LoginScreen() {
  const [loginForm] = useForm();
  const { userRole: role } = useParams();

  useEffect(() => {
    const timeoutId = setTimeout(() => window.scrollTo(0, 0), 300)
    return () => clearTimeout(timeoutId)
  }, [])

  const carouselRef = useRef<CarouselRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  //----REQUESTS----//

  const [fetchSmsVerificationCode, { isLoading: fetchingGetCode }] =
    useSmsVerificationCodeMutation();
  const [fetchLogin, { isLoading: fetchingLogin }] = useLoginMutation();

  const onFinishFormHandler = async () => {
    console.log("onFinishFormHandler");
    const { phone, code } = loginForm.getFieldsValue();
    try {
      if (currentSlide === 0) {
        await loginForm.validateFields(["phone"]);
        //@ts-ignore
        fetchSmsVerificationCode({ data: { phone, role } });
        setCurrentSlide(1)
        carouselRef?.current?.goTo(1);
      }
      if (currentSlide === 1) {
        await loginForm.validateFields(["code"]);
        // @ts-ignore
        fetchLogin({ data: { phone, role }, code })
      }
    } catch {}
  };

  const onClickButtonBackHandler = () => {
    if (currentSlide === 1) {
      setCurrentSlide(0)
      carouselRef?.current?.prev();
    }
  };
  const sliderViewConfig = [
    {
      title: "Login",
      paragraph: (
        <Typography.Paragraph>
          Please enter <span className={"font-bold"}>your phone number</span> for login
        </Typography.Paragraph>
      ),
      formItem: {
        label: "Enter your phone number",
        name: "phone",
        rules: VALIDATION_CONFIG.phone,
        children: (<InputPhoneNumber autoFocus={true}/>),
      },
    },
    {
      title: "Verify",
      paragraph: (
        <Typography.Paragraph>
          Check your text messages. Please find the code we sent you to{" "}
          <span className={"font-bold"}>
            {'+' + loginForm.getFieldValue("phone")}
          </span>
        </Typography.Paragraph>
      ),
      formItem: {
        label: "",
        name: "code",
        rules: VALIDATION_CONFIG.code,
        children: ( currentSlide === 1 ?
          <ReactCodeInput autoFocus={true} className={"react-code-input"} /> : <></>
        ),
      },
    },
  ];
  return (
    <>
      {<Row style={{ marginBottom: 40, visibility: currentSlide === 1 ? 'visible' : 'hidden' }}>
        <ButtonBack onClick={onClickButtonBackHandler} />
      </Row>}
      <Form style={{ width: "100%" }} form={loginForm}>
        <Carousel
        style={{marginBottom: 30}}
          swipe={false}
          effect={"fade"}
          afterChange={setCurrentSlide}
          ref={carouselRef}
          dots={false}
        >
          {sliderViewConfig.map(({ title, paragraph, formItem }, i) => (
            <>
              <Row>
                <Typography.Title>{title}</Typography.Title>
              </Row>
              <Row style={{ marginBottom: 30 }}>{paragraph}</Row>
              <Row style={{ marginBottom: 20 }}>
                <Form.Item
                  validateTrigger={'onBlur'}
                  rules={formItem.rules}
                  colon={false}
                  hasFeedback={true}
                  label={formItem.label}
                  name={formItem.name}
                >
                  {React.cloneElement(formItem.children)}
                </Form.Item>
              </Row>
            </>
          ))}
        </Carousel>
        <Row style={{textAlign: 'center'}}>
          <Button
            onClick={onFinishFormHandler}
            loading={fetchingGetCode || fetchingLogin}
            size={"large"}
          >
            Next
          </Button>
          {/* {currentSlide !== 1 && <Col span={24} style={{marginTop: 25}}>
            <Link
              style={{ textDecoration: "underline" }}
              to={ROUTES.CUSTOMER_FAQ}
            >
              {"Customer FAQ"}
            </Link>
          </Col>} */}
        </Row>
      </Form>
    </>
  );
}
