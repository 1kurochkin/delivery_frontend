import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, Modal, Row, Timeline, Typography} from "antd";
import {
    useChangeOrderStatusMutation,
    useLazyGetOrderQuery,
    useTakeOrderMutation
} from "../store/reducers/backend/backend.api";
import {useAppSelector} from "../hooks/useAppSelector";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ButtonBack} from "../components/buttonBack.component";
import {OrderStatusEnum, UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {COLORS, ROUTES} from "../configs/app.constants";
import {SizeType} from "antd/es/config-provider/SizeContext";
import {useModalSupport} from "../components/modalSupport.component";
import moment from "moment";
import {Preloader} from "../components/preloader.component";


export function OrderScreen() {
    const {orderId} = useParams();
    const userRole = useAppSelector(({settings}) => settings.role);
    const IS_USER_ROLE_CUSTOMER = userRole === UserRoleEnum.Customer;
    const navigate = useNavigate();
    const [modalState, setModalState] = useState({
        cancel: false,
        take: false,
        complete: false,
        support: false
    });
    const setModalStateHandler = (name: string, bool: boolean) => {
        setModalState((prev) => ({...prev, [name]: bool}));
    }
    const {modal: modalSupport, setVisible: setVisibleModalSupport} = useModalSupport()

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchGetOrder(Number(orderId))
    }, [orderId]);

    const [
        fetchGetOrder,
        {
            isFetching: fetchingGetOrder = true,
            data: {
                id = 0,
                status = '',
                pickupPoint = undefined,
                deliveryPoint = undefined,
                comment = undefined,
                payType = undefined,
                packageType = undefined,
                weight = undefined,
                deliveryPrice = undefined,
                courier = undefined,
                customer = undefined,
            } = {}
        }
    ] = useLazyGetOrderQuery();
    const IS_AVAILABLE_STATUS = status === OrderStatusEnum.Available;
    const IS_ACTIVE_STATUS = status === OrderStatusEnum.Active;
    const IS_CANCEL_STATUS = status === OrderStatusEnum.Canceled;
    const IS_COMPLETE_STATUS = status === OrderStatusEnum.Completed;
    const customerOrCourierInfo = courier || customer
    const [
        fetchTakeOrder,
        {isLoading: fetchingTakeOrder}
    ] = useTakeOrderMutation();

    const [
        fetchChangeOrderStatus,
        {isLoading: fetchingChangeOrderStatus}
    ] = useChangeOrderStatusMutation();

    const onClickUpdateButton = () => {
        navigate(ROUTES.UPDATE_ORDER.PATH + '/' + orderId)
    }
    const onClickOkCancelModal = () => {
        fetchChangeOrderStatus({orderId: id, status: OrderStatusEnum.Canceled})
            .unwrap()
            .then(() => setModalStateHandler('cancel', false))
            .catch(() => setModalStateHandler('cancel', false));
    }
    const onClickOkTakeModal = async () => {
        fetchTakeOrder(id)
            .unwrap()
            .then(() => setModalStateHandler('take', false))
            .catch(() => setModalStateHandler('take', false));

    }
    const onClickOkCompleteModal = async () => {
        await fetchChangeOrderStatus({orderId: id, status: OrderStatusEnum.Completed})
            .unwrap()
            .then(() => setModalStateHandler('complete', false))
            .catch(() => setModalStateHandler('complete', false));
    }

    const actionButtonViewConfig = [
        IS_USER_ROLE_CUSTOMER && IS_AVAILABLE_STATUS && {
            type: 'primary',
            size: 'large',
            onClick: onClickUpdateButton,
            label: 'Correct the order'
        },
        !IS_USER_ROLE_CUSTOMER && IS_AVAILABLE_STATUS && {
            size: 'large',
            onClick: () => setModalStateHandler('take', true),
            label: 'Take the order'
        },
        !IS_USER_ROLE_CUSTOMER && IS_ACTIVE_STATUS && {
            size: 'large',
            onClick: () => setModalStateHandler('complete', true),
            label: 'Complete the order'
        },
    ]

    const modalWindowViewConfig = [
        IS_USER_ROLE_CUSTOMER && IS_AVAILABLE_STATUS && {
            name: 'cancel',
            onOk: onClickOkCancelModal,
            loading: fetchingChangeOrderStatus,
            text: 'Are you sure you want to cancel your order?'
        },
        !IS_USER_ROLE_CUSTOMER && IS_AVAILABLE_STATUS && {
            name: 'take',
            onOk: onClickOkTakeModal,
            loading: fetchingTakeOrder,
            text: 'Are you sure you want to take this order?'
        },
        !IS_USER_ROLE_CUSTOMER && IS_ACTIVE_STATUS && {
            name: 'complete',
            onOk: onClickOkCompleteModal,
            loading: fetchingChangeOrderStatus,
            text: 'Have you completed this order?'
        },
    ]
    const textColorByStatus = {
        [OrderStatusEnum.Available]: COLORS.SUCCESS,
        [OrderStatusEnum.Active]: COLORS.BLUE,
        [OrderStatusEnum.Canceled]: COLORS.ERROR,
        [OrderStatusEnum.Completed]: COLORS.SECOND,
    }

    const packageInformationViewConfig = [
        {label: 'Payment type:', value: payType},
        {label: 'Package type:', value: packageType},
        {label: 'Package weight', value: weight},
    ]
    return (
        <>
            {fetchingGetOrder && <Preloader type={"fullscreen"}/>}
            {modalWindowViewConfig.map((modalConfig) => {
                if (!modalConfig) return null;
                const {name, onOk, loading, text} = modalConfig;
                return (
                    <Modal
                        // @ts-ignore
                        visible={modalState[name]}
                        footer={
                            <Row justify={"space-around"}>
                                <Col span={10}>
                                    <Button loading={loading} style={{backgroundColor: 'red'}}
                                            onClick={() => setModalStateHandler(name, false)}>No</Button>
                                </Col>
                                <Col span={10}>
                                    <Button loading={loading} onClick={onOk}>Yes</Button>
                                </Col>
                            </Row>
                        }
                    >
                        <Typography.Title level={5}>{text}</Typography.Title>
                    </Modal>
                )
            })}
            {modalSupport}
            <Row style={{alignItems: 'center', marginBottom: 20}} justify={'space-between'}>
                <ButtonBack onClick={() => navigate(-1)}/>
                <Typography.Title style={{marginBottom: 0}} level={2}>Order #{id}</Typography.Title>
            </Row>
            <Row>
                <Typography.Paragraph>
                    Status: <span className={'font-bold'} style={{color: textColorByStatus[status]}}>{status}</span>
                </Typography.Paragraph>
            </Row>
            <Row>
                <Typography.Title level={3}>Delivery Information</Typography.Title>
                <Timeline>
                    <Timeline.Item>
                        <TimeLineOrderScreenItem
                            address={pickupPoint?.address}
                            date={pickupPoint?.date}
                            timeRangeFrom={pickupPoint?.timeRangeFrom}
                            timeRangeTo={pickupPoint?.timeRangeTo}
                            phone={pickupPoint?.phone}
                        />
                    </Timeline.Item>
                    <Timeline.Item>
                        <TimeLineOrderScreenItem
                            address={deliveryPoint?.address}
                            date={deliveryPoint?.date}
                            timeRangeFrom={deliveryPoint?.timeRangeFrom}
                            timeRangeTo={deliveryPoint?.timeRangeTo}
                            phone={deliveryPoint?.phone}
                        />
                    </Timeline.Item>
                </Timeline>
                <Button style={{marginBottom: 10}} type={"primary"}>
                    <a href={`https://www.google.com/maps/dir/${pickupPoint?.address}/${deliveryPoint?.address}`}>
                        Look up the route on Google Maps
                    </a>
                </Button>
            </Row>
            <Row>

            </Row>
            {
                comment &&
                <Row>
                    <Form.Item labelCol={{span: 24}} style={{width: '100%'}} label={'Comment for courier'}>
                        <Input.TextArea onChange={() => null} value={comment}/>
                    </Form.Item>
                </Row>
            }

            <Row style={{marginTop: 30 ,marginBottom: 25}}>
                <Typography.Title level={3}>Parcel Information</Typography.Title>
                {packageInformationViewConfig.map(({label, value}) =>
                    <Typography.Paragraph style={{display: 'block', width: '100%', margin: 0}}>
                        {label} <span className={'font-bold'}>{value}</span>
                    </Typography.Paragraph>
                )}
            </Row>
            {
                customerOrCourierInfo &&
                <Row style={{marginBottom: 25}}>
                    <Typography.Title level={3}>
                        {`${IS_USER_ROLE_CUSTOMER ? 'Courier' : 'Customer'} Information`}
                    </Typography.Title>
                        {
                            customerOrCourierInfo?.name &&
                            <Typography.Paragraph style={{display: 'block', width: '100%'}}>Name: {customerOrCourierInfo?.name}</Typography.Paragraph>
                        }
                        <a style={{display: 'block', width: '100%'}} href={`tel:${customerOrCourierInfo?.phone}`}>
                            Phone: <span className={'font-bold'} style={{textDecoration: 'underline'}}>+{customerOrCourierInfo?.phone}</span>
                        </a>
                </Row>
            }
            <Row style={{marginBottom: 25}} justify={'space-between'}>
                <Col span={16}><Typography.Title level={3}>Order price</Typography.Title></Col>
                <Col span={8}>
                    <Typography.Title className={'text-color-second'} style={{textAlign: 'right'}} level={2}>
                        ${deliveryPrice}
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify={'center'}>
                {actionButtonViewConfig.map((btnConfig) => {
                    if (!btnConfig) return null;
                    const {type, size, onClick, label} = btnConfig;
                    return (
                        <Button type={type as 'primary'} size={size as SizeType} style={{marginBottom: 20}}
                                onClick={onClick}>
                            {label}
                        </Button>
                    )
                })}
                {
                    IS_USER_ROLE_CUSTOMER && !IS_ACTIVE_STATUS && !IS_CANCEL_STATUS && !IS_COMPLETE_STATUS &&
                    <Typography.Paragraph
                        style={{textDecoration: 'underline'}}
                        onClick={() => setModalStateHandler('cancel', true)}
                    >
                        Cancel order
                    </Typography.Paragraph>
                }
            </Row>
            <Row justify={'center'}>
                <Typography.Paragraph style={{textDecoration: 'underline', marginTop: 20}}
                                      onClick={() => setVisibleModalSupport(true)}>
                    Support
                </Typography.Paragraph>
            </Row>
        </>
    );
};

const TimeLineOrderScreenItem = ({address, date, timeRangeFrom, timeRangeTo, phone}) => {
    return (
        <>
            <Row>
                <Typography.Title style={{marginBottom: 0}} level={5}>{address}</Typography.Title>
                <Row>
                    <Typography.Paragraph style={{fontSize: 12, marginBottom: 5}}>
                        {`${moment(date).format('MM/DD')}`}
                    </Typography.Paragraph>
                    <Typography.Paragraph style={{fontSize: 12, marginBottom: 0, marginLeft: 40}}>
                        {`from ${moment(timeRangeFrom).format('HH:MM A')} to ${moment(timeRangeTo).format('HH:MM A')}`}
                    </Typography.Paragraph>
                </Row>
            </Row>
            {phone && <a className={'font-bold'} style={{textDecoration: 'underline'}} href={`tel:${phone}`}>Phone: +{phone}</a>}
        </>
    )
}