import {Affix, Alert, Badge, Button, Card, Col, Collapse, Divider, List, Row, Timeline, Typography} from "antd";
import Title from "antd/lib/typography/Title";
import React, {MouseEventHandler, useCallback} from "react";
import {OrderPointType, OrderStatusEnum, OrderType, UserRoleEnum} from "../../store/reducers/backend/backend.api.types";
import moment from "moment";

type OrderCardPropsType = {
    courierId: string;
    type: OrderStatusEnum;
    userRole: UserRoleEnum | '';
    loading?: boolean;
    onClickTakeButton: () => void;
    onClickCompleteButton: () => void;
    onClickCancelButton: () => void;
    onClickSupportButton: () => void;
    onClickUpdateButton: () => void;
    id: string,
    courier: {
        name: string;
        phone: string;
    };
    pickupPoint: OrderPointType,
    deliveryPoint: OrderPointType,
    status: OrderStatusEnum;
    weight: string,
    packageType: string,
    deliveryPrice: number,
    payType: string,
    createdAt: Date,
    updatedAt: Date,
}

export const OrderCard: React.FC<OrderType> = (props) => {
    console.log(props)
    const {
        id,
        deliveryPrice,
        packagePrice,
        packageType,
        payType,
        pickupPoint,
        deliveryPoint
    } = props;


    // const getButtonComponent = (label: string, onClick: () => void) => (
    //     <Button onClick={onClick as unknown as MouseEventHandler<HTMLElement>} loading={props.loading}
    //             style={{width: '100%', marginTop: 10}}>
    //         {label}
    //     </Button>
    // )
    // const getCardButtonViewByType = () => {
    //     let onClick, label;
    //     switch (props.type) {
    //         case OrderStatusEnum.Available: {
    //             if (
    //                 props.userRole === UserRoleEnum.Customer
    //             ) {
    //                 if(props.status === OrderStatusEnum.Canceled) return getButtonComponent('Support', onClickSupportButton);
    //                 return [
    //                     getButtonComponent('Cancel the order', onClickCancelButton),
    //                     getButtonComponent('Update the order', onClickUpdateButton),
    //                 ];
    //             } else {
    //                 return getButtonComponent('Take the order', onClickTakeButton)
    //             }
    //         }
    //         case OrderStatusEnum.Active: {
    //             if (props.userRole === UserRoleEnum.Customer) {
    //                 return getButtonComponent('Support', onClickSupportButton);
    //             } else {
    //                 return getButtonComponent('Complete the order', onClickCompleteButton);
    //             }
    //         }
    //         case OrderStatusEnum.Completed: {
    //             if (props.userRole === UserRoleEnum.Customer) {
    //                 return [
    //                     <Alert message={"Order completed"} type={'error'}/>,
    //                     getButtonComponent('Support', onClickSupportButton),
    //                 ];
    //             } else return
    //         }
    //         default:return;
    //     }
    // }
    // const collapseView = useCallback((phone: string, comment: string) =>
    //     <Collapse accordion bordered>
    //         <Collapse.Panel header="Open info for address" key={1}>
    //             <Alert message={`Phone: ${phone}`}
    //                    description={comment}
    //                    type={'warning'}
    //             />
    //         </Collapse.Panel>
    //     </Collapse>, [props]
    // )
    // const getCollapseViewByUserRole = (phone: string, comment: string) => {
    //     if (props.userRole === UserRoleEnum.Customer) return collapseView(phone, comment);
    //     if (props.userRole === UserRoleEnum.Courier) {
    //         if (props.type === OrderStatusEnum.Available) return;
    //         else return collapseView(phone, comment);
    //     }
    // }
    return (
        <List.Item>
            <Card>
                <Row>
                    <Typography.Title level={5}>
                        {`Delivery from ${moment(pickupPoint.date).format('MM/DD')} to ${moment(deliveryPoint.date).format('MM/DD')}`}
                    </Typography.Title>
                </Row>
                <Row justify={'space-between'}>
                    <Col span={12}>
                        <Typography.Title level={4}>${deliveryPrice}</Typography.Title>
                    </Col>
                    <Col span={12}>
                        <Typography.Title style={{textAlign: 'right'}} level={5}>Order #{id}</Typography.Title>
                    </Col>
                </Row>
                <Row justify={'center'}>
                    <Timeline>
                        <Timeline.Item>
                            {/*<Typography.Paragraph>{${moment(pickupPoint.timeRange).format('MM/DD')}}</Typography.Paragraph>*/}
                            <Typography.Title level={5}>{pickupPoint.address}</Typography.Title>
                        </Timeline.Item>
                        <Timeline.Item>
                            <Typography.Title level={5}>{deliveryPoint.address}</Typography.Title>
                        </Timeline.Item>
                    </Timeline>
                </Row>
                <Row>
                    <Typography.Paragraph style={{whiteSpace: 'pre-line'}}>
                        {`${packageType}\n$${packagePrice} will be blocked on your wallet\n Pay type: ${payType}`}
                    </Typography.Paragraph>
                </Row>
            </Card>
            {/*<Row justify={'space-between'}>*/}
            {/*    <Col span={6}>*/}
            {/*        <Badge.Ribbon placement={'start'} text={`#${props.id}`}>*/}
            {/*            <Col offset={4} span={19}>*/}
            {/*                <Title level={4}>Price: {props.deliveryPrice}$</Title>*/}
            {/*            </Col>*/}
            {/*        </Badge.Ribbon>*/}
            {/*        <Divider/>*/}
            {/*        {props.type === OrderStatusEnum.Active && props.userRole === UserRoleEnum.Customer ?*/}
            {/*            <Col span={24}>*/}
            {/*                <Alert type={"info"} message={'Courier info'}/>*/}
            {/*                <Alert type={"warning"} message={`Name: ${props?.courier?.name}`}/>*/}
            {/*                <Alert type={"success"} message={`Phone: ${props?.courier?.phone}`}/>*/}
            {/*            </Col> : null*/}
            {/*        }*/}
            {/*        /!*<Col span={24}>*!/*/}
            {/*        /!*    {getCardButtonViewByType()}*!/*/}
            {/*        /!*</Col>*!/*/}
            {/*    </Col>*/}
            {/*    /!*</Badge.Ribbon>*!/*/}
            {/*    <Col offset={1} span={17}>*/}
            {/*        <Row>*/}
            {/*            <Col span={16}>*/}
            {/*                <Timeline>*/}
            {/*                    {[props.pickupPoint, props.deliveryPoint].map((point, i) =>*/}
            {/*                        <Timeline.Item color={i === 1 ? 'green' : 'blue'}>*/}
            {/*                            <>*/}
            {/*                                <Alert*/}
            {/*                                    message={point.address}*/}
            {/*                                    description={`${point.date} from ${point.timeRange}`}*/}
            {/*                                    type={i === 1 ? 'success' : 'info'}*/}
            {/*                                />*/}
            {/*                                /!*{getCollapseViewByUserRole(point.phone, point.comment)}*!/*/}
            {/*                            </>*/}
            {/*                        </Timeline.Item>*/}
            {/*                    )}*/}
            {/*                </Timeline>*/}
            {/*            </Col>*/}
            {/*            <Col offset={1} span={7}>*/}
            {/*                <Alert style={{marginBottom: 10}}*/}
            {/*                       message={`Pay type: ${props.payType}`}*/}
            {/*                       type={'success'}/>*/}
            {/*                <Alert style={{marginBottom: 10}}*/}
            {/*                       message={`Package type: ${props.packageType}`}*/}
            {/*                       type={'warning'}/>*/}
            {/*                <Alert style={{marginBottom: 30}} message={`Weight: ${props.weight}`} type={'error'}/>*/}
            {/*                <Alert message={`Status: ${props.status}`} type={'info'}/>*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </List.Item>
    )
};