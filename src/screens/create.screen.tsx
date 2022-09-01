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
    PayTypeEnum, UserRoleEnum
} from "../store/reducers/backend/backend.api.types";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {COLORS, ROUTES} from "../configs/app.constants";
import {useAppSelector} from "../hooks/useAppSelector";
import moment from "moment";
import {CarOutlined, MehOutlined} from "@ant-design/icons";
import {FormCard} from "../components/formCard.component";
import {FormChangeInfo} from "rc-field-form/lib/FormContext";
import {ButtonBack} from "../components/buttonBack.component";
import {ReactComponent as Courier} from '../assets/svgs/courier.svg';

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
        packagePrice: 5
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
                    ROUTES.AUTH.LOGIN_PAGE.PATH + '/' + UserRoleEnum.Customer,
                    {state: {orderData: JSON.stringify(data)}}
                ); return;
            }
            if(IS_UPDATE_ORDER_PAGE) {
                fetchUpdateOrder({orderId: Number(orderId), update: data})
            } else {
                fetchCreateOrder(data).unwrap().then(() => navigate(ROUTES.ORDER.LIST_PAGE))
            }
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
                    {IS_FORM_START_PAGE && <ButtonBack onClick={() => navigate(-1)}/>}
                    <Typography.Title style={{marginBottom: 0}} level={2}>Create order</Typography.Title>
                </Row>
                <Row>
                    <Form.Item label={'Choose a shipping method'} style={{width: '100%'}} name={'deliveryType'} rules={[{required: true, message: ''}]}>
                        <Radio.Group style={{width: '100%', textAlign: 'center'}}>
                            {shippingMethodViewConfig.map(({value}) =>
                                <Radio.Button style={{width: '33%'}} value={value}>{value}</Radio.Button>
                            )}
                        </Radio.Group>
                    </Form.Item>
                </Row>
                <Row justify={'space-between'}>
                    <Form.Item label={'Package price'} style={{width: '40%'}} name={'packagePrice'}
                               rules={[{required: true, message: ''}]}>
                        <InputNumber style={{width: '100%'}} placeholder={'10'} prefix={'$'}/>
                    </Form.Item>
                    <Form.Item label={'Package type'} style={{width: '55%'}} name={'packageType'}
                               rules={[{required: true, message: ''}]}>
                        <Input placeholder={'Flowers'}/>
                    </Form.Item>
                </Row>
                <Row justify={'space-between'} style={{marginBottom: 20}}>
                    <Form.Item label={'Package weight'} rules={[{required: true, message: ''}]} style={{width: '40%'}} name="weight">
                        <Select>
                            {packageWeightViewConfig.map((value) =>
                                <Select.Option value={value}>{value}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item style={{width: '55%'}} label={'Payment way'} name={'payType'}
                               rules={[{required: true, message: ''}]}>
                        <Select>
                            {payTypeViewConfig.map(({value, label}) =>
                                <Select.Option value={value}>{label}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                </Row>
                {/*<Row style={{marginBottom: 20}}>*/}
                {/*    <Typography.Title level={3}>Parcel weight</Typography.Title>*/}
                {/*    <Form.Item rules={[{required: true, message: ''}]} style={{width: '100%'}} name="weight">*/}
                {/*        <Select>*/}
                {/*            {packageWeightViewConfig.map((value) =>*/}
                {/*                <Select.Option value={value}>{value}</Select.Option>*/}
                {/*            )}*/}
                {/*        </Select>*/}
                {/*    </Form.Item>*/}
                {/*</Row>*/}
                <Row style={{marginBottom: 50}}>
                    <Typography.Title level={3}>Where to pickup?</Typography.Title>
                    <Form style={{width: '100%'}} form={pickupForm}>
                        <FormCard/>
                    </Form>
                </Row>
                <Row style={{marginBottom: 30}}>
                    <Typography.Title level={3}>Where to deliver?</Typography.Title>
                    <Form style={{width: '100%'}} form={deliveryForm}>
                        <FormCard/>
                    </Form>
                </Row>
                <Row style={{marginBottom: 40}}>
                    <Form.Item style={{width: '100%'}} name="comment">
                        <Input.TextArea placeholder={'Your comment to the courier'} rows={4}/>
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
                    {/*{getActionButtonView()}*/}
                    <Button onClick={onFinishFormHandler}
                            loading={fetchingUpdateOrder || fetchingCreateOrder}
                            size={"large"}>
                        {
                            IS_AUTH_USER ?
                                (IS_UPDATE_ORDER_PAGE ? 'Update order' : 'Create order') :
                                'Next'
                        }
                    </Button>
                </Row>
            </Form>
        </Form.Provider>
    );
};
