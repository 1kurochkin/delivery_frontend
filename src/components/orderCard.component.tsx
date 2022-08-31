import {Card, Col, List, Row, Timeline, Typography} from "antd";
import React from "react";
import {OrderType} from "../store/reducers/backend/backend.api.types";
import moment from "moment";

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
                <Row style={{marginBottom: 10, alignItems: "center"}}>
                    <Typography.Title level={3} style={{textAlign: 'right'}}>#{id}</Typography.Title>
                    <Typography.Title level={4} style={{marginLeft: 10}}>
                        {packageType}, {weight}
                    </Typography.Title>
                </Row>
                <Row justify={'center'}>
                    <Timeline>
                        <Timeline.Item>
                            <Typography.Paragraph style={{marginBottom: 0}}>
                                {`${moment(pickupPoint.date).format('MM/DD')} from ${moment(pickupPoint.timeRangeFrom).format('HH:MM A')} to ${moment(pickupPoint.timeRangeTo).format('HH:MM A')}`}
                            </Typography.Paragraph>
                            <span className={'font-bold'}>
                                    {pickupPoint.address}
                                </span>
                        </Timeline.Item>
                        <Timeline.Item style={{paddingBottom: 0}}>
                            <Typography.Paragraph style={{marginBottom: 0}}>
                                {`${moment(deliveryPoint.date).format('MM/DD')} from ${moment(deliveryPoint.timeRangeFrom).format('HH:MM A')} to ${moment(deliveryPoint.timeRangeTo).format('HH:MM A')}`}
                            </Typography.Paragraph>
                            <span className={'font-bold'}>
                                    {deliveryPoint.address}
                                </span>
                        </Timeline.Item>
                    </Timeline>
                    {/*<Typography.Title level={4}>${deliveryPrice}</Typography.Title>*/}
                    {/*</Col>*/}
                </Row>
                <Row style={{alignItems: "center"}}>
                        <Typography.Title style={{color: '#27CB84'}} level={2}>
                            ${deliveryPrice}
                        </Typography.Title>
                        <Typography.Paragraph style={{marginLeft: 10}}>
                            Will pay <span className={'font-bold'}>{payType}</span>
                        </Typography.Paragraph>
                </Row>
                <Row style={{alignItems: "center"}}>
                    <Typography.Title style={{color: 'red'}} level={2}>
                        ${packagePrice}
                    </Typography.Title>
                    <Typography.Paragraph style={{marginLeft: 10}}>
                        Will hold <span className={'font-bold'}>on your wallet</span>
                    </Typography.Paragraph>
                </Row>
            </Card>
        </List.Item>
    )
};