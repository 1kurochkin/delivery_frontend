import React, {useEffect, useMemo, useState} from 'react';
import {Affix, Button, Col, Divider, List, Modal, notification, Row, Skeleton, Spin, Typography} from "antd";
import {
    backendApi,
    useChangeOrderStatusMutation, useGetOrdersQuery,
    useLazyGetOrdersQuery,
    useTakeOrderMutation
} from "../../store/reducers/backend/backend.api";
import {OrderStatusEnum, OrderType, UserRoleEnum} from "../../store/reducers/backend/backend.api.types";
import {PAGINATION, ROUTES} from "../../configs/app.constants";
import './orders.page.style.scss'
import {OrderCard} from "../../components/orderCard/order.card.component";
import {useAppSelector} from "../../hooks/useAppSelector";
import {useModalSupport} from "../../components/modal/modal.support.component";
import {useNavigate} from "react-router-dom";
import {useInfiniteQuery} from "../../hooks/useInfinityQuery";
import {usePrevious} from "../../hooks/usePrevious";
import InfiniteScroll from 'react-infinite-scroll-component';


type ModalStateType = { visible: boolean, type: 'Take' | 'Complete' | 'Cancel' | 'Support' | 'Update' }

export function OrdersPage() {
    const userRole = useAppSelector(({settings}) => settings.role);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<OrderStatusEnum>(OrderStatusEnum.Available);
    const [dataSource, setDataSource] = useState<OrderType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tookOrderId, setTookOrderId] = useState<string>('');
    const [modalState, setModalState] = useState<ModalStateType>({visible: false, type: 'Take'});
    const {modal: modalSupport, setVisible: setVisibleModalSupport} = useModalSupport()

    const [
        fetchGetOrders,
        {
            error: error1,
            isFetching: fetchingGetOrders,
            data: {
                list: getOrdersData = [],
                pagination: {total: getOrdersDataPaginationTotal = 0} = {}
            } = {}
        }
    ] = useLazyGetOrdersQuery();
    const {data: {message: errorGetOrders = undefined} = {}} = error1 as any || {};
    const prevFetchingGetOrders = usePrevious(fetchingGetOrders)
    useEffect(() => {
        console.log('useEffect fetchGetOrders', getOrdersData)
        fetchGetOrders({
            status: OrderStatusEnum.Available,
            skip: 0,
            take: PAGINATION.TAKE
        });
    }, [])

    useEffect(() => {
        console.log('useEffect LOAD MORE', prevFetchingGetOrders, fetchingGetOrders)
        if (prevFetchingGetOrders && !fetchingGetOrders) {
            setDataSource([...dataSource, ...getOrdersData])
        }
    }, [fetchingGetOrders])

    // useEffect(() => {
    //     window.scrollTo(0, document.body.scrollHeight);
    // }, [dataSource])


    const [
        fetchTakeOrder,
        {error: error2, isLoading: fetchingTakeOrder, data: takeOrderData}
    ] = useTakeOrderMutation();
    const {data: {message: errorTakeOrder = undefined} = {}} = error2 as any || {};
    useEffect(() => {
        if (takeOrderData) {
            console.log('useEffect takeOrderData')
            onTakeOrFetchChangeOrderStatusIsOk(`Order #${tookOrderId} was taken!`)
        }
    }, [takeOrderData])

    const [
        fetchChangeOrderStatus,
        {error: error3, isLoading: fetchingChangeOrderStatus, data: changeStatusData}
    ] = useChangeOrderStatusMutation();
    const {data: {message: errorChangeOrderStatus = undefined} = {}} = error3 as any || {};
    useEffect(() => {
        if (changeStatusData) {
            console.log('useEffect completeOrderData')
            onTakeOrFetchChangeOrderStatusIsOk(`Status on this order changed successful!`)
        }
    }, [changeStatusData])

    //--------CATCH-ERRORS------//
    if (errorGetOrders || errorTakeOrder || errorChangeOrderStatus) {
        notification.error({message: errorGetOrders || errorTakeOrder || errorChangeOrderStatus})
    }
    //-------------------------//

    const onTakeOrFetchChangeOrderStatusIsOk = (message: string) => {
        notification.success({message});
        setTookOrderId('');
        setModalState({visible: false, type: "Take"});
    }

    const onClickTabButtonHandler = (tabLabel: OrderStatusEnum) => {
        console.log('onClickTabButtonHandler')
        setActiveTab(tabLabel);
        setDataSource([]);
        setCurrentPage(1);
        fetchGetOrders({
            status: tabLabel,
            skip: 0,
            take: PAGINATION.TAKE,
        });
    }
    const onClickLoadMoreButtonHandler = () => {
        setCurrentPage((prev) => prev += 1)
        fetchGetOrders({
            status: activeTab,
            skip: currentPage * PAGINATION.TAKE,
            take: PAGINATION.TAKE,
        });
    }
    const onClickButtonInOrderCardHandler = (orderId: string, modalType: ModalStateType['type']) => {
        console.log('onClickButtonInOrderCardHandler')
        if (modalType === 'Update') {
            navigate(`${ROUTES.ORDER.UPDATE_PAGE.PATH}/${orderId}`);
            return;
        }
        setTookOrderId(orderId);
        if (modalType === 'Support') {
            setVisibleModalSupport(true);
            return;
        }
        setModalState({visible: true, type: modalType});
    }
    const onClickOkModalButtonHandler = () => {
        console.log('onClickOkModalButtonHandler', typeof tookOrderId)
        switch (modalState.type) {
            case "Take":
                fetchTakeOrder(tookOrderId);
                return;
            case "Complete":
                fetchChangeOrderStatus({
                    orderId: tookOrderId,
                    status: OrderStatusEnum.Completed
                });
                return;
            case "Cancel":
                fetchChangeOrderStatus({
                    orderId: tookOrderId,
                    status: OrderStatusEnum.Canceled
                });
                return;
            default:
                return;
        }
    }

    const onClickCancelModalButtonHandler = () => {
        console.log('onClickCancelModalButtonHandler')
        if (fetchingTakeOrder || fetchingChangeOrderStatus) return;
        setModalState({visible: false, type: 'Take'})
    }

    const tabs = [
        OrderStatusEnum.Available,
        OrderStatusEnum.Active,
        OrderStatusEnum.Completed,
        ...(userRole === UserRoleEnum.Customer ? [OrderStatusEnum.Canceled] : [])
    ]
    console.log(fetchingGetOrders, 'fetchingGetOrdersfetchingGetOrders')
    return (
        <div className={'orders-page'}>
            <Modal
                visible={modalState.visible}
                onOk={onClickOkModalButtonHandler}
                confirmLoading={(fetchingTakeOrder || fetchingChangeOrderStatus)}
                onCancel={onClickCancelModalButtonHandler}
            >
                <Typography.Paragraph>Are you sure?</Typography.Paragraph>
            </Modal>
            {modalSupport}
            {fetchingGetOrders && <Spin size={'large'}/>}
            <List
                style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
                split bordered
                // loading={false}
                grid={{gutter: 16, column: 1}}
                dataSource={dataSource}
                header={
                    <Row gutter={10} justify={'space-between'}>
                        {tabs.map((tabLabel: any) =>
                            <Col span={Math.round(24 / tabs.length)}>
                                <Button
                                    onClick={() => onClickTabButtonHandler(tabLabel)}
                                    style={{
                                        width: '100%',
                                        ...(activeTab === tabLabel && {backgroundColor: '#40a9ff', color: 'white'})
                                    }}
                                >
                                    {tabLabel}
                                </Button>
                            </Col>
                        )}
                    </Row>
                }
                renderItem={(item) =>
                    // <Skeleton avatar title={false} active>
                        <OrderCard userRole={userRole}
                                   onClickCancelButton={() => onClickButtonInOrderCardHandler(item.id, 'Cancel')}
                                   onClickUpdateButton={() => onClickButtonInOrderCardHandler(item.id, 'Update')}
                                   onClickSupportButton={() => onClickButtonInOrderCardHandler(item.id, 'Support')}
                                   onClickCompleteButton={() => onClickButtonInOrderCardHandler(item.id, 'Complete')}
                                   onClickTakeButton={() => onClickButtonInOrderCardHandler(item.id, 'Take')}
                                   {...item} type={activeTab}
                        />
                    // </Skeleton>
                }
                footer={
                    <Row justify={'center'}>
                        <Col span={12}>
                            {dataSource.length < getOrdersDataPaginationTotal &&
                            <Button style={{width: '100%'}} onClick={onClickLoadMoreButtonHandler}>
                                Loading more
                            </Button>
                            }
                        </Col>
                    </Row>
                }
            />
        </div>
    );
}

;