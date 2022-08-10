import React, {useEffect, useState} from 'react';
import {Button, Col, List, Modal, notification, Row, Skeleton, Typography} from "antd";
import {
    useChangeOrderStatusMutation,
    useLazyGetOrdersQuery,
    useTakeOrderMutation
} from "../../store/reducers/backend/backend.api";
import {DeliveryStatusEnum, OrderType, UserRoleEnum} from "../../store/reducers/backend/backend.api.types";
import {PAGINATION} from "../../configs/app.constants";
import './orders.page.style.scss'
import {OrderCard} from "../../components/orderCard/order.card.component";
import {useAppSelector} from "../../hooks/useAppSelector";
import {useModalSupport} from "../../components/modal/modal.support.component";

const data = [
    {
        id: '1',
        courierId: '1',
        pickupPoint: {
            address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
            timeRangeFrom: '10 am',
            timeRangeTo: '18 pm',
            date: 'Today',
            phone: '+19168918139',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque dolorum eos fuga inventore magni maxime mollitia porro quae'
        },
        deliveryPoints: [
            {
                address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
                timeRangeFrom: '10 am',
                timeRangeTo: '18 pm',
                date: 'Tomorrow',
                phone: '+19168918139',
                comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque dolorum eos fuga inventore magni maxime mollitia porro quae'
            }
        ],
        weight: 'Under 1 lb',
        packageType: 'Flowers',
        deliveryPrice: 20,
        payType: 'Sender by cash',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        pickupPoint: {
            address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
            timeRangeFrom: '10 am',
            timeRangeTo: '18 pm',
            date: 'Tomorrow',
            phone: '+19168918139',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque dolorum eos fuga inventore magni maxime mollitia porro quae'
        },
        deliveryPoints: [
            {
                address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
                timeRangeFrom: '10 am',
                timeRangeTo: '18 pm',
                date: 'Tomorrow',
                phone: '+19168918139',
                comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque dolorum eos fuga inventore magni maxime mollitia porro quae'
            }
        ],
        weight: 'Under 1 lb',
        packageType: 'Flowers',
        deliveryPrice: 20,
        payType: 'Sender by cash',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        pickupPoint: {
            address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
            timeRangeFrom: '10 am',
            timeRangeTo: '18 pm',
            date: 'Tomorrow'
        },
        deliveryPoints: [
            {
                address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
                timeRangeFrom: '10 am',
                timeRangeTo: '18 pm',
                date: 'Tomorrow'
            }
        ],
        weight: 'Under 1 lb',
        packageType: 'Flowers',
        deliveryPrice: 20,
        payType: 'Sender by cash',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '4',
        pickupPoint: {
            address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
            timeRangeFrom: '10 am',
            timeRangeTo: '18 pm',
            date: 'Tomorrow'
        },
        deliveryPoints: [
            {
                address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
                timeRangeFrom: '10 am',
                timeRangeTo: '18 pm',
                date: 'Tomorrow'
            }
        ],
        weight: 'Under 1 lb',
        packageType: 'Flowers',
        deliveryPrice: 20,
        payType: 'Sender by cash',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '5',
        pickupPoint: {
            address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
            timeRangeFrom: '10 am',
            timeRangeTo: '18 pm',
            date: 'Tomorrow'
        },
        deliveryPoints: [
            {
                address: '1299 Ocean ave, apt 4H, Brooklyn, NY, 11230',
                timeRangeFrom: '10 am',
                timeRangeTo: '18 pm',
                date: 'Tomorrow'
            }
        ],
        weight: 'Under 1 lb',
        packageType: 'Flowers',
        deliveryPrice: 20,
        payType: 'Sender by cash',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export enum OrderPageTabsEnum {
    Available= 'Available',
    Active = 'Active',
    Completed = 'Completed',
    MyOrders = 'My orders',
    InProcess = 'In process',
}
type ModalStateType = {visible: boolean, type: 'Take' | 'Complete' | 'Cancel' | 'Support'}

export function OrdersPage() {
    const userRole = useAppSelector(({settings}) => settings.role);
    const [activeTab, setActiveTab] = useState<OrderPageTabsEnum>(OrderPageTabsEnum.Available);
    const [dataSource, setDataSource] = useState<OrderType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tookOrderId, setTookOrderId] = useState<string>('');
    const [modalState, setModalState] = useState<ModalStateType>({visible: false, type: 'Take'});
    const {modal: modalSupport, setVisible: setVisibleModalSupport} = useModalSupport()

    const [
        fetchGetOrders,
        {
            error: error1,
            isLoading: fetchingGetOrders,
            data: {
                list: getOrdersData = [],
                pagination: {total: getOrdersDataPaginationTotal = 0} = {}
            } = {}
        }
    ] = useLazyGetOrdersQuery();
    const {data: {message: errorGetOrders = undefined} = {}} = error1 as any || {};
    useEffect(() => {
        console.log('useEffect fetchGetOrders')
        fetchGetOrders({
            filter: {},
            pagination: {skip: 0, take: PAGINATION.TAKE}
        });
    }, [])
    useEffect(() => {
        if(getOrdersData.length) {
            console.log('useEffect setDataSource')
            setDataSource(dataSource.concat(getOrdersData))
        }
    }, [getOrdersData])

    const [
        fetchTakeOrder,
        {error: error2, isLoading: fetchingTakeOrder, data: takeOrderData}
    ] = useTakeOrderMutation();
    const {data: {message: errorTakeOrder = undefined} = {}} = error2 as any || {};
    useEffect(() => {
        console.log('useEffect takeOrderData')
        if(takeOrderData) {
            onTakeOrfetchChangeOrderStatusIsOk(`Order #${tookOrderId} was taken!`)
        }
    }, [takeOrderData])

    const [
        fetchChangeOrderStatus,
        {error: error3, isLoading: fetchingfetchChangeOrderStatus, data: completeOrderData}
    ] = useChangeOrderStatusMutation();
    const {data: {message: errorfetchChangeOrderStatus = undefined} = {}} = error3 as any || {};
    useEffect(() => {
        console.log('useEffect completeOrderData')
        if(completeOrderData) {
            onTakeOrfetchChangeOrderStatusIsOk(`Order #${tookOrderId} was complete!`)
        }
    }, [completeOrderData])

    //--------CATCH-ERRORS------//
    if (errorGetOrders || errorTakeOrder || errorfetchChangeOrderStatus) {
        notification.error({message: errorGetOrders || errorTakeOrder || errorfetchChangeOrderStatus})
    }
    //-------------------------//

    const onTakeOrfetchChangeOrderStatusIsOk = (message: string) => {
        setDataSource(dataSource.filter(({id}) => id !== tookOrderId));
        notification.success({message});
        setTookOrderId('');
        setModalState({visible: false, type: "Take"});
    }

    const onClickTabButtonHandler = (tabLabel: OrderPageTabsEnum) => {
        console.log('onClickTabButtonHandler')
        setActiveTab(tabLabel);
        setDataSource([])
        fetchGetOrders({
            filter: GetOrdersFilterMap.get(tabLabel),
            pagination: {skip: 0, take: PAGINATION.TAKE}
        });
    }
    const onClickLoadMoreButtonHandler = () => {
        console.log('onClickLoadMoreButtonHandler')
        if (currentPage >= getOrdersDataPaginationTotal) return;
        else {
            setCurrentPage((prev) => prev++)
            fetchGetOrders({
                filter: GetOrdersFilterMap.get(activeTab),
                pagination: {skip: currentPage * PAGINATION.TAKE, take: PAGINATION.TAKE}
            });
        }
    }
    const onClickButtonInOrderCardHandler = (orderId: string, modalType: ModalStateType['type']) => {
        console.log('onClickButtonInOrderCardHandler')
        setTookOrderId(orderId);
        if(modalType === 'Support') {
            setVisibleModalSupport(true); return;
        }
        setModalState({visible: true, type: modalType});
    }
    const onClickOkModalButtonHandler = () => {
        console.log('onClickOkModalButtonHandler')
        switch (modalState.type) {
            case "Take": fetchTakeOrder(tookOrderId); return;
            case "Complete": fetchChangeOrderStatus({
                orderId: tookOrderId,
                status: DeliveryStatusEnum.Delivered
            }); return;
            case "Cancel": fetchChangeOrderStatus({
                orderId: tookOrderId,
                status: DeliveryStatusEnum.Canceled
            }); return;
            default: return;
        }
    }

    const onClickCancelModalButtonHandler = () => {
        console.log('onClickCancelModalButtonHandler')
        if(fetchingTakeOrder || fetchingfetchChangeOrderStatus) return;
        setModalState({visible: false, type: 'Take'})
    }

    const GetOrdersFilterMap = new Map([
        [OrderPageTabsEnum.Available, {}],
        [OrderPageTabsEnum.Active, {active: true}],
        [OrderPageTabsEnum.Completed, {completed: true}]
    ]);

    const tabPaneViewConfig = [
        {tabLabel: OrderPageTabsEnum.Available},
        {tabLabel: OrderPageTabsEnum.Active},
        {tabLabel: OrderPageTabsEnum.Completed},
    ]


    return (
        <div className={'orders-page'}>
            <Modal
                visible={modalState.visible}
                onOk={onClickOkModalButtonHandler}
                confirmLoading={(fetchingTakeOrder || fetchingfetchChangeOrderStatus)}
                onCancel={onClickCancelModalButtonHandler}
            >
                <Typography.Paragraph>Are you sure?</Typography.Paragraph>
            </Modal>
            {modalSupport}
            <List
                split bordered
                grid={{gutter: 16, column: 1}}
                header={
                    <Row justify={'space-between'}>
                        {tabPaneViewConfig.map(({tabLabel}) =>
                            <Col span={7}>
                                <Button onClick={() => onClickTabButtonHandler(tabLabel)}
                                        style={{width: '100%'}}>{tabLabel}</Button>
                            </Col>
                        )}
                    </Row>
                }
                dataSource={data as typeof getOrdersData || getOrdersData}
                renderItem={(item) =>
                    <Skeleton avatar title={false} loading={fetchingGetOrders} active>
                        <OrderCard userRole={userRole}
                                   onClickCancelButton={(orderId) => onClickButtonInOrderCardHandler(orderId, 'Cancel')}
                                   onClickSupportButton={(orderId) => onClickButtonInOrderCardHandler(orderId, 'Support')}
                                   onClickCompleteButton={(orderId) => onClickButtonInOrderCardHandler(orderId, 'Complete')}
                                   onClickTakeButton={(orderId) => onClickButtonInOrderCardHandler(orderId, 'Take')}
                                   {...item} type={activeTab}
                        />
                    </Skeleton>
                }
                footer={
                    <Row justify={'center'}>
                        <Col span={12}>
                            <Button style={{width: '100%'}} onClick={onClickLoadMoreButtonHandler}>
                                Loading more
                            </Button>
                        </Col>
                    </Row>
                }
            />
        </div>
    );
}

;