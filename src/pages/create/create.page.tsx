import React, {useCallback, useEffect, useState} from 'react';
import Title from "antd/lib/typography/Title";
import {Alert, Button, Col, Divider, Form, Input, notification, Row, Select, Skeleton, Spin, Typography} from "antd";
import {useForm} from "antd/es/form/Form";
import {
    useCountOrderPriceAndDurationMutation,
    useCreateOrderMutation, useLazyExistUserQuery, useLazyGetCodeQuery,
    useLazyGetOrderQuery, useLoginMutation, useSignupMutation,
    useUpdateOrderMutation
} from "../../store/reducers/backend/backend.api";
import {DeliveryTypeEnum, OrderPointTypeEnum, PayTypeEnum} from "../../store/reducers/backend/backend.api.types";
import {FormCard} from "../../components/form/form.card.component";
import {useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "../../configs/app.constants";
import {useAppSelector} from "../../hooks/useAppSelector";

export function CreatePage() {
    const {orderId} = useParams();
    const navigate = useNavigate();

    const [orderForm] = useForm();
    const [pickupForm] = useForm();
    const [deliveryForm] = useForm();
    const [verificationForm] = useForm();

    const auth = useAppSelector(({app}) => app.auth)

    const [filledAddresses, setFilledAddresses] = useState({
        [OrderPointTypeEnum.Pickup]: false,
        [OrderPointTypeEnum.Delivery]: false,
    });

    const IS_UPDATE_ORDER_PAGE = !!orderId;
    const IS_AUTH_USER = auth;

    const [
        fetchGetOrder,
        {error: error1, isLoading: fetchingGetOrder = false, data: getOrderData}
    ] = useLazyGetOrderQuery();
    const {data: {message: errorGetOrder = undefined} = {}} = error1 as any || {};
    useEffect(() => {
        IS_UPDATE_ORDER_PAGE && fetchGetOrder(orderId)
    }, [orderId])
    useEffect(() => {
        if (getOrderData) {
            const {deliveryPoints: [deliveryPoint], pickupPoint, ...restGetOrderData} = getOrderData;
            for (const key in restGetOrderData) {
                // @ts-ignore
                orderForm.setFields([{name: key, value: restGetOrderData[key]}]);
            }
            for (const key in pickupPoint) {
                // @ts-ignore
                pickupForm.setFields([{name: key, value: pickupPoint[key]}]);
            }
            for (const key in deliveryPoint) {
                deliveryForm.setFields([{
                    // @ts-ignore
                    name: key, value: deliveryPoint[key]
                }]);
            }
        }
    }, [getOrderData])

    const [
        fetchUpdateOrder,
        {error: error2, isLoading: fetchingUpdateOrder, data: updateOrderData}
    ] = useUpdateOrderMutation();
    const {data: {message: errorUpdateOrder = undefined} = {}} = error2 as any || {};
    useEffect(() => {
        if (updateOrderData) {
            notification.success({message: 'Your order successful updated!'});
            navigate(ROUTES.ORDER.LIST_PAGE);
        }
    }, [updateOrderData])


    const [
        fetchCountOrderPriceAndDuration,
        {error: error3, isLoading: fetchingCountOrderPriceAndDuration, data: countOrderPriceAndDurationData}
    ] = useCountOrderPriceAndDurationMutation();
    const {data: {message: errorCountOrderPriceAndDuration = undefined} = {}} = error3 as any || {};
    useEffect(() => {
        if (
            filledAddresses[OrderPointTypeEnum.Delivery] &&
            filledAddresses[OrderPointTypeEnum.Pickup]
        ) {
            fetchCountOrderPriceAndDuration({
                origins: pickupForm.getFieldValue('address'),
                destinations: [deliveryForm.getFieldValue('address')],
                deliveryType: orderForm.getFieldValue('deliveryType')
            })
        }
    }, [filledAddresses])

    const [
        fetchCreateOrder,
        {error: error4, isLoading: fetchingCreateOrder, data: createOrderData}
    ] = useCreateOrderMutation();
    const {data: {message: errorCreateOrder = undefined} = {}} = error4 as any || {};
    useEffect(() => {
        if (createOrderData) {
            notification.success({message: 'Your order successful created!'});
            orderForm.resetFields();
            pickupForm.resetFields();
            deliveryForm.resetFields();
            navigate(ROUTES.ORDER.LIST_PAGE);
        }
    }, [createOrderData])

    const [
        fetchGetCode,
        {error: error5, isLoading: fetchingGetCode, data: IS_HAVE_VERIFICATION_CODE = true}
    ] = useLazyGetCodeQuery();
    const {data: {message: errorGetCode = undefined} = {}} = error5 as any || {};

    //--------CATCH-ERRORS------//
    if (errorCountOrderPriceAndDuration || errorCreateOrder || errorGetOrder || errorUpdateOrder || errorGetCode) {
        notification.error({
            message: errorCountOrderPriceAndDuration ||
                errorCreateOrder ||
                errorGetOrder ||
                errorUpdateOrder ||
                errorGetCode
        })
    }
    //-------------------------//

    const onAddressFilledHandler = (filled: boolean, type: OrderPointTypeEnum) => {
        setFilledAddresses((prevState) => ({
            ...prevState,
            [type]: filled
        }))
    }

    const onFinishFormHandler = async () => {
        try {
            await Promise.all([
                orderForm.validateFields(),
                pickupForm.validateFields(),
                deliveryForm.validateFields(),
                ...(!IS_AUTH_USER ? [verificationForm.validateFields()] : [])
            ]);
            const data = {
                ...orderForm.getFieldsValue(),
                pickupPoint: pickupForm.getFieldsValue(),
                deliveryPoints: [deliveryForm.getFieldsValue()],
                ...(!IS_AUTH_USER && verificationForm.getFieldsValue())
            }
            IS_UPDATE_ORDER_PAGE ?
                fetchUpdateOrder(data) :
                fetchCreateOrder(data)
        } catch (e) {
            notification.error({message: 'Fill all fields please!'})
            return;
        }
    }
    const onFinishVerificationFormHandler = async () => {
        fetchGetCode(verificationForm.getFieldValue('phone'));
    }

    const deliveryTypeConfigView = [
        {value: DeliveryTypeEnum.Walking},
        {value: DeliveryTypeEnum.Car},
        {value: DeliveryTypeEnum.Truck},
    ];

    const weightConfigView = [
        {value: 'Under 1 lb'},
        {value: 'Under 2 lb'},
        {value: 'Under 5 lb'},
        {value: 'Under 10 lb'},
        {value: 'Under 15 lb'},
        {value: 'Under 20 lb'},
        {value: 'More 20 lb'},
    ];

    const payTypeConfigView = [
        {value: PayTypeEnum.SenderCash},
        {value: PayTypeEnum.RecipientCash},
        {value: PayTypeEnum.ByBankApps},
    ];

    const formCardConfigView = [
        {type: OrderPointTypeEnum.Pickup, ref: pickupForm},
        {type: OrderPointTypeEnum.Delivery, ref: deliveryForm}
    ]

    const createOrderButton = useCallback(() =>
            <Skeleton active={true} loading={fetchingGetOrder}>
                <Button
                    loading={fetchingCountOrderPriceAndDuration || fetchingCreateOrder || fetchingUpdateOrder}
                    onClick={onFinishFormHandler}
                    style={{width: '100%'}}
                    htmlType={'submit'}
                >
                    {IS_UPDATE_ORDER_PAGE ? 'Update' : 'Create'} order
                </Button>
            </Skeleton>,
        [
            IS_UPDATE_ORDER_PAGE,
            IS_AUTH_USER,
            fetchingGetOrder,
            fetchingCountOrderPriceAndDuration,
            fetchingCreateOrder,
            fetchingUpdateOrder
        ]
    )

    return (
        <div className={'container'}>
            <Form.Provider onFormFinish={onFinishFormHandler}>
                <Row gutter={20} justify={'space-between'}>
                    <Col span={6}>
                        <Title>{IS_UPDATE_ORDER_PAGE ? 'Update' : 'Create'} order</Title>
                    </Col>
                    <Col span={14}>
                        <Form form={orderForm}>
                            <Col style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Col span={7}>
                                    <Skeleton active={true} loading={fetchingGetOrder}>
                                        <Form.Item rules={[{required: true, message: ''}]} name={'deliveryType'}>
                                            <Select defaultValue={deliveryTypeConfigView[0].value}>
                                                {deliveryTypeConfigView.map(({value}) =>
                                                    <Select.Option value={value}>{value}</Select.Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Skeleton>
                                    {/*</Skeleton.Input>*/}
                                </Col>
                                <Col span={7} offset={1}>
                                    <Skeleton active={true} loading={fetchingGetOrder}>
                                        <Form.Item rules={[{required: true, message: ''}]} name={'packageCost'}>
                                            <Input placeholder={'Package cost in $'}/>
                                        </Form.Item>
                                    </Skeleton>
                                    {/*</Skeleton.Input>*/}
                                </Col>
                                <Col span={7} offset={1}>
                                    <Skeleton active={true} loading={fetchingGetOrder}>
                                        <Form.Item rules={[{required: true, message: ''}]} name={'packageType'}>
                                            <Input placeholder={'Type of package'}/>
                                        </Form.Item>
                                    </Skeleton>
                                </Col>
                            </Col>
                            <Col style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Col span={12}>
                                    <Skeleton active={true} loading={fetchingGetOrder}>
                                        <Form.Item rules={[{required: true, message: ''}]} name={'payType'}>
                                            <Select placeholder={'Way for pay'}>
                                                {payTypeConfigView.map(({value}) =>
                                                    <Select.Option value={value}>{value}</Select.Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Skeleton>
                                </Col>
                                <Col span={12}>
                                    <Skeleton active={true} loading={fetchingGetOrder}>
                                        <Form.Item rules={[{required: true, message: ''}]} name={'weight'}>
                                            <Select defaultValue={weightConfigView[0].value}>
                                                {weightConfigView.map(({value}) =>
                                                    <Select.Option value={value}>{value}</Select.Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Skeleton>
                                </Col>
                            </Col>
                        </Form>
                        <Divider style={{marginTop: 0}}/>
                        <Col>
                            <Alert
                                message={'Each courier pays a deposit to fulfill delivery orders, so in case of loss of cargo,\n' +
                                'we will compensate the cost within three working days in accordance with the regulations.'}
                                type={'warning'}
                            />
                        </Col>
                        <Divider/>
                        {formCardConfigView.map(({type, ref}) =>
                            <Col>
                                <FormCard loadingData={fetchingGetOrder} onAddressFilled={onAddressFilledHandler}
                                          type={type} formRef={ref}/>
                            </Col>
                        )}
                        <Divider/>
                        <Row>
                            <Col span={24}>
                                <Skeleton active={true} loading={fetchingGetOrder}>
                                    {
                                        fetchingCountOrderPriceAndDuration ?
                                            <Spin/> :
                                            <Alert
                                                type={'success'}
                                                message={`The cost of delivery will be: ${countOrderPriceAndDurationData?.price || 10}$`}
                                            />
                                    }
                                </Skeleton>
                            </Col>
                        </Row>
                        {/*<Row>*/}
                                {
                                    !IS_AUTH_USER ?
                                        <Form wrapperCol={{span: 24}} onFinish={onFinishVerificationFormHandler} form={verificationForm}>
                                            <Row style={{marginTop: 10}} justify={'space-between'}>
                                            {
                                                !IS_HAVE_VERIFICATION_CODE ? <>
                                                    <Col span={11}>
                                                        <Form.Item rules={[{required: true, message: ''}]} name={'phone'}>
                                                            <Input placeholder={'Phone number'}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={11}>
                                                        <Form.Item rules={[{required: true, message: ''}]}>
                                                            <Button loading={fetchingGetCode} style={{width: '100%'}}
                                                                    htmlType={'submit'}>
                                                                Get code
                                                            </Button>
                                                        </Form.Item>
                                                    </Col>
                                                </> : <>
                                                    <Col span={11}>
                                                        <Form.Item rules={[{required: true, message: ''}]} name={'code'}>
                                                            <Input placeholder={'Verification code'}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={11}>
                                                        {createOrderButton()}
                                                    </Col>
                                                </>
                                            }
                                            </Row>
                                        </Form> :
                                        createOrderButton()
                                }
                        {/*</Row>*/}
                        <Divider/>
                    </Col>
                </Row>
            </Form.Provider>
        </div>
    );
};
