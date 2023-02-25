import { DatePicker, Form, Row, TimePicker } from "antd";
import moment, { Moment } from "moment";
import React from "react";
import { ReactComponent as Calendar } from "../assets/svgs/calendar.svg";
import { ReactComponent as Clock } from "../assets/svgs/clock.svg";
import { VALIDATION_CONFIG } from "../configs/validation.config";
import { OrderPointTypeEnum } from "../store/reducers/backend/backend.api.types";
import { InputPhoneNumber } from "./inputPhoneNumber.component";
import { SearchPlaces } from "./searchPlaces.component";

export const FormCard: React.FC<{
  pointType: OrderPointTypeEnum;
}> = ({ pointType }) => {
  const disabledDate: (current: Moment) => boolean = (current) => {
    return current && current < moment().subtract(1, "days");
  };

  const phoneFieldRule = () => {
    const [one, two] = VALIDATION_CONFIG.phone;    
    return [
      pointType === OrderPointTypeEnum.Delivery ? { ...one, required: false } : one,
      two,
    ];
  };

  return (
    <>
      <Form.Item
        label={"Enter the address"}
        rules={VALIDATION_CONFIG.address}
        style={{ width: "100%" }}
        hasFeedback
        name="address"
      >
        <SearchPlaces placeholder={"1556 Broadway, New York, 10120, USA"} />
      </Form.Item>
      <Row justify={"space-between"}>
        <Form.Item
          validateTrigger={'onBlur'}
          rules={phoneFieldRule()}
          style={{ width: "100%" }}
          label={"Phone number"}
          hasFeedback
          name="phone"
        >
          <InputPhoneNumber />
        </Form.Item>
      </Row>
      <Row justify={"space-between"}>
        <Form.Item
          rules={VALIDATION_CONFIG.date}
          style={{ width: "33%" }}
          label={"Choose the date"}
          hasFeedback
          name="date"
        >
          <DatePicker
            suffixIcon={<Calendar />}
            format={"MM/DD"}
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item
          rules={VALIDATION_CONFIG.timeRange}
          style={{ width: "63%" }}
          label={"Pick the time"}
          hasFeedback
          name="timeRange"
        >
          <TimePicker.RangePicker
            format={"HH:MM A"}
            suffixIcon={<Clock />}
            use12Hours={true}
          />
        </Form.Item>
      </Row>
    </>
  );
};
