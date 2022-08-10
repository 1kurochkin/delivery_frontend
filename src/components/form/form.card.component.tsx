import {Checkbox, Col, DatePicker, Divider, Form, Input, TimePicker} from "antd";
import Title from "antd/lib/typography/Title";
import React, {useEffect, useState} from "react";
import {AimOutlined, HistoryOutlined, PhoneOutlined} from "@ant-design/icons";
import moment from "moment";
import {FormInstance} from "antd/es/form/hooks/useForm";
import {OrderPointTypeEnum} from "../../store/reducers/backend/backend.api.types";
import Search from "antd/es/input/Search";
import {SearchPlaces} from "../searchPlaces/search.places.component";

type FormCardPropsType = { type: OrderPointTypeEnum, formRef: FormInstance, onAddressFilled: (filled: boolean, type: OrderPointTypeEnum) => void }

export const FormCard: React.FC<FormCardPropsType> = (props) => {
    const {type, formRef, onAddressFilled} = props;
    const [selected, setSelected] = useState(false)
    useEffect(() => {
        onAddressFilled(selected, type);
    }, [selected])
    const onSelectSearchPlacesHandler = (value: any) => {
        setSelected(true)
    }
    const onChangeSearchPlacesHandler = (value: any) => {
        if(!value.length) setSelected(false)
    }

    return (
        <Form.Item rules={[{required: true, message: ''}]}>
            <Title style={{textAlign: 'center'}} level={3}>{type}</Title>
            <Form form={formRef} style={{border: '1px solid', padding: 15}}>
                <Col>
                    <Form.Item rules={[{required: true, message: ''}]} colon={false} label={<AimOutlined/>} name={'address'}>
                        <SearchPlaces onChange={onChangeSearchPlacesHandler} onSelect={onSelectSearchPlacesHandler} />
                    </Form.Item>
                </Col>
                {selected &&
                <Col style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Col span={11}>
                        <Form.Item rules={[{required: true, message: ''}]} name={'floor'}>
                            <Input placeholder={'Floor'}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item rules={[{required: true, message: ''}]} name={'apt'}>
                            <Input placeholder={'Apartment or office'}/>
                        </Form.Item>
                    </Col>
                </Col>
                }
                <Col style={{display: 'flex', justifyContent: 'space-between', padding: 0}}>
                    <Col span={6}>
                        <Form.Item rules={[{required: true, message: ''}]} label={<PhoneOutlined/>} colon={false}
                                   name={'phone'}>
                            <Input placeholder={'19008003090'}/>
                        </Form.Item>
                    </Col>
                    <Col offset={1}>
                        <Form.Item rules={[{required: true, message: ''}]} name={'date'}>
                            <DatePicker defaultPickerValue={moment()}
                                        disabledDate={(c) => c < moment().subtract(1, "days")}
                                        format={'MM/DD/YY'}
                            />
                        </Form.Item>
                    </Col>
                    {['from', 'to'].map((label) =>
                        <Col>
                            <Form.Item rules={[{required: true, message: ''}]} labelCol={{offset: 1}} label={label} colon={false} name={'timeRangeFrom'}>
                                <TimePicker use12Hours defaultValue={moment()}
                                            format={'HH:MM A'}/>
                            </Form.Item>
                        </Col>
                    )}
                </Col>
                <Col style={{display: type === OrderPointTypeEnum.Pickup ? 'block' : 'none'}}>
                    <Form.Item rules={[{required: true, message: ''}]} name={'comment'}>
                        <Checkbox value={false}>Should the courier pay for get package?</Checkbox>
                    </Form.Item>
                </Col>
                <Divider style={{marginTop: 5}}/>
                <Col>
                    <Form.Item rules={[{required: true, message: ''}]} name={'comment'}>
                        <Input.TextArea placeholder={'Comment for address'}/>
                    </Form.Item>
                </Col>
            </Form>
        </Form.Item>
    )
};