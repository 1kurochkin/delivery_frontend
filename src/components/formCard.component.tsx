import {DatePicker, Form, InputNumber, Row, TimePicker} from "antd";
import React from "react";
import moment, {Moment} from "moment";
import {SearchPlaces} from "./searchPlaces.component";
import {ReactComponent as UsFlag} from '../assets/svgs/usFlag.svg';
import {ReactComponent as Date} from '../assets/svgs/date.svg';
import {ReactComponent as Time} from '../assets/svgs/time.svg';
import {VALIDATION_CONFIG} from "../configs/validation.config";

export const FormCard: React.FC = (props) => {

    const disabledDate: (current: Moment) => boolean = (current) => {
        return current && current < moment().subtract(1, "days");
    };

    return (<>
            <Form.Item label={'Specify the address where to deliver the parcel'}
                       rules={VALIDATION_CONFIG.address}
                       style={{width: '100%'}}
                       hasFeedback
                       name="address"
            >
                <SearchPlaces placeholder={'1556 Broadway, New York, 10120, USA'}/>
            </Form.Item>
            <Row justify={'space-between'}>
                <Form.Item rules={VALIDATION_CONFIG.phone}
                           style={{width: '100%'}}
                           label={'Phone number'}
                           hasFeedback
                           name="phone"
                >
                    <InputNumber placeholder={'0000000000'} style={{width: '100%'}} prefix={<UsFlag/>}/>
                </Form.Item>
            </Row>
            <Row justify={'space-between'}>
                <Form.Item rules={VALIDATION_CONFIG.date}
                           style={{width: '33%'}}
                           label={'Select date'}
                           hasFeedback
                           name="date"
                >
                    <DatePicker suffixIcon={<Date/>} format={'MM/DD'} disabledDate={disabledDate}/>
                </Form.Item>
                <Form.Item rules={VALIDATION_CONFIG.timeRange}
                           style={{width: '63%'}}
                           label={'Specify time'}
                           hasFeedback
                           name="timeRange"
                >
                    <TimePicker.RangePicker format={'HH:MM A'} suffixIcon={<Time/>} use12Hours={true}/>
                </Form.Item>
            </Row>
        </>
    )
};