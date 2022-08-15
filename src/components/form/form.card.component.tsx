import {Checkbox, Col, DatePicker, Divider, Form, Input, Skeleton, TimePicker} from "antd";
import Title from "antd/lib/typography/Title";
import React, {useEffect, useState} from "react";
import {AimOutlined, PhoneOutlined} from "@ant-design/icons";
import moment, {Moment} from "moment";
import {FormInstance} from "antd/es/form/hooks/useForm";
import {SearchPlaces} from "../searchPlaces/search.places.component";
import {OrderPointTypeEnum} from "../../store/reducers/backend/backend.api.types";

type FormCardPropsType = {
    state: any;
    formRef: FormInstance,
    loadingData: boolean;
    onAddressChange: Function;
}

export const FormCard: React.FC<FormCardPropsType> = (props) => {
    const {formRef, loadingData, state, onAddressChange} = props;
    const [selected, setSelected] = useState(false)

    const onSelectSearchPlacesHandler = (value: any) => {
        setSelected(true)
        formRef.setFieldValue('address', value);
    }
    const onChangeSearchPlacesHandler = (value: any) => {
        console.log('onChangeSearchPlacesHandler', value)
        if (!value) {
            onAddressChange(value)
            setSelected(false)
        }
    }

    const disabledDate: (current: Moment) => boolean = (current) => {
        return current && current < moment().subtract(1, "days");
    };

    return (
        <Form.Item rules={[{required: true, message: ''}]}>
            <Title style={{textAlign: 'center'}} level={3}>{state.orderPointType}</Title>
            <Form initialValues={state} form={formRef} style={{border: '1px solid', padding: 15}}>
                <Col>
                    <Skeleton active={true} loading={loadingData}>
                        <Form.Item rules={[{required: true, message: ''}]} colon={false} label={<AimOutlined/>}
                                   name={'address'}>
                            <SearchPlaces onChange={onChangeSearchPlacesHandler}
                                          onSelect={onSelectSearchPlacesHandler}/>
                        </Form.Item>
                    </Skeleton>
                </Col>
                {(selected || formRef.getFieldValue('apt') || formRef.getFieldValue('floor')) &&
                <Col style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Col span={11}>
                        <Skeleton active={true} loading={loadingData}>
                            <Form.Item rules={[{required: true, message: ''}]} name={'floor'}>
                                <Input placeholder={'Floor'}/>
                            </Form.Item>
                        </Skeleton>
                    </Col>
                    <Col span={11}>
                        <Skeleton active={true} loading={loadingData}>
                            <Form.Item rules={[{required: true, message: ''}]} name={'apt'}>
                                <Input placeholder={'Apartment or office'}/>
                            </Form.Item>
                        </Skeleton>
                    </Col>
                </Col>
                }
                <Col style={{display: 'flex', justifyContent: 'space-between', padding: 0}}>
                    <Col span={6}>
                        <Skeleton active={true} loading={loadingData}>
                            <Form.Item rules={[{required: true, message: ''}]} label={<PhoneOutlined/>} colon={false}
                                       name={'phone'}>
                                <Input placeholder={'19008003090'}/>
                            </Form.Item>
                        </Skeleton>
                    </Col>
                    <Col offset={1}>
                        <Skeleton active={true} loading={loadingData}>
                            <Form.Item rules={[{required: true, message: ''}]} name={'date'}>
                                <DatePicker format={'MM/DD/YY'} disabledDate={disabledDate} />
                            </Form.Item>
                        </Skeleton>
                    </Col>
                    {[{label: 'from', name: 'timeRangeFrom'}, {label: 'to', name: 'timeRangeTo'}].map(({label, name}) =>
                        <Col>
                            <Skeleton active={true} loading={loadingData}>
                                <Form.Item rules={[{required: true, message: ''}]} labelCol={{offset: 1}} label={label}
                                           colon={false} name={name}>
                                    <TimePicker use12Hours defaultValue={moment()}
                                                format={'HH:MM A'}/>
                                </Form.Item>
                            </Skeleton>
                        </Col>
                    )}
                </Col>
                <Col style={{display: state.orderPointType === OrderPointTypeEnum.Pickup ? 'block' : 'none'}}>
                    <Skeleton active={true} loading={loadingData}>
                        <Form.Item valuePropName="checked" rules={[{required: true, message: ''}]} name={'payForPickup'}>
                            <Checkbox>Should the courier pay for get package?</Checkbox>
                        </Form.Item>
                    </Skeleton>
                </Col>
                <Divider style={{marginTop: 5}}/>
                <Col>
                    <Skeleton active={true} loading={loadingData}>
                        <Form.Item rules={[{required: !!formRef.getFieldValue('payForPickup'), message: ''}]}
                                   name={'comment'}
                        >
                            <Input.TextArea placeholder={'Comment for address'}/>
                        </Form.Item>
                    </Skeleton>
                </Col>
            </Form>
        </Form.Item>
    )
};