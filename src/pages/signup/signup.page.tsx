import React from 'react';
import {Form, Input, Button} from "antd";
import './signup.page.style.scss';
import {ROUTES} from "../../configs/constants";
import {Link} from "react-router-dom";

export function SignupPage() {

    return (
        <div className={'signup-page container'}>
            <h1 className={'title'}>Sign Up</h1>
            <Form
                className={'auth-page__form'}
                name="basic"
                initialValues={{remember: true}}
                onFinish={() => null}
                onFinishFailed={() => null}
                autoComplete="off"
            >
                <Form.Item
                    className={'auth-page__form__item'}
                    name="phoneNumber"
                    rules={[{required: true, message: 'Please input your phone number!'}]}
                >
                    <Input placeholder={'Phone Number'}/>
                </Form.Item>

                {/*<Form.Item*/}
                {/*    label="Password"*/}
                {/*    name="password"*/}
                {/*    rules={[{required: true, message: 'Please input your password!'}]}*/}
                {/*>*/}
                {/*    <Input.Password/>*/}
                {/*</Form.Item>*/}

                <Form.Item>
                    <Button onClick={() => null}>
                        Get verification code
                    </Button>
                </Form.Item>
            </Form>
            <Button className={'button-black'}>
                <Link to={ROUTES.CREATE_ORDER}>Sign up</Link>
            </Button>
        </div>
    );
};
