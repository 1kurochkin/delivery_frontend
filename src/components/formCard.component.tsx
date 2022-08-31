import {DatePicker, Form, InputNumber, Row, TimePicker} from "antd";
import React from "react";
import moment, {Moment} from "moment";
import {SearchPlaces} from "./searchPlaces.component";

export const FormCard: React.FC = (props) => {

    const disabledDate: (current: Moment) => boolean = (current) => {
        return current && current < moment().subtract(1, "days");
    };

    return (<>
            <Form.Item label={'Specify the address where to deliver the parcel'} rules={[{required: true, message: ''}]}
                       style={{width: '100%'}} name="address">
                <SearchPlaces placeholder={'1556 Broadway, New York, 10120, USA'}/>
            </Form.Item>
            <Row justify={'space-between'}>
                <Form.Item rules={[{required: true, message: ''}]} style={{width: '100%'}} label={'Phone number'}
                           name="phone">
                    <InputNumber placeholder={'0000000000'} style={{width: '100%'}} prefix={'+'}/>
                </Form.Item>
            </Row>
            <Row justify={'space-between'}>
                <Form.Item rules={[{required: true, message: ''}]}
                           style={{width: '33%'}}
                           label={'Select date'}
                           name="date"
                >
                    <DatePicker suffixIcon={null} format={'MM/DD/YY'} disabledDate={disabledDate}/>
                </Form.Item>
                <Form.Item rules={[{required: true, message: ''}]}
                           style={{width: '63%'}}
                           label={'Specify time'}
                           name="timeRange"
                >
                    <TimePicker.RangePicker format={'HH:MM A'} suffixIcon={null} use12Hours={true}/>
                </Form.Item>
            </Row>
        </>
    )
};