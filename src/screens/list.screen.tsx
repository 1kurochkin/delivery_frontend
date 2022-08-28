import React, {useEffect, useState} from 'react';
import {Button, Col, List, Row, Typography} from "antd";
import {useLazyGetOrdersQuery} from "../store/reducers/backend/backend.api";
import {OrderStatusEnum, OrderType, UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {PAGINATION, ROUTES} from "../configs/app.constants";
import {OrderCard} from "../components/orderCard.component";
import {useAppSelector} from "../hooks/useAppSelector";
import {useNavigate} from "react-router-dom";

export function ListScreen() {
    const userRole = useAppSelector(({settings}) => settings.role);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<OrderStatusEnum>(OrderStatusEnum.Available);
    const [dataSource, setDataSource] = useState<OrderType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    // const [tookOrderId, setTookOrderId] = useState<string>('');
    // const setCurrentSlideHandler = (slide: number) => {
    //     setCurrentSlide(slide);
    //     carouselRef?.current?.goTo(slide);
    // }
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
            setDataSource([...dataSource, ...list])
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
        navigate(ROUTES.ORDER.ORDER_PAGE.PATH + '/' + orderId)
    }

    const tabs = [
        OrderStatusEnum.Available,
        OrderStatusEnum.Active,
        OrderStatusEnum.Completed,
        ...(userRole === UserRoleEnum.Customer ? [OrderStatusEnum.Canceled] : [])
    ]
    return (
        // <Carousel effect={'fade'} swipe={false} ref={carouselRef} dots={false}>
            <>
                <Row>
                    {/*<Col span={4}>*/}
                    {/*    <ButtonBack onClick={() => navigate(-1)}/>*/}
                    {/*</Col>*/}
                    {/*<Col offset={1} span={19}>*/}
                        <Typography.Title>Orders list</Typography.Title>
                    {/*</Col>*/}
                </Row>
                {/*{modalSupport}*/}
                {/*{fetchingGetOrders && <Spin size={'large'}/>}*/}
                <List
                    style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
                    split bordered={false}
                    loading={fetchingGetOrders}
                    grid={{gutter: 16, column: 1}}
                    dataSource={dataSource}
                    header={
                        <Row gutter={10} justify={'space-between'}
                             style={{overflow: 'scroll', display: 'flex', flexWrap: 'nowrap', marginBottom: 20}}>
                            {tabs.map((tabLabel: any, i) =>
                                <Button style={{width: 'unset', marginLeft: i > 0 ? 10 : 0}}
                                        onClick={() => onClickTabButtonHandler(tabLabel)}
                                        type={activeTab === tabLabel ? 'default' : 'primary'}>
                                    {tabLabel}
                                </Button>
                            )}
                        </Row>
                    }
                    renderItem={(item) =>
                        <div onClick={() => onClickOrderCard(item.id)}>
                            <OrderCard {...item}/>
                        </div>
                    }
                    footer={
                        <Row justify={'center'}>
                            <Col span={12}>
                                {dataSource.length < getOrdersDataPaginationTotal && !fetchingGetOrders &&
                                <Button style={{width: '100%'}} onClick={onClickLoadMoreButtonHandler}>
                                    Loading more
                                </Button>
                                }
                            </Col>
                        </Row>
                    }
                />
            </>
    );
};