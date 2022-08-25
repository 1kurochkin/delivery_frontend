import React, {useEffect, useRef, useState} from 'react';
import {Affix, Button, Carousel, Col, Form, Input, List, notification, Row, Spin, Timeline, Typography} from "antd";
import {
    useChangeOrderStatusMutation, useLazyGetOrderQuery,
    useLazyGetOrdersQuery,
    useTakeOrderMutation
} from "../store/reducers/backend/backend.api";
import {OrderStatusEnum, OrderType, UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {PAGINATION, ROUTES} from "../configs/app.constants";
import {OrderCard} from "../components/orderCard/order.card.component";
import {useAppSelector} from "../hooks/useAppSelector";
import {useModalSupport} from "../components/modal/modal.support.component";
import {useNavigate} from "react-router-dom";
import {usePrevious} from "../hooks/usePrevious";
import {ButtonBack} from "../components/button/buttonBack.component";
import {CarouselRef} from "antd/lib/carousel";
import {OrderScreen} from "./order.screen";


type ModalStateType = { visible: boolean, type: 'Take' | 'Complete' | 'Cancel' | 'Support' | 'Update' }

export function ListScreen() {
    const userRole = useAppSelector(({settings}) => settings.role);
    const navigate = useNavigate();
    const carouselRef = useRef<CarouselRef>(null)
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTab, setActiveTab] = useState<OrderStatusEnum>(OrderStatusEnum.Available);
    const [dataSource, setDataSource] = useState<OrderType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tookOrderId, setTookOrderId] = useState<string>('');
    const setCurrentSlideHandler = (slide: number) => {
        setCurrentSlide(slide);
        carouselRef?.current?.goTo(slide);
    }
    console.log('CURRENT SLIDE', currentSlide)
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
        });
    }

    const onClickOrderCard = (orderId: string) => {
        setTookOrderId(orderId);
        setCurrentSlideHandler(1)
    }

    const tabs = [
        OrderStatusEnum.Available,
        OrderStatusEnum.Active,
        OrderStatusEnum.Completed,
        ...(userRole === UserRoleEnum.Customer ? [OrderStatusEnum.Canceled] : [])
    ]
    return (
        <Carousel effect={'fade'} swipe={false} ref={carouselRef} dots={false}>
            <>
                <Row justify={'space-between'} style={{marginBottom: 30}}>
                    <Col span={4}>
                        <ButtonBack onClick={() => navigate(-1)}/>
                    </Col>
                    <Col offset={1} span={19}>
                        <Typography.Title level={2} style={{marginBottom: 20, textAlign: 'right'}}>
                            List Orders
                        </Typography.Title>
                    </Col>
                </Row>
                {/*{modalSupport}*/}
                {fetchingGetOrders && <Spin size={'large'}/>}
                <List
                    style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
                    split bordered={false}
                    // loading={false}
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
                                {dataSource.length < getOrdersDataPaginationTotal &&
                                <Button style={{width: '100%'}} onClick={onClickLoadMoreButtonHandler}>
                                    Loading more
                                </Button>
                                }
                            </Col>
                        </Row>
                    }
                />
            </>
            <>
                {
                    currentSlide === 1 ?
                        <OrderScreen orderId={tookOrderId} onClickButtonBack={() => setCurrentSlideHandler(0)}/> :
                        null
                }
            </>

        </Carousel>
    );
};