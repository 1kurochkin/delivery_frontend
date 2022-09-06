import {DatePicker, Form, InputNumber, Row, TimePicker} from "antd";
import React from "react";
import moment, {Moment} from "moment";
import {SearchPlaces} from "./searchPlaces.component";
import {ReactComponent as Phone} from '../assets/svgs/phone.svg';
import {ReactComponent as Calendar} from '../assets/svgs/calendar.svg';
import {ReactComponent as Clock} from '../assets/svgs/clock.svg';
import {VALIDATION_CONFIG} from "../configs/validation.config";

export const FormCard: React.FC = (props) => {

    const disabledDate: (current: Moment) => boolean = (current) => {
        return current && current < moment().subtract(1, "days");
    };

    return (<>
            <Form.Item label={'Enter the address'}
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
                    <InputNumber maxLength={11} placeholder={'0000000000'} style={{width: '100%'}} prefix={<Phone/>}/>
                </Form.Item>
            </Row>
            <Row justify={'space-between'}>
                <Form.Item rules={VALIDATION_CONFIG.date}
                           style={{width: '33%'}}
                           label={'Choose the date'}
                           hasFeedback
                           name="date"
                >
                    <DatePicker suffixIcon={<Calendar/>} format={'MM/DD'} disabledDate={disabledDate}/>
                </Form.Item>
                <Form.Item rules={VALIDATION_CONFIG.timeRange}
                           style={{width: '63%'}}
                           label={'Pick the time'}
                           hasFeedback
                           name="timeRange"
                >
                    <TimePicker.RangePicker format={'HH:MM A'} suffixIcon={<Clock/>} use12Hours={true}/>
                </Form.Item>
            </Row>
        </>
    )
};