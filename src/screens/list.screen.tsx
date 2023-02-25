import { Button, Col, List, Row, Typography } from "antd";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { OrderCard } from "../components/orderCard.component";
import { Preloader } from "../components/preloader.component";
import { PAGINATION, ROUTES } from "../configs/app.constants";
import { useAppSelector } from "../hooks/useAppSelector";
import { useLazyGetOrdersQuery } from "../store/reducers/backend/backend.api";
import { OrderStatusEnum, OrderType, UserRoleEnum } from "../store/reducers/backend/backend.api.types";

export function ListScreen() {
    const userRole = useAppSelector(({settings}) => settings.role);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<OrderStatusEnum>(OrderStatusEnum.Available);
    // @ts-ignore
    const [dataSource, setDataSource] = useState<OrderType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [
        fetchGetOrders,
        {
            isFetching: fetchingGetOrders,
            data: {
                pagination: {total: getOrdersDataPaginationTotal = 0} = {}
            } = {}
        }
    ] = useLazyGetOrdersQuery();
    useEffect(() => {
        fetchGetOrders({
            status: OrderStatusEnum.Available,
            skip: 0,
            take: PAGINATION.TAKE
        }).unwrap().then(({list}) => {
            setDataSource(list);
        })
    }, [])

    const onClickTabButtonHandler = (tabLabel: OrderStatusEnum) => {
        console.log('onClickTabButtonHandler')
        setActiveTab(tabLabel);
        setDataSource([]);
        setCurrentPage(1);
        fetchGetOrders({
            status: tabLabel,
            skip: 0,
            take: PAGINATION.TAKE,
        }).unwrap().then(({list}) => {
            setDataSource(list)
        })
    }
    const onClickLoadMoreButtonHandler = () => {
        setCurrentPage((prev) => prev += 1)
        fetchGetOrders({
            status: activeTab,
            skip: currentPage * PAGINATION.TAKE,
            take: PAGINATION.TAKE,
        }).unwrap().then(({list}) => {
            console.log(list, 'LOAD MORE RESPONSE')
            setDataSource([...dataSource, ...list])
        })
    }

    const onClickOrderCard = (orderId: number) => {
        navigate(ROUTES.ORDER.PATH + '/' + orderId)
    }

    const tabs = [
        OrderStatusEnum.Available,
        OrderStatusEnum.Active,
        OrderStatusEnum.Completed,
        OrderStatusEnum.Canceled
    ]
    return (
        <>
            <Row>
                <Typography.Title level={2}>Orders list</Typography.Title>
            </Row>
            <List
                style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
                split bordered={false}
                loading={fetchingGetOrders ? {indicator: <Preloader type={'usual'}/>} : false}
                grid={{gutter: 16, column: 1}}
                dataSource={dataSource}
                header={
                    <Row justify={'space-between'} style={{
                        // overflow: 'scroll',
                        display: 'flex',
                        flexWrap: 'nowrap',
                        paddingBottom: 20,
                        // position: 'fixed',
                        width: '100%',
                        // paddingRight: '20%'
                        // marginBottom: 20,
                    }}>
                        {/*<Col span={24}>*/}
                            {tabs.map((tabLabel: any, i) =>
                                <Button size={'small'} style={{width: 'unset'}}
                                        onClick={() => onClickTabButtonHandler(tabLabel)}
                                        type={activeTab === tabLabel ? 'default' : 'primary'}>
                                    {tabLabel}
                                </Button>
                            )}
                        {/*</Col>*/}
                    </Row>
                }
                renderItem={(item) =>
                    <div onClick={() => onClickOrderCard(item.id)}>
                        <OrderCard userRole={userRole as UserRoleEnum} {...item}/>
                    </div>
                }
                footer={
                    <Row justify={'center'}>
                        <Col span={12}>
                            {dataSource.length < getOrdersDataPaginationTotal && !fetchingGetOrders &&
                            <Button style={{width: '100%'}} onClick={onClickLoadMoreButtonHandler}>
                                Load more
                            </Button>
                            }
                        </Col>
                    </Row>
                }
            />
            {/*{fetchingGetOrders && <Preloader type={'usual'}/>}*/}
        </>
    );
};