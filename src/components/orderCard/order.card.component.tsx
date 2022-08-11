import {Alert, Badge, Button, Col, Collapse, Divider, List, Row, Timeline} from "antd";
import Title from "antd/lib/typography/Title";
import React, {MouseEventHandler, useCallback} from "react";
import {OrderPageTabsEnum} from "../../pages/orders/orders.page";
import {DeliveryStatusEnum, OrderPointType, UserRoleEnum} from "../../store/reducers/backend/backend.api.types";

type OrderCardPropsType = {
    courierId: string;
    type: OrderPageTabsEnum;
    userRole: UserRoleEnum | '';
    loading?: boolean;
    onClickTakeButton: (orderId: string) => void;
    onClickCompleteButton: (orderId: string) => void;
    onClickCancelButton: (orderId: string) => void;
    onClickSupportButton: (orderId: string) => void;
    onClickUpdateButton: (orderId: string) => void;
    id: string,
    courier: {
        name: string;
        phone: string;
    };
    pickupPoint: OrderPointType,
    deliveryPoints: Array<OrderPointType>,
    deliveryStatus: DeliveryStatusEnum;
    weight: string,
    packageType: string,
    deliveryPrice: number,
    payType: string,
    createdAt: Date,
    updatedAt: Date,
}

export const OrderCard: React.FC<OrderCardPropsType> = (props) => {
    const {
        onClickTakeButton,
        onClickCompleteButton,
        onClickCancelButton,
        onClickSupportButton,
        onClickUpdateButton,
    } = props;

    const getButtonComponent = (label: string, onClick: (orderId: string) => void) => (
        <Button onClick={onClick as unknown as MouseEventHandler<HTMLElement>} loading={props.loading}
                style={{width: '100%', marginTop: 10}}>
            {label}
        </Button>
    )
    const getCardButtonViewByType = () => {
        let onClick, label;
        switch (props.type) {
            case OrderPageTabsEnum.Available: {
                if (props.userRole === UserRoleEnum.Customer) {
                    return [
                        getButtonComponent('Cancel the order', onClickCancelButton),
                        getButtonComponent('Update the order', onClickUpdateButton),
                    ];
                    break;
                    label = 'Cancel the order';
                    onClick = onClickCancelButton;
                    break;
                } else {
                    label = 'Take the order';
                    onClick = onClickTakeButton;
                    break;
                }
            }
            case OrderPageTabsEnum.Active: {
                if (props.userRole === UserRoleEnum.Customer) {
                    label = 'Support';
                    onClick = onClickSupportButton;
                    break;
                } else {
                    label = 'Complete the order';
                    onClick = onClickCompleteButton;
                    break;
                }
            }
            case OrderPageTabsEnum.Completed: {
                if(props.userRole === UserRoleEnum.Customer) {
                    return [
                        <Alert message={"Order completed"} type={'error'}/>,
                        getButtonComponent('Support', onClickSupportButton),
                    ]; break;
                } else return
            }
            default: return;
        }
        return getButtonComponent(label, onClick);
    }
    const collapseView = useCallback((phone: string, comment: string) =>
        <Collapse accordion bordered>
            <Collapse.Panel header="Open info for address" key={1}>
                <Alert message={`Phone: ${phone}`}
                       description={comment}
                       type={'warning'}
                />
            </Collapse.Panel>
        </Collapse>, [props]
    )
    const getCollapseViewByUserRole = (phone: string, comment: string) => {
        if (props.userRole === UserRoleEnum.Customer) return collapseView(phone, comment);
        if (props.userRole === UserRoleEnum.Courier) {
            if (props.type === OrderPageTabsEnum.Available) return;
            else return collapseView(phone, comment);
        }
    }

    return (
        <List.Item style={{backgroundColor: 'white', paddingTop: 20}}>
            <Row justify={'space-between'}>
                    <Col span={6}>
                        <Badge.Ribbon placement={'start'} text={`#${props.id}`}>
                        <Col offset={5} span={19}>
                            <Title level={3}>Price: {props.deliveryPrice}$</Title>
                        </Col>
                        </Badge.Ribbon>
                        <Divider/>
                        {   props.type === OrderPageTabsEnum.Active && props.userRole === UserRoleEnum.Customer ?
                            <Col span={24}>
                                <Alert type={"info"} message={'Courier info'}/>
                                <Alert type={"warning"} message={`Name: ${props?.courier?.name}`}/>
                                <Alert type={"success"} message={`Phone: ${props?.courier?.phone}`}/>
                            </Col> : null
                        }
                        <Col span={24}>
                            {getCardButtonViewByType()}
                        </Col>
                    </Col>
                {/*</Badge.Ribbon>*/}
                <Col offset={1} span={17}>
                    <Row>
                        <Col span={16}>
                            <Timeline>
                                {[props.pickupPoint, ...props.deliveryPoints].map((point, i) =>
                                    <Timeline.Item color={i === 1 ? 'green' : 'blue'}>
                                        <>
                                            <Alert
                                                message={point.address}
                                                description={`${point.date} from ${point.timeRangeFrom} to ${point.timeRangeTo}`}
                                                type={i === 1 ? 'success' : 'info'}
                                            />
                                            {getCollapseViewByUserRole(point.phone, point.comment)}
                                        </>
                                    </Timeline.Item>
                                )}
                            </Timeline>
                        </Col>
                        <Col offset={1} span={7}>
                            <Alert style={{marginBottom: 10}}
                                   message={`Pay type: ${props.payType}`}
                                   type={'success'}/>
                            <Alert style={{marginBottom: 10}}
                                   message={`Package type: ${props.packageType}`}
                                   type={'warning'}/>
                            <Alert style={{marginBottom: 10}}
                                   message={`Weight: ${props.weight}`} type={'error'}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </List.Item>
    )
};