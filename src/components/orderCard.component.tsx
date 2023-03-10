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
      <Typography.Paragraph
        style={{ marginBottom: 0, fontSize: 14, color: COLORS.SECOND }}
      >
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
    points,
    weight,
    userRole,
  } = props;

  return (
    <List.Item style={{ marginTop: 10 }}>
      <Card size={"small"} className={"order-card"}>
        <Row style={{ alignItems: "center" }} justify={"space-between"}>
          <Typography.Title level={2}>#{id}</Typography.Title>
          <Col style={{ textAlign: "right", color: COLORS.MAIN }}>
            <Typography.Title level={2}>{"$" + deliveryPrice}</Typography.Title>
          </Col>
          {/* <span
            className={"font-bold"}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            details <Details style={{ marginLeft: 5 }} />
          </span> */}
          {/* <Typography.Paragraph style={{ marginLeft: 15 }}>
            {packageType}, {weight}
          </Typography.Paragraph> */}
        </Row>
        <Divider
          style={{ borderColor: "black", margin: 0, marginBottom: 25 }}
          dashed={true}
        />
        <Row justify={"center"}>
          <Timeline>
            {points.map((point) => (
              <Timeline.Item>
                <OrderCardTimelineItem
                  date={point?.date}
                  timeRangeFrom={point?.timeRangeFrom}
                  timeRangeTo={point?.timeRangeTo}
                  address={point?.address}
                />
              </Timeline.Item>
            ))}
          </Timeline>
        </Row>
        {/* <Divider
          style={{ borderColor: "black", margin: 0, marginBottom: 5 }}
          dashed={true}
        /> */}
        {/* {userRole === UserRoleEnum.Courier && (
          <Row
            className={"font-bold"}
            style={{ color: "#27CB84", fontSize: 36 }}
            justify={"space-between"}
          >
            <span>Profit</span>
            <span>{" $" + deliveryPrice}</span>
          </Row>
        )} */}

        {/* <Row justify={"center"}>
          <Col style={{ textAlign: "right", color: COLORS.MAIN }}>
            <Typography.Title level={3}>
              {"Price $" + deliveryPrice}
            </Typography.Title>
          </Col>
        </Row> */}
      </Card>
    </List.Item>
  );
};
