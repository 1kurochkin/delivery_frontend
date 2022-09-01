import {Card, Col, Divider, List, Row, Timeline, Typography} from "antd";
import React from "react";
import {OrderType} from "../store/reducers/backend/backend.api.types";
import moment from "moment";
import {COLORS} from "../configs/app.constants";

const OrderCardTimelineItem = ({date, timeRangeFrom, timeRangeTo, address}) => {
    return (
        <>
            <Typography.Paragraph style={{marginBottom: 0, fontSize: 10}}>
                <span className={'font-bold'}>{moment(date).format('MM/DD') + ' '}</span>
                from <span className={'font-bold'}>{moment(timeRangeFrom).format('HH:MM A') + ' '}</span>
                to <span className={'font-bold'}>{moment(timeRangeTo).format('HH:MM A')}</span>
            </Typography.Paragraph>
            <span className={'font-bold'}>
                {address}
            </span>
        </>
    )
}

export const OrderCard: React.FC<OrderType> = (props) => {
    const {
        id,
        deliveryPrice,
        packagePrice,
        packageType,
        payType,
        pickupPoint,
        deliveryPoint,
        weight
    } = props;

    return (
        <List.Item>
            <Card size={'small'} className={'order-card'}>
                <Row style={{alignItems: "center"}}>
                    <Typography.Title>#{id}</Typography.Title>
                    <Typography.Paragraph style={{marginLeft: 15}}>
                        {packageType}, {weight}
                    </Typography.Paragraph>
                </Row>
                <Divider style={{borderColor: 'black', margin: 0, marginBottom: 25}} dashed={true}/>
                <Row justify={'center'}>
                    <Timeline>
                        <Timeline.Item>
                            <OrderCardTimelineItem
                                date={pickupPoint?.date}
                                timeRangeFrom={pickupPoint?.timeRangeFrom}
                                timeRangeTo={pickupPoint?.timeRangeTo}
                                address={pickupPoint?.address}
                            />
                        </Timeline.Item>
                        <Timeline.Item>
                            <OrderCardTimelineItem
                                date={deliveryPoint?.date}
                                timeRangeFrom={deliveryPoint?.timeRangeFrom}
                                timeRangeTo={deliveryPoint?.timeRangeTo}
                                address={deliveryPoint?.address}
                            />
                        </Timeline.Item>
                    </Timeline>
                </Row>
                <Divider style={{borderColor: 'black', margin: 0, marginBottom: 5}} dashed={true}/>
                <Row justify={'end'}>
                    <Typography.Paragraph>
                        <span className={'font-bold'}>{payType + " "}</span>
                        will pay
                        <span style={{color: '#27CB84', fontSize: 36}} className={'font-bold'}>{" $" + deliveryPrice}</span>
                    </Typography.Paragraph>
                </Row>
                <Row justify={"space-between"} style={{alignItems: "center"}}>
                    <span style={{color: COLORS.SUCCESS, textDecoration: 'underline'}} className={'font-bold'}>{'details'}</span>
                    <Typography.Paragraph>
                        <span className={'font-bold'}>${packagePrice + " "}</span>
                        will hold on your wallet
                    </Typography.Paragraph>
                </Row>
            </Card>
        </List.Item>
    )
};