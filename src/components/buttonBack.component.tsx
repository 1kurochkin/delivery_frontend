import React from 'react';
import {ArrowLeftOutlined} from "@ant-design/icons";
import {ReactComponent as ArrowBack} from '../assets/svgs/arrowBack.svg';
type ButtonBackType = {
    onClick: React.MouseEventHandler<HTMLDivElement>,
    style?: any
};
export function ButtonBack({onClick, style}: ButtonBackType) {
    return (
        <div style={{
            width: 'unset',
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: '17px 14px',
            display:'flex',
            boxShadow: "0px 0px 13px -3px rgba(0,0,0,0.46)",
            ...style
        }}
            onClick={onClick}
        >
            <ArrowBack/>
        </div>
    );
};
