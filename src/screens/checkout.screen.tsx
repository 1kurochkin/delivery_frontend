import React, {useEffect, useState} from 'react';
import {Anchor, Button, Col, Form, Image, Row, Spin, Typography} from "antd";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "../configs/app.constants";
import {UserRoleEnum} from "../store/reducers/backend/backend.api.types";
import {SearchPlaces} from "../components/searchPlaces.component";
import courierPic from "../assets/pictures/courier.jpg"
import {useForm} from "antd/es/form/Form";
import {VALIDATION_CONFIG} from "../configs/validation.config";
import {ButtonBack} from "../components/buttonBack.component";
import {Preloader} from "../components/preloader.component";

export function CheckoutScreen() {
    const {state}: any = useLocation();
    const navigate = useNavigate();
    const {checkoutLink = undefined} = state || {};
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!checkoutLink) {
            navigate(-1)
        }
    }, [])
    return (
        <Row onScroll={() => null} style={{position: 'absolute', top: 0, left: 0, zIndex: 1000, backgroundColor: 'white'}}>
            <ButtonBack style={{position: 'fixed', top: 10, left: 10}}
                        onClick={() => navigate(
                            ROUTES.SETTINGS, {state: {isFromCheckoutScreen: true}})
                        }
            />
            {loading && <Preloader type={'fullscreen'}/>}
            <iframe style={{minWidth: '100vw', minHeight: '100vh', border:0}}
                    onLoad={() => setLoading(false)}
                    src={checkoutLink}
            />
        </Row>
    );
};
