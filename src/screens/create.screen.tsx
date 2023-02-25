import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, InputNumber, notification, Radio, Row, Select, Typography} from "antd";
import {useForm} from "antd/es/form/Form";
import {
    useCountOrderPriceAndDurationMutation,
    useCreateOrderMutation,
    useLazyGetOrderQuery,
    useUpdateOrderMutation
} from "../store/reducers/backend/backend.api";
import {
    DeliveryTypeEnum,
    OrderPointTypeEnum,
    OrderType,
    PackageWeightEnum,
    PayTypeEnum,
    UserRoleEnum
} from "../store/reducers/backend/backend.api.types";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {COLORS, ROUTES} from "../configs/app.constants";
import {useAppSelector} from "../hooks/useAppSelector";
import moment from "moment";
import {FormCard} from "../components/formCard.component";
import {FormChangeInfo} from "rc-field-form/lib/FormContext";
import {ButtonBack} from "../components/buttonBack.component";
import {VALIDATION_CONFIG} from "../configs/validation.config";

export type InitialOrderStateType = Pick<OrderType, 'deliveryType' | 'weight' | 'deliveryPrice' | 'payType' | 'packageType' | 'packagePrice'>;

export function CreateScreen() {
    const {orderId} = useParams();
    const IS_UPDATE_ORDER_PAGE = !!orderId;
    const IS_AUTH_USER = useAppSelector(({app}) => app.auth)
    const {state}: any = useLocation();
    const {pickupAddress = undefined, deliveryAddress = undefined} = state || {};
    const IS_FORM_START_PAGE = pickupAddress && deliveryAddress
    const navigate = useNavigate();
    // const carouselRef = useRef<CarouselRef>(null)
    const [orderForm] = useForm();
    const [pickupForm] = useForm();
    const [deliveryForm] = useForm();
    // const [verificationForm] = useForm();
    const [initialStateOrderForm, setInitialStateOrderForm] = useState({
        deliveryType: DeliveryTypeEnum.Walking,
        weight: PackageWeightEnum.Under1,
        deliveryPrice: 0,
        payType: PayTypeEnum.SenderCash,
        packagePrice: 0
    });
    const setInitialStateOrderFormHandler = (field: keyof typeof initialStateOrderForm, value: any) => {
        setInitialStateOrderForm((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }
    const [initialStatePickupForm] = useState({
        address: pickupAddress,
        orderPointType: OrderPointTypeEnum.Pickup,
        date: moment(),
        timeRange: [moment(), moment().add(2, 'hours')]
    });
    const [initialStateDeliveryForm] = useState({
        ...initialStatePickupForm,
        address: deliveryAddress,
        orderPointType: OrderPointTypeEnum.Delivery,
        timeRange: [moment().add(3, 'hours'), moment().add(5, 'hours')]
    });

    useEffect(() => {
        window.scrollTo(0, 0)
        if(IS_UPDATE_ORDER_PAGE) {
            fetchGetOrder(Number(orderId)).unwrap().then((data) => {
                const {deliveryPoint, pickupPoint, deliveryPrice, ...restGetOrderData} = data;
                orderForm.setFieldsValue(restGetOrderData);
                setInitialStateOrderFormHandler('deliveryPrice', deliveryPrice)
                pickupForm.setFieldsValue({
                    ...pickupPoint,
                    date: moment(pickupPoint.date),
                    timeRange: [moment(pickupPoint.timeRangeFrom), moment(pickupPoint.timeRangeTo)],
                });
                deliveryForm.setFieldsValue({
                    ...deliveryPoint,
                    date: moment(deliveryPoint.date),
                    timeRange: [moment(deliveryPoint.timeRangeFrom), moment(deliveryPoint.timeRangeTo)],
                });
            })
        } else {
            orderForm.setFieldsValue(initialStateOrderForm);
            pickupForm.setFieldsValue(initialStatePickupForm);
            deliveryForm.setFieldsValue(initialStateDeliveryForm);
        }
        if (pickupAddress && deliveryAddress) {
            fetchCountOrderPriceAndSetToOrderFormState({
                origins: pickupAddress,
                destinations: [deliveryAddress],
                deliveryType: DeliveryTypeEnum.Walking,
            });
        }
    }, [])


    const [
        fetchGetOrder,
        {isFetching: fetchingGetOrder = false}
    ] = useLazyGetOrderQuery();
    const [
        fetchCountOrderPriceAndDuration,
        {isLoading: fetchingCountOrderPriceAndDuration}
    ] = useCountOrderPriceAndDurationMutation();
    const [
        fetchCreateOrder,
        {isLoading: fetchingCreateOrder}
    ] = useCreateOrderMutation();
    const [
        fetchUpdateOrder,
        {isLoading: fetchingUpdateOrder}
    ] = useUpdateOrderMutation();



    const fetchCountOrderPriceAndSetToOrderFormState = (
        data: { origins: string, destinations: string[], deliveryType: DeliveryTypeEnum }
    ) => {
        fetchCountOrderPriceAndDuration(data)
            .unwrap()
            .then(({price}) => {
                setInitialStateOrderFormHandler('deliveryPrice', price)
            });
    }

    const onFinishFormHandler = async () => {
        // console.log(
        //     'onFinishFormHandler',
        //     orderForm.getFieldsValue(),
        //     pickupForm.getFieldsValue(),
        //     deliveryForm.getFieldsValue()
        // )
        try {
            await Promise.all([
                orderForm.validateFields(),
                pickupForm.validateFields(),
                deliveryForm.validateFields(),
            ]);
            const data = {
                ...orderForm.getFieldsValue(),
                pickupPoint: {
                    orderPointType: OrderPointTypeEnum.Pickup,
                    ...pickupForm.getFieldsValue(),
                    timeRangeFrom: pickupForm.getFieldValue('timeRange')[0],
                    timeRangeTo: pickupForm.getFieldValue('timeRange')[1]
                },
                deliveryPoint: {
                    orderPointType: OrderPointTypeEnum.Delivery,
                    ...deliveryForm.getFieldsValue(),
                    timeRangeFrom: deliveryForm.getFieldValue('timeRange')[0],
                    timeRangeTo: deliveryForm.getFieldValue('timeRange')[1]
                },
            }
            if(!IS_AUTH_USER) {
                // console.log(data, "DATA")
                navigate(
                    ROUTES.LOGIN.PATH + '/' + UserRoleEnum.Customer,
                    {state: {orderData: JSON.stringify(data)}}
                ); return;
            }
            if(IS_UPDATE_ORDER_PAGE) {
                await fetchUpdateOrder({orderId: Number(orderId), update: data}).unwrap()
            } else {
                await fetchCreateOrder(data).unwrap()
            }
            navigate(ROUTES.LIST_ORDERS)
        } catch (e) {
            console.log(e)
            notification.error({message: 'Fill all fields please!'})
            return;
        }
    }

    const onFormsValuesChangeHandler = (_: string, {changedFields}: FormChangeInfo) => {
        //Выбрасываем из функции при валидации форм, потому что при валидации считается как изменения
        if(changedFields.length >= 4) return;
        const [{name}] = changedFields;
        const changedFieldName = name.toString();
        if (
            (
                (changedFieldName === 'deliveryType' || changedFieldName === 'address') &&
                isFilledAddress(pickupForm.getFieldValue('address')) &&
                isFilledAddress(deliveryForm.getFieldValue('address'))
            )
        ) {
            if (!fetchingCountOrderPriceAndDuration) {
                fetchCountOrderPriceAndSetToOrderFormState({
                    origins: pickupForm.getFieldValue('address'),
                    destinations: [deliveryForm.getFieldValue('address')],
                    deliveryType: orderForm.getFieldValue('deliveryType'),
                })
            }
        }
    }
    const isFilledAddress = (value: string) => {
        return value?.includes('USA') && value?.length > 10
    }

    const shippingMethodViewConfig = [
        {value: DeliveryTypeEnum.Walking},
        {value: DeliveryTypeEnum.Car},
        {value: DeliveryTypeEnum.Truck},
    ];
    const payTypeViewConfig = [
        {value: PayTypeEnum.SenderCash, label: 'Sender by cash'},
        {value: PayTypeEnum.RecipientCash, label: 'Recipient by cash'},
        {value: PayTypeEnum.ByBankApps, label: 'By bank apps'},
    ];
    const packageWeightViewConfig = [
        PackageWeightEnum.Under1,
        PackageWeightEnum.Under2,
        PackageWeightEnum.Under5,
        PackageWeightEnum.Under10,
        PackageWeightEnum.Under15,
        PackageWeightEnum.Under20,
        PackageWeightEnum.More20,
    ];

    return (
        <Form.Provider onFormChange={onFormsValuesChangeHandler}>
            <Form layout={'horizontal'} style={{width: "100%"}} form={orderForm}>
                <Row style={{alignItems: 'center', marginBottom: 20}} justify={'space-between'}>
                    {(IS_FORM_START_PAGE || IS_UPDATE_ORDER_PAGE) && <ButtonBack onClick={() => navigate(-1)}/>}
                    <Typography.Title style={{marginBottom: 0}} level={2}>{
                        IS_UPDATE_ORDER_PAGE ? `Correct order #${orderId}` : 'Create order'
                    }</Typography.Title>
                </Row>
                <Row>
                    <Form.Item
                        label={'Choose the delivery method'}
                        style={{width: '100%'}}
                        name={'deliveryType'}
                        rules={VALIDATION_CONFIG.deliveryType}
                    >
                        <Radio.Group style={{width: '100%', textAlign: 'center'}}>
                            {shippingMethodViewConfig.map(({value}) =>
                                <Radio.Button style={{width: '33%'}} value={value}>{value}</Radio.Button>
                            )}
                        </Radio.Group>
                    </Form.Item>
                </Row>
                <Row justify={'space-between'}>
                    <Form.Item label={'Package price'}
                               style={{width: '40%'}}
                               name={'packagePrice'}
                               hasFeedback
                               rules={VALIDATION_CONFIG.packagePrice}
                    >
                        <InputNumber maxLength={11} style={{width: '100%'}} placeholder={'10'} prefix={'$'}/>
                    </Form.Item>
                    <Form.Item label={'Package type'}
                               style={{width: '55%'}}
                               name={'packageType'}
                               hasFeedback
                               rules={VALIDATION_CONFIG.packageType}
                    >
                        <Input placeholder={'What kind of package?'}/>
                    </Form.Item>
                </Row>
                <Row justify={'space-between'} style={{marginBottom: 20}}>
                    <Form.Item label={'Package weight'}
                               rules={VALIDATION_CONFIG.weight}
                               style={{width: '40%'}}
                               hasFeedback
                               name="weight"
                    >
                        <Select>
                            {packageWeightViewConfig.map((value) =>
                                <Select.Option value={value}>{value}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item style={{width: '55%'}}
                               label={'Payment way'}
                               name={'payType'}
                               hasFeedback
                               rules={VALIDATION_CONFIG.payType}
                    >
                        <Select>
                            {payTypeViewConfig.map(({value, label}) =>
                                <Select.Option value={value}>{label}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                </Row>
                <Row style={{marginBottom: 50}}>
                    <Typography.Title level={3}>What is the pick-up location?</Typography.Title>
                    <Form style={{width: '100%'}} form={pickupForm}>
                        <FormCard pointType={OrderPointTypeEnum.Pickup} />
                    </Form>
                </Row>
                <Row style={{marginBottom: 30}}>
                    <Typography.Title level={3}>What is the delivery location?</Typography.Title>
                    <Form style={{width: '100%'}} form={deliveryForm}>
                        <FormCard pointType={OrderPointTypeEnum.Delivery}/>
                    </Form>
                </Row>
                <Row style={{marginBottom: 40}}>
                    <Form.Item style={{width: '100%'}} name="comment">
                        <Input.TextArea placeholder={'Add comments for the courier'} rows={4}/>
                    </Form.Item>
                </Row>
                <Row style={{marginBottom: 25}} justify={'space-between'}>
                    <Col span={11}><Typography.Title level={2}>Total</Typography.Title></Col>
                    <Col span={11}>
                        <Typography.Title style={{textAlign: 'right', color: COLORS.SUCCESS}} level={2}>
                            ${initialStateOrderForm.deliveryPrice}
                        </Typography.Title>
                    </Col>
                </Row>
                <Row>
                    <Button onClick={onFinishFormHandler}
                            loading={fetchingUpdateOrder || fetchingCreateOrder}
                            size={"large"}>
                        {
                            IS_AUTH_USER ?
                                (IS_UPDATE_ORDER_PAGE ? 'Correct order' : 'Create order') :
                                'Next'
                        }
                    </Button>
                </Row>
            </Form>
        </Form.Provider>
    );
};
