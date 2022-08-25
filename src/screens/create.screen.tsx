import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Form, Input, InputNumber, notification, Radio, Row, Select, Typography} from "antd";
import {useForm} from "antd/es/form/Form";
import {
    useCountOrderPriceAndDurationMutation,
    useCreateOrderMutation,
    useLazyGetOrderQuery, useUpdateOrderMutation
} from "../store/reducers/backend/backend.api";
import {
    DeliveryTypeEnum,
    OrderPointTypeEnum,
    OrderType,
    PackageWeightEnum,
    PayTypeEnum
} from "../store/reducers/backend/backend.api.types";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "../configs/app.constants";
import {useAppSelector} from "../hooks/useAppSelector";
import moment from "moment";
import {CarouselRef} from "antd/lib/carousel";
import {CarOutlined, MehOutlined} from "@ant-design/icons";
import {FormCard} from "../components/form/form.card.component";
import {ButtonBack} from "../components/button/buttonBack.component";

export type InitialOrderStateType = Pick<OrderType, 'deliveryType' | 'weight' | 'deliveryPrice' | 'payType' | 'packageType' | 'packagePrice'>;

export function CreateScreen() {
    const {orderId} = useParams();
    const IS_UPDATE_ORDER_PAGE = !!orderId;
    const IS_AUTH_USER = useAppSelector(({app}) => app.auth)
    const {
        state: {
            pickupAddress = '',
            deliveryAddress = ''
        } = {}
    }: any = useLocation();
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
            fetchGetOrder(orderId).unwrap().then((data) => {
                const {deliveryPoint, pickupPoint, deliveryPrice, ...restGetOrderData} = data;
                orderForm.setFieldsValue(restGetOrderData);
                setInitialStateOrderFormHandler('deliveryPrice', deliveryPrice)
                pickupForm.setFieldsValue({
                    ...pickupPoint,
                    date: moment(pickupPoint.date),
                    timeRange: moment(pickupPoint.timeRange),
                });
                deliveryForm.setFieldsValue({
                    ...deliveryPoint,
                    date: moment(deliveryPoint.date),
                    timeRange: moment(deliveryPoint.timeRange),
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

    // let [
    //     fetchGetCode,
    //     {error: error5, isFetching: fetchingGetCode, data: IS_HAVE_VERIFICATION_CODE = false}
    // ] = useLazyGetCodeQuery();
    // const {data: {message: errorGetCode = undefined} = {}} = error5 as any || {};

    //--------CATCH-ERRORS------//
    // if (errorCountOrderPriceAndDuration || errorCreateOrder || errorGetOrder || errorUpdateOrder || errorGetCode) {
    //     console.log(errorCountOrderPriceAndDuration || errorCreateOrder || errorGetOrder || errorUpdateOrder || errorGetCode)
    //     notification.error({
    //         message: errorCountOrderPriceAndDuration ||
    //             errorCreateOrder ||
    //             errorGetOrder ||
    //             errorUpdateOrder ||
    //             errorGetCode
    //     })
    // }
    //-------------------------//

    const onFinishFormHandler = async () => {
        console.log('onFinishFormHandler')
        try {
            await Promise.all([
                orderForm.validateFields(),
                pickupForm.validateFields(),
                deliveryForm.validateFields(),
                // ...(!IS_AUTH_USER ? [verificationForm.validateFields()] : [])
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
                // ...(!IS_AUTH_USER && verificationForm.getFieldsValue())
            }
            if(IS_UPDATE_ORDER_PAGE) {
                fetchUpdateOrder({orderId: orderId, update: data})
            } else {
                fetchCreateOrder(data).unwrap().then(() => navigate(ROUTES.ORDER.LIST_PAGE))
            }
        } catch (e) {
            notification.error({message: 'Fill all fields please!'})
            return;
        }
    }

    const onFormsValuesChangeHandler = (changedValues: any, values: any) => {
        if (
            (
                'deliveryType' in changedValues &&
                isFilledAddress(pickupForm.getFieldValue('address')) &&
                isFilledAddress(deliveryForm.getFieldValue('address'))
            )
            ||
            (
                'address' in changedValues &&
                isFilledAddress(changedValues.address)
            )
        ) {
            if (!fetchingCountOrderPriceAndDuration) {
                fetchCountOrderPriceAndSetToOrderFormState({
                    origins: pickupForm.getFieldValue('address'),
                    destinations: [pickupForm.getFieldValue('address')],
                    deliveryType: orderForm.getFieldValue('deliveryType'),
                })
            }
        }
    }
    const isFilledAddress = (value: string) => {
        return value.includes('USA') && value.length > 10
    }
    // const onClickGetCodeHandler = async () => {
    //     fetchGetCode(verificationForm.getFieldValue('phone'));
    //     notification.success({message: 'We have sent verification code to your phone!'})
    //     carouselRef?.current?.next()
    // }
    // const onFormOrderChangeHandler = (changedValues: any, values: any) => {
    //     console.log('onFormOrderChangeHandler', changedValues)
    //     if ('deliveryType' in changedValues || !changedValues) {
    //         setInitialStateOrderFormHandler('deliveryPrice', 0)
    //     }

// const onChangeVerificationFormHandler = (changedValues: any, values: any) => {
//     console.log('onFormOrderChangeHandler', changedValues)
//     if ('phone' in changedValues || !changedValues) {
//         setInitialStateOrderFormHandler('deliveryPrice', 0)
//     }
// }
// const onAddressChangeFormCardHandler = () => {
//     setInitialStateOrderFormHandler('deliveryPrice', 0)
// }

// const onClickCountPriceButtonHandler = async () => {
//     try {
//         const [
//             {deliveryType},
//             {address: pickupAddress},
//             {address: deliveryAddress}
//         ] = await Promise.all([
//             orderForm.validateFields(['deliveryType']),
//             pickupForm.validateFields(['address']),
//             deliveryForm.validateFields(['address']),
//         ])
//         fetchCountOrderPriceAndDuration({
//             origins: pickupAddress,
//             destinations: [deliveryAddress],
//             deliveryType: deliveryType
//         })
//     } catch (e) {
//         notification.error({
//             message: 'Please fill pickup address and delivery address for count delivery price'
//         })
//     }
// }

// const createOrderButton = useCallback((isUpdateOrderPage: boolean) =>
//         <Skeleton active={true} loading={fetchingGetOrder}>
//             {/*<Button*/}
//             {/*    loading={fetchingCountOrderPriceAndDuration || fetchingCreateOrder || fetchingUpdateOrder}*/}
//             {/*    style={{width: '100%'}}*/}
//             {/*    htmlType={'submit'}*/}
//             {/*    onClick={onFinishFormHandler}*/}
//             {/*>*/}
//             {/*    {isUpdateOrderPage ? 'Update' : 'Create'} order*/}
//             {/*</Button>*/}
//         </Skeleton>,
//     [
//         IS_UPDATE_ORDER_PAGE,
//         IS_AUTH_USER,
//         fetchingGetOrder,
//         fetchingCountOrderPriceAndDuration,
//         fetchingCreateOrder,
//         // fetchingUpdateOrder
//     ]
// )

// const getFooterView = () => {
//     if (!initialStateOrderForm.deliveryPrice) {
//         return (
//             <Button loading={fetchingCountOrderPriceAndDuration}
//                     style={{width: '100%'}}
//                     onClick={onClickCountPriceButtonHandler}
//             >
//                 Count delivery price
//             </Button>
//         )
//     } else {
//         if (!IS_AUTH_USER) {
//             return (
//                 <Form style={{maxWidth: '100%'}} layout={"horizontal"} form={verificationForm}>
//                     <Carousel ref={carouselRef} effect="fade" dots={false}>
//                         <Row>
//                             <Col style={{marginBottom: 10}}>
//                                 <Form.Item style={{marginBottom: 0}} rules={[{required: true, message: ''}]}
//                                            name={'phone'}>
//                                     <Input placeholder={'Phone number'}/>
//                                 </Form.Item>
//                             </Col>
//                             <Col>
//                                 <Button loading={fetchingGetCode} style={{width: '100%'}}
//                                         onClick={onClickGetCodeHandler}>
//                                     Get code
//                                 </Button>
//                             </Col>
//                         </Row>
//                         <Row justify={'space-between'}>
//                             <Col style={{marginBottom: 10}}>
//                                 <Button style={{width: '100%'}} onClick={() => carouselRef?.current?.prev()}>
//                                     Back
//                                 </Button>
//                             </Col>
//                             <Col style={{marginBottom: 10}}>
//                                 <Form.Item style={{marginBottom: 0}} rules={[{required: true, message: ''}]}
//                                            name={'code'}>
//                                     <Input placeholder={'Verification code'}/>
//                                 </Form.Item>
//                             </Col>
//                             <Col>
//                                 <Form.Item>
//                                     {createOrderButton(false)}
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                     </Carousel>
//                 </Form>
//             )
//         }
//     }
//     if (IS_UPDATE_ORDER_PAGE) return createOrderButton(true);
//     else return createOrderButton(false);
// }

    const shippingMethodViewConfig = [
        {value: DeliveryTypeEnum.Walking, icon: <MehOutlined/>},
        {value: DeliveryTypeEnum.Car, icon: <CarOutlined/>},
        {value: DeliveryTypeEnum.Truck, icon: <CarOutlined/>},
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

    // const getActionButtonView = () => {
    //     if(IS_AUTH_USER) {
    //         return (
    //             <Button onClick={onFinishFormHandler}
    //                     loading={fetchingUpdateOrder || fetchingCreateOrder}
    //                     size={"large"}
    //                     htmlType={'submit'}>
    //                 {IS_UPDATE_ORDER_PAGE ? 'Update order' : 'Create order'}
    //             </Button>
    //         )
    //     }
    // }

    return (
        <Form.Provider>
            <Form onValuesChange={onFormsValuesChangeHandler} layout={'horizontal'} style={{width: "100%"}} form={orderForm}>
                <Row justify={'space-between'} style={{marginBottom: 20}}>
                    <Col span={4}>
                        <ButtonBack onClick={() => navigate(-1)}/>
                    </Col>
                    <Col offset={1} span={19}>
                        <Typography.Title level={2} style={{marginBottom: 20, textAlign: 'right'}}>Create order</Typography.Title>
                    </Col>
                </Row>
                <Row style={{marginBottom: 20}} justify={'space-between'}>
                    <Typography.Title style={{marginBottom: 20}} level={3}>Choose a shipping method</Typography.Title>
                    <Form.Item style={{width: '100%'}} name={'deliveryType'} rules={[{required: true, message: ''}]}>
                        <Radio.Group style={{width: '100%', textAlign: 'center'}} size="large">
                            {shippingMethodViewConfig.map(({value, icon}) =>
                                <Radio.Button style={{width: '33%'}} value={value}>{icon}</Radio.Button>
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
                <Row style={{marginBottom: 20}}>
                    <Form.Item style={{width: '100%'}} label={'Payment way'} name={'payType'}
                               rules={[{required: true, message: ''}]}>
                        <Select>
                            {payTypeViewConfig.map(({value, label}) =>
                                <Select.Option value={value}>{label}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                </Row>
                <Row style={{marginBottom: 20}}>
                    <Typography.Title level={3}>Parcel weight</Typography.Title>
                    <Form.Item rules={[{required: true, message: ''}]} style={{width: '100%'}} name="weight">
                        <Select>
                            {packageWeightViewConfig.map((value) =>
                                <Select.Option value={value}>{value}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                </Row>
                <Row style={{marginBottom: 50}}>
                    <Typography.Title level={3}>Where to pickup?</Typography.Title>
                    <Form onValuesChange={onFormsValuesChangeHandler} style={{width: '100%'}} form={pickupForm}>
                        <FormCard state={null} loadingData={false} onAddressChange={() => null}/>
                    </Form>
                </Row>
                <Row style={{marginBottom: 30}}>
                    <Typography.Title level={3}>Where to deliver?</Typography.Title>
                    <Form onValuesChange={onFormsValuesChangeHandler}  style={{width: '100%'}} form={deliveryForm}>
                        <FormCard state={null} loadingData={false} onAddressChange={() => null}/>
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
                        <Typography.Title style={{textAlign: 'right'}} level={2}>
                            ${initialStateOrderForm.deliveryPrice}
                        </Typography.Title>
                    </Col>
                </Row>
                <Row>
                    {/*{getActionButtonView()}*/}
                    <Button onClick={onFinishFormHandler}
                            loading={fetchingUpdateOrder || fetchingCreateOrder}
                            size={"large"}
                            htmlType={'submit'}>
                        {IS_UPDATE_ORDER_PAGE ? 'Update order' : 'Create order'}
                    </Button>
                </Row>
            </Form>
        </Form.Provider>
        // <div className={'container'}>
        //     <Form.Provider>
        //         <Row gutter={20} justify={'space-between'}>
        //             <Col span={6}>
        //                 <Title>{IS_UPDATE_ORDER_PAGE ? 'Update' : 'Create'} order</Title>
        //             </Col>
        //             <Col span={14}>
        //                 <Form onValuesChange={onFormOrderChangeHandler} initialValues={initialStateOrderForm}
        //                       form={orderForm}>
        //                     <Col style={{display: 'flex', justifyContent: 'space-between'}}>
        //                         <Col span={7}>
        //                             <Skeleton active={true} loading={fetchingGetOrder}>
        //                                 <Form.Item rules={[{required: true, message: ''}]} name={'deliveryType'}>
        //                                     <Select>
        //                                         {deliveryTypeConfigView.map((value) =>
        //                                             <Select.Option value={value}>{value}</Select.Option>
        //                                         )}
        //                                     </Select>
        //                                 </Form.Item>
        //                             </Skeleton>
        //                         </Col>
        //                         <Col span={7} offset={1}>
        //                             <Skeleton active={true} loading={fetchingGetOrder}>
        //                                 <Form.Item rules={[{required: true, message: ''}]} name={'packagePrice'}>
        //                                     <Input placeholder={'Package cost in $'}/>
        //                                 </Form.Item>
        //                             </Skeleton>
        //                             {/*</Skeleton.Input>*/}
        //                         </Col>
        //                         <Col span={7} offset={1}>
        //                             <Skeleton active={true} loading={fetchingGetOrder}>
        //                                 <Form.Item rules={[{required: true, message: ''}]} name={'packageType'}>
        //                                     <Input placeholder={'Type of package'}/>
        //                                 </Form.Item>
        //                             </Skeleton>
        //                         </Col>
        //                     </Col>
        //                     <Col style={{display: 'flex', justifyContent: 'space-between'}}>
        //                         <Col span={12}>
        //                             <Skeleton active={true} loading={fetchingGetOrder}>
        //                                 <Form.Item rules={[{required: true, message: ''}]} name={'payType'}>
        //                                     <Select placeholder={'Way for pay'}>
        //                                         {payTypeConfigView.map((value) =>
        //                                             <Select.Option value={value}>{value}</Select.Option>
        //                                         )}
        //                                     </Select>
        //                                 </Form.Item>
        //                             </Skeleton>
        //                         </Col>
        //                         <Col span={12}>
        //                             <Skeleton active={true} loading={fetchingGetOrder}>
        //                                 <Form.Item rules={[{required: true, message: ''}]} name={'weight'}>
        //                                     <Select>
        //                                         {weightConfigView.map((value) =>
        //                                             <Select.Option value={value}>{value}</Select.Option>
        //                                         )}
        //                                     </Select>
        //                                 </Form.Item>
        //                             </Skeleton>
        //                         </Col>
        //                     </Col>
        //                 </Form>
        //                 <Divider style={{marginTop: 0}}/>
        //                 <Col>
        //                     <Alert
        //                         message={'Each courier pays a deposit to fulfill delivery orders, so in case of loss of cargo,\n' +
        //                         'we will compensate the cost within three working days in accordance with the regulations.'}
        //                         type={'warning'}
        //                     />
        //                 </Col>
        //                 <Divider/>
        //                 {formCardConfigView.map(({type, ref, state}) =>
        //                     <Col>
        //                         <FormCard onAddressChange={onAddressChangeFormCardHandler} state={state}
        //                                   loadingData={fetchingGetOrder} formRef={ref}/>
        //                     </Col>
        //                 )}
        //                 <Divider/>
        //                 <Row>
        //                     <Col span={24}>
        //                         <Skeleton active={true} loading={fetchingGetOrder}>
        //                             <Row gutter={[0, 20]}>
        //                                 {
        //                                     initialStateOrderForm.deliveryPrice ?
        //                                         <Col span={24}>
        //                                             <Alert type={'success'}
        //                                                    message={`The cost of delivery will be: ${initialStateOrderForm.deliveryPrice}$`}/>
        //                                         </Col> : null
        //                                 }
        //                                 {getFooterView()}
        //                             </Row>
        //
        //                         </Skeleton>
        //                     </Col>
        //                 </Row>
        //                 <Divider/>
        //             </Col>
        //         </Row>
        //     </Form.Provider>
        // </div>
    );
};
