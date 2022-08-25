import React from 'react';
import {Image} from "antd";
import preloaderPic from "../assets/pictures/preloader.png";

export function PreloaderScreen() {
    return (
        <div style={{height: '90vh', display: "flex", justifyContent: 'center', alignItems: 'center'}}>
            <Image src={preloaderPic}/>
        </div>
    );
};
