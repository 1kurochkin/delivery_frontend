import React from 'react';
import {Button, Result} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {ROUTES} from "../../configs/app.constants";
import {ArrowLeftOutlined} from "@ant-design/icons";

type ButtonBackType = {
    onClick: React.MouseEventHandler<HTMLDivElement>
};
export function ButtonBack({onClick}: ButtonBackType) {
    const navigation = useNavigate();
    return (
        <div style={{
            width: 'unset',
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 15,
            boxShadow: "0px 0px 13px -3px rgba(0,0,0,0.46)"
        }}
            onClick={onClick}
        >
            <ArrowLeftOutlined style={{fontSize: 25}}/>
        </div>
    );
};
