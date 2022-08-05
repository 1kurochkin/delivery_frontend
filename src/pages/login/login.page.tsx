import React, {useEffect, useState} from 'react';
import {Alert, Form, Input, Button} from "antd";
import './login.page.style.scss';
// import {Button} from "../../components/button/button.component";
import {ROUTES} from "../../configs/constants";
import {Link} from "react-router-dom";
import {validation} from "../../tools/validation";
import formConfig from '../../configs/form.config'
import {useForm} from "antd/es/form/Form";
import {FieldData} from "rc-field-form/lib/interface";
import {
    useLazyExistUserQuery,
    useLazyGetCodeQuery,
    useLoginMutation
} from '../../store/reducers/backend/backend.reducer';
import {UserRoleEnum} from "../../store/reducers/backend/backend.reducer.types";

export function LoginPage() {

    const [form] = useForm();

    const [formState, setFormState] = useState({
        phone: {isError: false, disabled: false},
        code: {isError: false, disabled: false},
    })
    const {phone, code} = formState;



    //----REQUESTS----//
    const [
        fetchExistUser,
        {isFetching: fetchingExistUser, error: error1, data: existUserData},
    ] = useLazyExistUserQuery()
    let {data: {message: errorExistUser = undefined} = {}} = error1 as any || {};

    const [
        fetchGetCode,
        {error: error2}
    ] = useLazyGetCodeQuery()
    const {data: {message: errorGetCode = undefined} = {}} = error2 as any || {};
    const [
        fetchLogin,
        {data: dataLogin, error: error3, isLoading: fetchingLogin}
    ] = useLoginMutation()
    const {data: {message: errorLogin = undefined} = {}} = error3 as any || {};
    // const [
    //     fetchExistUser,
    //     {isFetching: isFetchingExistUser, isError: isErrorExistUser, data: existUserData}
    // ] = useLazyExistUserQuery()
    useEffect(() => {
        console.log(errorExistUser, 'errorExistUser')
        // @ts-ignore
        if(existUserData?.isExist) {
            fetchGetCode(form.getFieldValue(formConfig.phone.field));
        } else {
            setFormStateHandler(
                formConfig.phone.field,
                {disabled: false}
            );
        }
    }, [existUserData])

    // const {} = useLoginMutation()

    const setFormStateHandler = (field: string, changes: any) => {
        setFormState(
            (prev) => ({
                ...prev,
                // @ts-ignore
                [field]: {...prev[field], ...changes}
            })
        )
    }

    const onFieldsChangeHandler = (changedFields: FieldData[], fields: FieldData[]) => {
        for (const {name} of fields) {
            const field = name.toString();
            // @ts-ignore
            if (formState[field].isError) {
                setFormStateHandler(field, {isError: false});
            } else return;
        }
    }

    const onFinishFormHandler = (values: any) => {
        const badFields = [];
        for (const [key, value] of Object.entries(values)) {
            const {isValid} = validation(key, value)
            if (!isValid) badFields.push(key);
        }
        if (badFields.length) {
            for (const badField of badFields) {
                setFormStateHandler(badField, {isError: true});
            }
            return;
        }
        if(existUserData?.isExist) {
            fetchLogin({
                phone: form.getFieldValue(formConfig.phone.field),
                code: form.getFieldValue(formConfig.code.field),
                role: existUserData.role as UserRoleEnum
            })
        } else {
            setFormStateHandler(
                formConfig.phone.field,
                {disabled: true}
            );
            fetchExistUser(form.getFieldValue(formConfig.phone.field))
        }
        // console.log('field')

        //запрашиваем код
        //убираем форму ввода номера телефона и показываем форму ввода проверочного кода
        //п
    }

    return (
        <div className={'login-page container'}>
            {
                (errorExistUser || errorGetCode || errorLogin) &&
                <Alert message={errorExistUser || errorGetCode || errorLogin} type="error" showIcon/>
            }
            <h1 className={'title'}>Login</h1>
            <Form
                form={form}
                className={'login-page__form'}
                name="basic"
                initialValues={{remember: true}}
                onFinish={onFinishFormHandler}
                onFieldsChange={onFieldsChangeHandler}
            >
                <Form.Item
                    label={'Phone number'}
                    help={phone.isError ? formConfig.phone.text : ''}
                    className={'login-page__form__item'}
                    name={formConfig.phone.field}
                    labelCol={{span: 24}}
                >
                    <Input status={phone.isError ? 'error' : ''}
                           disabled={fetchingExistUser || existUserData?.isExist}
                           placeholder={'Write your phone number please 19008003080'}/>
                </Form.Item>
                {
                    existUserData?.isExist &&
                    <Form.Item
                        label={'Verification code'}
                        help={code.isError ? formConfig.code.text : ''}
                        className={'login-page__form__item'}
                        name={formConfig.code.field}
                        labelCol={{span: 24}}
                    >
                        <Input status={code.isError ? 'error' : ''}
                               disabled={fetchingExistUser || code.disabled}
                               placeholder={'Write your verification code please!'}/>
                    </Form.Item>
                }
                <Form.Item>
                    <Button loading={fetchingExistUser || fetchingLogin} htmlType={'submit'} className={'button-pink'}>
                        {existUserData?.isExist ? 'Login' : 'Get verification code'}
                    </Button>
                </Form.Item>
            </Form>
            <Button>
                <Link to={ROUTES.SIGNUP_PAGE}>Sign up</Link>
            </Button>
        </div>
    );
};
