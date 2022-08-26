import React from 'react';
import {Image} from "antd";
import preloaderPic from "../assets/pictures/preloader.png";

export function PreloaderScreen() {
    return (
        <div style={{
            height: '100vh',
            position: "absolute",
            left:0, top: 0, zIndex: 100,
            display: "flex",
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            width: '100vw'
        }}>
            <Image src={preloaderPic}/>
        </div>
    );
};
