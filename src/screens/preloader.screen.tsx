import React from 'react';
import {Image} from "antd";
import preloaderPic from "../assets/pictures/preloader.png";

export function PreloaderScreen() {
    return (
        <div style={{
            height: '100vh',
            position: "fixed",
            left:0, top: 0, zIndex: 1000,
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
