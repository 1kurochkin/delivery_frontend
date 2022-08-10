import React, {useEffect, useState} from 'react';
import Title from "antd/lib/typography/Title";
import {Button, Col, Divider, Form, Input, notification, Row, Select, Spin, Typography} from "antd";
import {useForm} from "antd/es/form/Form";
import {useCountOrderPriceAndDurationMutation, useCreateOrderMutation} from "../../store/reducers/backend/backend.api";
import {DeliveryTypeEnum, OrderPointTypeEnum, PayTypeEnum} from "../../store/reducers/backend/backend.api.types";
import {FormCard} from "../../components/form/form.card.component";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../configs/constants";

export function OrderPage() {
    const [orderForm] = useForm();
    const [pickupForm] = useForm();
    const [deliveryForm] = useForm();
    const navigate = useNavigate();
    const [filledAddresses, setFilledAddresses] = useState({
        [OrderPointTypeEnum.Pickup]: false,
        [OrderPointTypeEnum.Delivery]: false,
    });

    const [
        fetchCountOrderPriceAndDuration,
        {error: error1, isLoading: fetchingCountOrderPriceAndDuration, data: countOrderPriceAndDurationData}
    ] = useCountOrderPriceAndDurationMutation();
    const {data: {message: errorCountOrderPriceAndDuration = undefined} = {}} = error1 as any || {};
    useEffect(() => {
        if(
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
        {error: error2, isLoading: fetchingCreateOrder, data: createOrderData}
    ] = useCreateOrderMutation();
    const {data: {message: errorCreateOrder = undefined} = {}} = error2 as any || {};
    useEffect(() => {
        if(createOrderData) {
            orderForm.resetFields();
            pickupForm.resetFields();
            deliveryForm.resetFields();
            navigate(ROUTES.LIST_ORDERS);
        }
    }, [createOrderData])

    //--------CATCH-ERRORS------//
    if(errorCountOrderPriceAndDuration || errorCreateOrder) {
        notification.error({message: errorCountOrderPriceAndDuration || errorCreateOrder})
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
            ]);
            fetchCreateOrder({
                ...orderForm.getFieldsValue(),
                pickupPoint: pickupForm.getFieldsValue(),
                deliveryPoints: [deliveryForm.getFieldsValue()],
            })
        } catch (e) {
            notification.error({message: 'Fill all fields please!'})
            return;
        }
        // console.log(name, 'onFinishFormHandler')

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

    return (
        <div className={'container'}>
            <Form.Provider onFormFinish={onFinishFormHandler}>
                {/*<Space size={50} direction={'vertical'}>*/}
                <Row gutter={20} justify={'space-between'}>
                    <Col span={6}>
                        <Title>Create order</Title>
                    </Col>
                    <Col span={14}>
                        <Form form={orderForm} name={'settingsForm'}>
                            <Col style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Col span={7}>
                                    <Form.Item rules={[{required: true, message: ''}]} name={'deliveryType'}>
                                        <Select defaultValue={deliveryTypeConfigView[0].value}>
                                            {deliveryTypeConfigView.map(({value}) =>
                                                <Select.Option value={value}>{value}</Select.Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={7} offset={1}>
                                    <Form.Item rules={[{required: true, message: ''}]} name={'packageCost'}>
                                        <Input placeholder={'Package cost in $'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={7} offset={1}>
                                    <Form.Item rules={[{required: true, message: ''}]} name={'packageType'}>
                                        <Input placeholder={'Type of package'}/>
                                    </Form.Item>
                                </Col>
                            </Col>
                            <Col style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Col span={12}>
                                    <Form.Item rules={[{required: true, message: ''}]} name={'payType'}>
                                        <Select placeholder={'Way for pay'}>
                                            {payTypeConfigView.map(({value}) =>
                                                <Select.Option value={value}>{value}</Select.Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item rules={[{required: true, message: ''}]} name={'weight'}>
                                        <Select defaultValue={weightConfigView[0].value}>
                                            {weightConfigView.map(({value}) =>
                                                <Select.Option value={value}>{value}</Select.Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Col>
                        </Form>
                        <Divider style={{marginTop: 0}}/>
                        <Col>
                            <Typography.Paragraph>
                                Each courier pays a deposit to fulfill delivery orders, so in case of loss of cargo,
                                we will compensate the cost within three working days in accordance with the
                                regulations.
                            </Typography.Paragraph>
                        </Col>
                        <Divider/>
                        {/*<Col style={{display: 'flex', justifyContent: 'space-between'}}>*/}
                            {formCardConfigView.map(({type, ref}) =>
                                <Col>
                                    <FormCard onAddressFilled={onAddressFilledHandler} type={type} formRef={ref}/>
                                </Col>
                            )}
                        {/*</Col>*/}
                        <Divider/>
                        <Col style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Col span={11}>
                                {
                                    fetchingCountOrderPriceAndDuration ?
                                        <Spin/> :
                                        <Typography.Paragraph>
                                            {`The cost of delivery will be: ${countOrderPriceAndDurationData?.price || 10}$`}
                                        </Typography.Paragraph>
                                }
                            </Col>
                            <Col span={11}>
                                <Button
                                    disabled={errorCountOrderPriceAndDuration}
                                    loading={fetchingCountOrderPriceAndDuration || fetchingCreateOrder}
                                    onClick={onFinishFormHandler}
                                    style={{width: '100%'}}
                                    htmlType={'submit'}>
                                    Create order
                                </Button>
                            </Col>

                        </Col>
                    </Col>
                </Row>
            </Form.Provider>
        </div>
    );
};
