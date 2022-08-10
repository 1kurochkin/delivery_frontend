import {Alert, Button, Col, Collapse, Divider, List, Row, Timeline} from "antd";
import Title from "antd/lib/typography/Title";
import React, {useCallback} from "react";
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
    id: string,
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
    const {onClickTakeButton, onClickCompleteButton, onClickCancelButton, onClickSupportButton} = props;

    const getButtonComponent = (label: string, onClick: () => void) => (
        <Button onClick={onClick} loading={props.loading} style={{width: '100%'}}>
            {label}
        </Button>
    )
    const getCardButtonViewByType = () => {
        let onClick, label;
        switch (props.type) {
            case OrderPageTabsEnum.Available: {
                if(props.userRole === UserRoleEnum.Customer) {
                    label = 'Cancel the order'; onClick = onClickCancelButton; break;
                } else {
                    label = 'Take the order'; onClick = onClickTakeButton; break;
                }
            }
            case OrderPageTabsEnum.Active: {
                if(props.userRole === UserRoleEnum.Customer) {
                    label = 'Support'; onClick = onClickSupportButton; break;
                } else {
                    label = 'Complete the order'; onClick = onClickCompleteButton; break;
                }
            }
            default: return <Alert message={"COMPLETED"} type={'error'}/>;
        }
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
    const getCollapseViewByUserRole = () => {
        if(props.userRole === UserRoleEnum.Customer) return collapseView;
        if(props.userRole === UserRoleEnum.Courier) {
            if(props.type === OrderPageTabsEnum.Available) return;
            else return collapseView;
        }
    }

    return (
        <List.Item style={{backgroundColor: 'white', paddingTop: 20}}>
            <Row justify={'space-between'}>
                <Col span={5}>
                    <Row>
                        <Col span={5}>
                            <Title level={3}>#{props.id}</Title>
                        </Col>
                        <Col span={18}>
                            <Title level={3}>Price: {props.deliveryPrice}$</Title>
                        </Col>
                    </Row>
                    <Divider/>
                    <Col span={24}>
                        {getCardButtonViewByType()}
                    </Col>
                </Col>
                <Col offset={1} span={18}>
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
                                            {getCollapseViewByUserRole()}
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