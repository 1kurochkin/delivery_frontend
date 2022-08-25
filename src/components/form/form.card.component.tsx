import {DatePicker, Form, Input, InputNumber, Row, TimePicker} from "antd";
import React from "react";
import moment, {Moment} from "moment";
import {SearchPlaces} from "../searchPlaces/search.places.component";

type FormCardPropsType = {
    state: any;
    loadingData: boolean;
    onAddressChange: Function;
}

export const FormCard: React.FC<FormCardPropsType> = (props) => {
    // const {formRef, loadingData, state, onAddressChange} = props;
    // const [selected, setSelected] = useState(false)

    // const onSelectSearchPlacesHandler = (value: any) => {
    //     setSelected(true)
    //     formRef.setFieldValue('address', value);
    // }
    // const onChangeSearchPlacesHandler = (value: any) => {
    //     console.log('onChangeSearchPlacesHandler', value)
    //     if (!value) {
    //         onAddressChange(value)
    //         setSelected(false)
    //     }
    // }

    const disabledDate: (current: Moment) => boolean = (current) => {
        return current && current < moment().subtract(1, "days");
    };

    return (<>
            <Form.Item label={'Specify the address where to deliver the parcel'} rules={[{required: true, message: ''}]}
                       style={{width: '100%'}} name="address">
                <SearchPlaces placeholder={'1556 Broadway, New York, 10120, USA'}/>
            </Form.Item>
            <Row justify={'space-between'}>
                <Form.Item rules={[{required: true, message: ''}]} style={{width: '20%'}} label={'floor'} name="floor">
                    <InputNumber placeholder={'5'} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item rules={[{required: true, message: ''}]} style={{width: '20%'}} label={'apt'} name="apt">
                    <Input placeholder={'4H'}/>
                </Form.Item>
                <Form.Item rules={[{required: true, message: ''}]} style={{width: '49%'}} label={'Phone number'}
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
                    <DatePicker placement={'topLeft'} suffixIcon={null} format={'MM/DD/YY'} disabledDate={disabledDate}/>
                </Form.Item>
                <Form.Item rules={[{required: true, message: ''}]}
                           style={{width: '63%'}}
                           label={'Specify time'}
                           name="timeRange"
                >
                    <TimePicker.RangePicker placement={'topLeft'} format={'HH:MM A'} suffixIcon={null} use12Hours={true}/>
                </Form.Item>
            </Row>
        </>
    )
};