import React, {CSSProperties} from 'react';
import preloader from '../assets/gifs/preloader.gif';

const fullscreenStyles = {
    width: '100%',
    height: '100%',
    // position: 'fixed',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}
const usualStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'white'
}
const preloaderStylesByTypeConfig = {
    fullscreen: fullscreenStyles,
    usual: usualStyles
}
export function Preloader({type, styles}: { type: 'fullscreen' | 'usual', styles?: CSSProperties | undefined }) {
    return (
        // @ts-ignore
        <div style={{...preloaderStylesByTypeConfig[type], ...styles}}>
            <img width={150} height={150} src={preloader}/>
        </div>
    );
};
