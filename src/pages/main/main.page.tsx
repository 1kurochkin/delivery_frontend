import React from 'react';
import './main.page.style.scss';
import promoBoxes from '../../images/promo-boxes.png'
import {Button, Card} from "antd";
import boxes from '../../images/boxes.png';
import clothes from '../../images/clothes.png';
import documents from '../../images/documents.png';
import food from '../../images/food.png';
import drugs from '../../images/drugs.png';
import another from '../../images/another.png';
import {CreditCardFilled, DollarCircleFilled} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {ROUTES} from "../../configs/app.constants";

export function MainPage() {

    const sectionTwoCards = [
        {
            id: 1,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        },
        {
            id: 2,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        },
        {
            id: 3,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        },
        {
            id: 4,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        }
    ]

    const sectionThreeCards = [
        {
            id: 1,
            img: boxes,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        },
        {
            id: 2,
            img: drugs,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        },
        {
            id: 3,
            img: food,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        },
        {
            id: 4,
            img: documents,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        },
        {
            id: 5,
            img: clothes,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        },
        {
            id: 6,
            img: another,
            title: 'Lorem ipsum dolor sit amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere facilis hic illum inventore iste laborum nihil pariatur perferend'
        }
    ]

    return (
        <div className="main-page">
            <div className="main-page__section-one section">
                <div className="container">
                    <div className="main-page__section-one__body">
                        <div className="main-page__section-one__body__promo">
                            <h1 className="main-page__section-one__body__promo__h1 title">Lorem ipsum dolor sit
                                amet</h1>
                            <p className="main-page__section-one__body__promo__p">Lorem ipsum dolor sit amet,
                                consectetur adipisicing elit. A consequuntur deleniti doloribus error, eveniet facere
                                facilis hic illum inventore iste laborum nihil pariatur perferend</p>
                        </div>
                        <img src={promoBoxes} alt={'promo-image'} className="main-page__section-one__body__img"/>
                    </div>
                </div>
            </div>
            <div className="main-page__section-two section">
                <div className="container">
                    <div className="main-page__section-two__header">
                        <h2 className="main-page__section-two__header__title title">Lorem ipsum dolor sit amet</h2>
                    </div>
                    <div className="main-page__section-two__body">
                        {sectionTwoCards.map(({id, title, text}) =>
                            <Card className={'card main-page__section-two__body__item'} key={id} size="small">
                                <h2 className={'title'}>{title}</h2>
                                <p>{text}</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            <div className="main-page__section-three section">
                <div className="container">
                    <div className="main-page__section-three__header">
                        <h2 className={'main-page__section-three__header__title title'}>Lorem ipsum dolor sit amet</h2>
                    </div>
                    <div className="main-page__section-three__body">
                        {sectionThreeCards.map(({id, title, text, img}) =>
                            <Card
                                className={'main-page__section-three__body__item card'}
                                key={id}
                                size="small"
                                cover={<img src={img} alt={title}/>}
                            >
                                <h2 className={'title'}>{title}</h2>
                                <p>{text}</p>
                            </Card>
                        )}
                        {/*<div className="main-page__section-two__body__item"></div>*/}
                        {/*<div className="main-page__section-two__body__item"></div>*/}
                        {/*<div className="main-page__section-two__body__item"></div>*/}
                        {/*<div className="main-page__section-two__body__item"></div>*/}
                        {/*<div className="main-page__section-two__body__item"></div>*/}
                        {/*<div className="main-page__section-two__body__item"></div>*/}
                    </div>
                </div>
            </div>
            <div className="main-page__section-four section">
                <div className="container">
                    <div className="main-page__section-four__widget card">
                        <div className="main-page__section-four__widget__header">
                            <h2 className={'title'}>
                                Lorem ipsum dolor sit amet
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias aperiam cumque debitis
                                distinctio fugit hic ipsa ipsam laboriosam.
                            </p>
                        </div>
                        <div className="main-page__section-four__widget__body">
                            <div className="main-page__section-four__widget__body__item">
                                <DollarCircleFilled/>
                                <h3>Cash</h3>
                            </div>
                            <div className="main-page__section-four__widget__body__item">
                                <CreditCardFilled/>
                                <h3>Card</h3>
                            </div>
                        </div>
                        <div className="main-page__section-four__widget__footer">
                            <div className="main-page__section-four__widget__footer__wrapper">
                                <Link className={'main-page__section-four__widget__footer__wrapper__button button button-white'} to={ROUTES.ORDER.CREATE_PAGE}>Make order</Link>
                                <div className={'main-page__section-four__widget__footer__wrapper__questions'}>
                                    <span>Do you have questions? </span>
                                    <Link to={ROUTES.ORDER.CREATE_PAGE}>Write to us</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
