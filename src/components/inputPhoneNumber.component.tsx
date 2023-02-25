//@ ts-ignore
import { InputNumber } from 'antd';
import { ReactComponent as Phone } from "../assets/svgs/phone.svg";

export function InputPhoneNumber(props) {

    return (
        <InputNumber
        maxLength={11}
        // autoFocus={false}
        placeholder={"Phone number with country code"}
        style={{ width: "100%" }}
        prefix={<Phone />}
        {...props}
      />
    );
}
