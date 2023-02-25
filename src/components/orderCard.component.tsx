import { Card, Col, Divider, List, Row, Timeline, Typography } from "antd";
import React from "react";
import {
  OrderType,
  PayTypeEnum,
  UserRoleEnum,
} from "../store/reducers/backend/backend.api.types";
import moment from "moment";
import { ReactComponent as Details } from "../assets/svgs/details.svg";
import { COLORS } from "../configs/app.constants";

const OrderCardTimelineItem = ({
  date,
  timeRangeFrom,
  timeRangeTo,
  address,
}) => {
  return (
    <>
      <Typography.Paragraph style={{ marginBottom: 0, fontSize: 14, color: COLORS.SECOND }}>
        <span className={"font-bold"}>
          {moment(date).format("MM/DD") + " "}
        </span>
        from{" "}
        <span className={"font-bold"}>
          {moment(timeRangeFrom).format("HH:MM A") + " "}
        </span>
        to{" "}
        <span className={"font-bold"}>
          {moment(timeRangeTo).format("HH:MM A")}
        </span>
      </Typography.Paragraph>
      <span className={"font-bold"}>{address}</span>
    </>
  );
};

interface IOrderCardProps extends OrderType {
  userRole: UserRoleEnum;
}
export const OrderCard: React.FC<IOrderCardProps> = (props) => {
  const {
    id,
    deliveryPrice,
    packagePrice,
    packageType,
    payType,
    pickupPoint,
    deliveryPoint,
    weight,
    userRole,
  } = props;

  return (
    <List.Item>
      <Card size={"small"} className={"order-card"}>
        <Row style={{ alignItems: "center" }}>
          <Typography.Title>#{id}</Typography.Title>
          <Typography.Paragraph style={{ marginLeft: 15 }}>
            {packageType}, {weight}
          </Typography.Paragraph>
        </Row>
        <Divider
          style={{ borderColor: "black", margin: 0, marginBottom: 25 }}
          dashed={true}
        />
        <Row justify={"center"}>
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
        <Divider
          style={{ borderColor: "black", margin: 0, marginBottom: 5 }}
          dashed={true}
        />
        {userRole === UserRoleEnum.Courier && (
          <Row
            className={"font-bold"}
            style={{ color: "#27CB84", fontSize: 36 }}
            justify={"space-between"}
          >
            <span>Profit</span>
            <span>{" $" + deliveryPrice}</span>
          </Row>
        )}

        <Row justify={"space-between"} style={{ alignItems: "center" }}>
          <span
            className={"font-bold"}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            <Details style={{ marginRight: 5 }} /> details
          </span>
          <Col style={{textAlign: 'right', color: COLORS.MAIN }}>
            {
            userRole === UserRoleEnum.Customer ? 
           <Typography.Paragraph className={"font-bold"} style={{color: COLORS.MAIN, fontWeight: 'bold'}}>
            {"$" + deliveryPrice + " " + payType}
            </Typography.Paragraph>
            : 
            <Typography.Paragraph>
            <span className={"font-bold"}>${packagePrice + " "}</span>
            will hold on your wallet
          </Typography.Paragraph>
            }
            {/* <Typography.Paragraph>
              <span className={"font-bold"}>{" " + payTypeViewConfig[payType]}</span>
            </Typography.Paragraph> */}
          </Col>
        </Row>
      </Card>
    </List.Item>
  );
};
