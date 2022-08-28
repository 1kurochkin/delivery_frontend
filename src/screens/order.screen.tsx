import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, Modal, Row, Timeline, Typography} from "antd";
import {
    useChangeOrderStatusMutation,
    useLazyGetOrderQuery,
    useTakeOrderMutation
} from "../store/reducers/backend/backend.api";
import {useAppSelector} from "../hooks/useAppSelector";
import {useNavigate, useParams} from "react-router-dom";
import {ButtonBack} from "../components/buttonBack.component";
import {OrderStatusEnum, UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {ROUTES} from "../configs/app.constants";
import {SizeType} from "antd/es/config-provider/SizeContext";
import {useModalSupport} from "../components/modalSupport.component";
import moment from "moment";


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
        console.log('MOUNT')
        fetchGetOrder(Number(orderId))
    }, [orderId]);

    const [
        fetchGetOrder,
        {
            isFetching: fetchingGetOrder,
            data: {
                id = 0,
                status = '',
                pickupPoint = undefined,
                deliveryPoint = undefined,
                comment = '',
                payType = '',
                packageType = '',
                weight = '',
                deliveryPrice = '',
                courier = undefined,
                customer = undefined,
            } = {}
        }
    ] = useLazyGetOrderQuery();
    const IS_ACTIVE_STATUS = status === OrderStatusEnum.Active;
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
        navigate(ROUTES.ORDER.UPDATE_PAGE.PATH + '/' + orderId)
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
        IS_USER_ROLE_CUSTOMER && !IS_ACTIVE_STATUS && {size: 'large', onClick: onClickUpdateButton, label: 'Update the order'},
        IS_USER_ROLE_CUSTOMER && !IS_ACTIVE_STATUS && {
            type: 'primary',
            onClick: () => setModalStateHandler('cancel', true),
            label: 'Cancel the order'
        },
        !IS_USER_ROLE_CUSTOMER && !IS_ACTIVE_STATUS && {
            size: 'large',
            onClick: () => setModalStateHandler('take', true),
            label: 'Take the order'
        },
        !IS_USER_ROLE_CUSTOMER && IS_ACTIVE_STATUS && {
            size: 'large',
            onClick: () => setModalStateHandler('complete', true),
            label: 'Complete the order'
        },
        {onClick: () => setVisibleModalSupport(true), label: 'Support'},
    ]

    const modalWindowViewConfig = [
        IS_USER_ROLE_CUSTOMER && {
            name: 'cancel',
            onOk: onClickOkCancelModal,
            loading: fetchingChangeOrderStatus,
            text: 'Are you sure you want to cancel your order?'
        },
        !IS_USER_ROLE_CUSTOMER && {
            name: 'take',
            onOk: onClickOkTakeModal,
            loading: fetchingTakeOrder,
            text: 'Are you sure you want to take this order?'
        },
        !IS_USER_ROLE_CUSTOMER && {
            name: 'complete',
            onOk: onClickOkCompleteModal,
            loading: fetchingChangeOrderStatus,
            text: 'Have you completed this order?'
        },
    ]
    return (
        <>
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
            <Row justify={"space-between"}>
                <ButtonBack onClick={() => navigate(-1)}/>
                <Typography.Title style={{textAlign: 'right'}}>
                    Order #{id}
                </Typography.Title>
            </Row>
            <Row>
                <Typography.Paragraph>
                    Status: {status}
                </Typography.Paragraph>
            </Row>
            <Row>

                <Timeline>
                    <Timeline.Item>
                        <Typography.Title level={5}>{pickupPoint?.address}</Typography.Title>
                        {/*<Typography.Paragraph>{`Apt: ${pickupPoint?.apt} Floor: ${pickupPoint?.floor}`}</Typography.Paragraph>*/}
                        <Typography.Paragraph>{`${moment(pickupPoint?.date).format('MM/DD')} from ${moment(pickupPoint?.timeRangeFrom).format('HH:MM A')} to ${moment(deliveryPoint?.timeRangeTo).format('HH:MM A')}`}</Typography.Paragraph>
                        <Typography.Paragraph>{pickupPoint?.phone}</Typography.Paragraph>
                    </Timeline.Item>
                    <Timeline.Item>
                        <Typography.Title level={5}>{deliveryPoint?.address}</Typography.Title>
                        {/*<Typography.Paragraph>{`Apt: ${deliveryPoint?.apt} Floor: ${deliveryPoint?.floor}`}</Typography.Paragraph>*/}
                        <Typography.Paragraph>{`${moment(deliveryPoint?.date).format('MM/DD')} from ${moment(deliveryPoint?.timeRangeFrom).format('HH:MM A')} to ${moment(deliveryPoint?.timeRangeTo).format('HH:MM A')}`}</Typography.Paragraph>
                        <Typography.Paragraph>{deliveryPoint?.phone}</Typography.Paragraph>
                    </Timeline.Item>
                </Timeline>
            </Row>
            {
                comment &&
                <Row style={{marginBottom: 10}}>
                    <Form.Item labelCol={{span: 24}} style={{width: '100%'}} label={'Comment for courier'}>
                        <Input.TextArea value={comment}/>
                    </Form.Item>
                </Row>
            }

            <Row style={{marginBottom: 25}}>
                <Typography.Title level={3}>Parcel Information</Typography.Title>
                <Col span={24}>
                    <Typography.Paragraph>Pay type: {payType}</Typography.Paragraph>
                </Col>
                <Col span={24}>
                    <Typography.Paragraph>Package type: {packageType}</Typography.Paragraph>
                </Col>
                <Col span={24}>
                    <Typography.Paragraph>Wight: {weight}</Typography.Paragraph>
                </Col>
            </Row>
            {
                customerOrCourierInfo &&
                <Row style={{marginBottom: 25}}>
                    <Typography.Title level={3}>
                        {`${IS_USER_ROLE_CUSTOMER ? 'Courier' : 'Customer'} Information`}
                    </Typography.Title>
                    <Col span={24}>
                        <Typography.Paragraph>Name: {customerOrCourierInfo?.name}</Typography.Paragraph>
                    </Col>
                    <Col span={24}>
                        <Typography.Paragraph>Phone: {customerOrCourierInfo?.phone}</Typography.Paragraph>
                    </Col>
                </Row>
            }
            <Row style={{marginBottom: 25}} justify={'space-between'}>
                <Col span={16}><Typography.Title level={2}>Order price</Typography.Title></Col>
                <Col span={8}>
                    <Typography.Title style={{textAlign: 'right'}} level={2}>
                        ${deliveryPrice}
                    </Typography.Title>
                </Col>
            </Row>
            <Row>
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
            </Row>
        </>
    );
}

;