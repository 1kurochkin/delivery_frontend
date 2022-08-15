import React, {useCallback, useEffect, useRef, useState} from 'react';
import Title from "antd/lib/typography/Title";
import {Alert, Button, Carousel, Col, Divider, Form, Input, notification, Row, Select, Skeleton, Spin} from "antd";
import {useForm} from "antd/es/form/Form";
import {
    useCountOrderPriceAndDurationMutation,
    useCreateOrderMutation,
    useLazyGetCodeQuery,
    useLazyGetOrderQuery,
    useUpdateOrderMutation
} from "../../store/reducers/backend/backend.api";
import {
    DeliveryTypeEnum,
    OrderPointType,
    OrderPointTypeEnum, OrderType,
    OrderWeightEnum,
    PayTypeEnum, UserRoleEnum
} from "../../store/reducers/backend/backend.api.types";
import {FormCard} from "../../components/form/form.card.component";
import {useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "../../configs/app.constants";
import {useAppSelector} from "../../hooks/useAppSelector";
import moment from "moment";
import {CarouselRef} from "antd/lib/carousel";
import {batch} from "react-redux";
import {useActions} from "../../hooks/useActions";

export type InitialOrderStateType = Pick<OrderType, 'deliveryType' | 'weight' | 'deliveryPrice' | 'payType' | 'packageType' | 'packagePrice'>;

export function CreatePage() {
    const carouselRef = useRef<CarouselRef>(null)
    const {orderId} = useParams();
    const navigate = useNavigate();

    console.log(orderId, "ORDER ID")

    const {setSettingsField, setAuth, setCookies} = useActions()

    const [orderForm] = useForm();

    const [pickupForm] = useForm();
    const [deliveryForm] = useForm();
    const [verificationForm] = useForm();

    const auth = useAppSelector(({app}) => app.auth)

    const IS_UPDATE_ORDER_PAGE = !!orderId;
    const IS_AUTH_USER = auth;

    const deliveryTypeConfigView = Object.values(DeliveryTypeEnum);
    const weightConfigView = Object.values(OrderWeightEnum);
    const payTypeConfigView = Object.values(PayTypeEnum);

    const [initialStateOrderForm, setInitialStateOrderForm] = useState<InitialOrderStateType>({
        deliveryType: deliveryTypeConfigView[0],
        weight: weightConfigView[0],
        deliveryPrice: 0,
        packageType: '',
        payType: PayTypeEnum.SenderCash,
        packagePrice: '' as unknown as number
    });
    const setInitialStateOrderFormHandler = (field: keyof typeof initialStateOrderForm, value: any) => {
        setInitialStateOrderForm((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }
    const [initialStatePickupForm] = useState({
        orderPointType: OrderPointTypeEnum.Pickup,
        address: '', apt: undefined, floor: undefined,
        phone: '',
        date: moment(), timeRangeFrom: moment(), timeRangeTo: moment().add(2, 'hours'),
        payForPickup: false,
        comment: ''
    });
    const [initialStateDeliveryForm] = useState({
        ...initialStatePickupForm,
        orderPointType: OrderPointTypeEnum.Delivery,
        timeRangeFrom: moment().add(2, 'hours'),
        timeRangeTo: moment().add(4, 'hours')
    });
    const formCardConfigView = [
        {type: OrderPointTypeEnum.Pickup, ref: pickupForm, state: initialStatePickupForm},
        {type: OrderPointTypeEnum.Delivery, ref: deliveryForm, state: initialStateDeliveryForm}
    ]

    const [
        fetchGetOrder,
        {error: error1, isFetching: fetchingGetOrder = false, data: getOrderData}
    ] = useLazyGetOrderQuery({

        // selectFromResult: (result) => {
        //     const {data, ...restResult} = result;
        //     if(!data) return result;
        //     const {
        //         id:_0, courierId, customerId, courier, createdAt:_1, updatedAt:_2,
        //         pickupPoint: {id:_3, orderId:_4, createdAt:_5, updatedAt:_6, ...restPickupPoint} = {},
        //         deliveryPoint: {id, orderId, createdAt, updatedAt, ...restDeliveryPoint} = {},
        //         ...restData
        //     } = data;
        //     return {...restResult, data: {...restData, pickupPoint: restPickupPoint, deliveryPoint: restDeliveryPoint}}
        // }
    });

    const {data: {message: errorGetOrder = undefined} = {}} = error1 as any || {};
    useEffect(() => {
        console.log('useEffect orderId')
        IS_UPDATE_ORDER_PAGE && fetchGetOrder(orderId)
    }, [orderId])
    useEffect(() => {
        if (getOrderData) {
            console.log('useEffect getOrderData')
            const {deliveryPoint, pickupPoint, deliveryPrice, ...restGetOrderData} = getOrderData;
            orderForm.setFieldsValue(restGetOrderData);
            setInitialStateOrderFormHandler('deliveryPrice', deliveryPrice);
            pickupForm.setFieldsValue({
                ...pickupPoint,
                date: moment(pickupPoint.date),
                timeRangeFrom: moment(pickupPoint.timeRangeFrom),
                timeRangeTo: moment(pickupPoint.timeRangeTo),
            });
            deliveryForm.setFieldsValue({
                ...deliveryPoint,
                date: moment(deliveryPoint.date),
                timeRangeFrom: moment(deliveryPoint.timeRangeFrom),
                timeRangeTo: moment(deliveryPoint.timeRangeTo),
            });
        }
    }, [getOrderData])

    const [
        fetchUpdateOrder,
        {error: error2, isLoading: fetchingUpdateOrder, data: updateOrderData}
    ] = useUpdateOrderMutation();
    const {data: {message: errorUpdateOrder = undefined} = {}} = error2 as any || {};
    useEffect(() => {
        console.log('useEffect updateOrderData')
        if (updateOrderData) {
            notification.success({message: 'Your order successful updated!'});
            navigate(ROUTES.ORDER.LIST_PAGE);
        }
    }, [updateOrderData])


    const [
        fetchCountOrderPriceAndDuration,
        {error: error3, isLoading: fetchingCountOrderPriceAndDuration, data: countOrderPriceAndDurationData}
    ] = useCountOrderPriceAndDurationMutation({
        // selectFromResult: (result) => ({...result, data: {price: result.data?.price || 10}}),
    });
    const {data: {message: errorCountOrderPriceAndDuration = undefined} = {}} = error3 as any || {};
    useEffect(() => {
        console.log('useEffect countOrderPriceAndDurationData', countOrderPriceAndDurationData)
        if (countOrderPriceAndDurationData) {
            setInitialStateOrderForm((prevState) => ({
                ...prevState,
                deliveryPrice: countOrderPriceAndDurationData?.price || getOrderData?.deliveryPrice || 10
            }))
        }
    }, [countOrderPriceAndDurationData])

    const [
        fetchCreateOrder,
        {error: error4, isLoading: fetchingCreateOrder, data: createOrderData}
    ] = useCreateOrderMutation();
    const {data: {message: errorCreateOrder = undefined} = {}} = error4 as any || {};
    useEffect(() => {
        console.log('useEffect createOrderData')
        if (createOrderData?.result) {
            notification.success({message: 'Your order successful created!'});
            orderForm.resetFields();
            pickupForm.resetFields();
            deliveryForm.resetFields();
            if(IS_AUTH_USER) navigate(ROUTES.ORDER.LIST_PAGE);
            else {
                batch(() => {
                    setSettingsField({
                        field: 'role',
                        value: UserRoleEnum.Customer
                    });
                    setCookies({
                        name: 'sid',
                        value: createOrderData.sid
                    });
                    setAuth(true);
                });
                navigate(ROUTES.ORDER.LIST_PAGE);
            }
        }
    }, [createOrderData])

    let [
        fetchGetCode,
        {error: error5, isFetching: fetchingGetCode, data: IS_HAVE_VERIFICATION_CODE = false}
    ] = useLazyGetCodeQuery();
    const {data: {message: errorGetCode = undefined} = {}} = error5 as any || {};
    useEffect(() => {
        if (IS_HAVE_VERIFICATION_CODE) {
            notification.success({message: 'We have sent verification code to your phone!'})
        }
    }, [IS_HAVE_VERIFICATION_CODE])

    //--------CATCH-ERRORS------//
    if (errorCountOrderPriceAndDuration || errorCreateOrder || errorGetOrder || errorUpdateOrder || errorGetCode) {
        console.log(errorCountOrderPriceAndDuration || errorCreateOrder || errorGetOrder || errorUpdateOrder || errorGetCode)
        notification.error({
            message: errorCountOrderPriceAndDuration ||
                errorCreateOrder ||
                errorGetOrder ||
                errorUpdateOrder ||
                errorGetCode
        })
    }
    //-------------------------//

    const onFinishFormHandler = async () => {
        console.log('onFinishFormHandler')
        try {
            await Promise.all([
                orderForm.validateFields(),
                pickupForm.validateFields(),
                deliveryForm.validateFields(),
                ...(!IS_AUTH_USER ? [verificationForm.validateFields()] : [])
            ]);
            console.log('HELLO CREATING')
            const data = {
                ...orderForm.getFieldsValue(),
                pickupPoint: {
                    orderPointType: OrderPointTypeEnum.Pickup,
                    ...pickupForm.getFieldsValue()
                },
                deliveryPoint: {
                    orderPointType: OrderPointTypeEnum.Delivery,
                    ...deliveryForm.getFieldsValue()
                },
                ...(!IS_AUTH_USER && verificationForm.getFieldsValue())
            }
            IS_UPDATE_ORDER_PAGE ?
                fetchUpdateOrder({orderId: getOrderData?.id || '', update: data}) :
                fetchCreateOrder(data)
        } catch (e) {
            console.log(e)
            notification.error({message: 'Fill all fields please!'})
            return;
        }
    }
    const onClickGetCodeHandler = async () => {
        console.log('onClickGetCodeHandler')
        fetchGetCode(verificationForm.getFieldValue('phone'));
        carouselRef?.current?.next()
    }
    const onFormOrderChangeHandler = (changedValues: any, values: any) => {
        if ('deliveryType' in changedValues || !changedValues) {
            setInitialStateOrderFormHandler('deliveryPrice', 0)
        }
    }
    const onChangeVerificationFormHandler = (changedValues: any, values: any) => {
        if ('phone' in changedValues || !changedValues) {
            setInitialStateOrderFormHandler('deliveryPrice', 0)
        }
    }
    const onAddressChangeFormCardHandler = () => {
        setInitialStateOrderFormHandler('deliveryPrice', 0)
    }

    const onClickCountPriceButtonHandler = async () => {
        try {
            const [
                {deliveryType},
                {address: pickupAddress},
                {address: deliveryAddress}
            ] = await Promise.all([
                orderForm.validateFields(['deliveryType']),
                pickupForm.validateFields(['address']),
                deliveryForm.validateFields(['address']),
            ])
            fetchCountOrderPriceAndDuration({
                origins: pickupAddress,
                destinations: [deliveryAddress],
                deliveryType: deliveryType
            })
        } catch (e) {
            notification.error({
                message: 'Please fill pickup address and delivery address for count delivery price'
            })
        }
    }

    const createOrderButton = useCallback((isUpdateOrderPage: boolean) =>
            <Skeleton active={true} loading={fetchingGetOrder}>
                <Button
                    loading={fetchingCountOrderPriceAndDuration || fetchingCreateOrder || fetchingUpdateOrder}
                    style={{width: '100%'}}
                    htmlType={'submit'}
                    onClick={onFinishFormHandler}
                >
                    {isUpdateOrderPage ? 'Update' : 'Create'} order
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

    const getFooterView = () => {
        if (!initialStateOrderForm.deliveryPrice) {
            return (
                <Button loading={fetchingCountOrderPriceAndDuration}
                        style={{width: '100%'}}
                        onClick={onClickCountPriceButtonHandler}
                >
                    Count delivery price
                </Button>
            )
        } else {
            if (!IS_AUTH_USER) {
                return (
                    <Form style={{maxWidth: '100%'}} layout={"horizontal"}
                          onValuesChange={onChangeVerificationFormHandler} form={verificationForm}>
                        <Carousel ref={carouselRef} effect="fade" dots={false}>
                            <Row>
                                <Col style={{marginBottom: 10}}>
                                    <Form.Item style={{marginBottom: 0}} rules={[{required: true, message: ''}]}
                                               name={'phone'}>
                                        <Input placeholder={'Phone number'}/>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Button loading={fetchingGetCode} style={{width: '100%'}} onClick={onClickGetCodeHandler}>
                                        Get code
                                    </Button>
                                </Col>
                            </Row>
                            <Row justify={'space-between'}>
                                <Col style={{marginBottom: 10}}>
                                    <Button style={{width: '100%'}} onClick={() => carouselRef?.current?.prev()}>
                                        Back
                                    </Button>
                                </Col>
                                <Col style={{marginBottom: 10}}>
                                    <Form.Item style={{marginBottom: 0}} rules={[{required: true, message: ''}]}
                                               name={'code'}>
                                        <Input placeholder={'Verification code'}/>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item>
                                        {createOrderButton(false)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Carousel>
                    </Form>
                )
            }
        }
        if (IS_UPDATE_ORDER_PAGE) return createOrderButton(true);
        else return createOrderButton(false);
    }


    return (
        <div className={'container'}>
            <Form.Provider>
                <Row gutter={20} justify={'space-between'}>
                    <Col span={6}>
                        <Title>{IS_UPDATE_ORDER_PAGE ? 'Update' : 'Create'} order</Title>
                    </Col>
                    <Col span={14}>
                        <Form onValuesChange={onFormOrderChangeHandler} initialValues={initialStateOrderForm}
                              form={orderForm}>
                            <Col style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Col span={7}>
                                    <Skeleton active={true} loading={fetchingGetOrder}>
                                        <Form.Item rules={[{required: true, message: ''}]} name={'deliveryType'}>
                                            <Select>
                                                {deliveryTypeConfigView.map((value) =>
                                                    <Select.Option value={value}>{value}</Select.Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Skeleton>
                                </Col>
                                <Col span={7} offset={1}>
                                    <Skeleton active={true} loading={fetchingGetOrder}>
                                        <Form.Item rules={[{required: true, message: ''}]} name={'packagePrice'}>
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
                                                {payTypeConfigView.map((value) =>
                                                    <Select.Option value={value}>{value}</Select.Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Skeleton>
                                </Col>
                                <Col span={12}>
                                    <Skeleton active={true} loading={fetchingGetOrder}>
                                        <Form.Item rules={[{required: true, message: ''}]} name={'weight'}>
                                            <Select>
                                                {weightConfigView.map((value) =>
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
                        {formCardConfigView.map(({type, ref, state}) =>
                            <Col>
                                <FormCard onAddressChange={onAddressChangeFormCardHandler} state={state}
                                          loadingData={fetchingGetOrder} formRef={ref}/>
                            </Col>
                        )}
                        <Divider/>
                        <Row>
                            <Col span={24}>
                                <Skeleton active={true} loading={fetchingGetOrder}>
                                    <Row gutter={[0, 20]}>
                                        {
                                            initialStateOrderForm.deliveryPrice ?
                                                <Col span={24}>
                                                    <Alert type={'success'}
                                                           message={`The cost of delivery will be: ${initialStateOrderForm.deliveryPrice}$`}/>
                                                </Col> : null
                                        }
                                        {getFooterView()}
                                    </Row>

                                </Skeleton>
                            </Col>
                        </Row>
                        <Divider/>
                    </Col>
                </Row>
            </Form.Provider>
        </div>
    );
};
