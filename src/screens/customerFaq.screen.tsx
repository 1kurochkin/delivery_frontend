import React, {useState} from 'react';
import {Collapse, Row, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {ButtonBack} from "../components/buttonBack.component";

export function CustomerFaqScreen() {
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState<undefined | string>(undefined)
    const viewConfig = [
        {
            header: 'What is Bringa?',
            text: <Typography.Paragraph>
                Welcome to the Bringa – new fast same day delivery service in New York city.<br/>
                Just book appropriate time for you via our website or mobile app and make an order.<br/>
                We also provide urgent fast running couriers for immediate pickup and door-to-door delivery.<br/>
                That’s our main benefit – we are extremely quick!
            </Typography.Paragraph>
        },
        {
            header: 'What can Bringa transport?',
            text: <Typography.Paragraph>
                You can make as a personal orders as for your business too.<br/>
                We are good for internet shops, documents, food, medicine, flowers and all that do not prohibited in New York State.<br/>
                We also work as a moving service for your house and office.
            </Typography.Paragraph>
        },
        {
            header: 'How can I start?',
            text: <Typography.Paragraph>
                <span className={'font-bold'}>1)</span> Login as a customer on bringa.me or download our mobile app.<br/>
                <span className={'font-bold'}>2)</span> Confirm your mobile phone via sms-code.<br/>
                <span className={'font-bold'}>3)</span> Place an order, pack your parcel securely and wait for the courier.<br/>
                <span className={'font-bold'}>4)</span> Track your order online while recipient get it.
            </Typography.Paragraph>
        },
        {
            header: 'How to make an order?',
            text: <Typography.Paragraph>
                <span className={'font-bold'}>1)</span> Place an order on the main page on bringa.me or in mobile app.<br/>
                <span className={'font-bold'}>2)</span> Choose a type of delivery – walking courier, courier by passenger car or track.<br/>
                <span className={'font-bold'}>3)</span> Indicate the cost of your package (insurance), it’s type and weight.<br/>
                <span className={'font-bold'}>4)</span> Choose a convenient payment method for you.<br/>
                <span className={'font-bold'}>5)</span> Specify address where to pick up your parcel, appropriate day and time. Don’t forget to provide a recipient’s phone number.<br/>
                <span className={'font-bold'}>6)</span> In the comments indicate all additional information that can be useful for a courier – apartment/flat number, order id, etc.<br/>
                <span className={'font-bold'}>7)</span> Bringa calculate the cost of your order and start to find a nearest courier for you.<br/>
            </Typography.Paragraph>
        },
        {
            header: 'What weight can I send with Bringa?',
            text: <Typography.Paragraph>
                We have 3 options for the delivery:<br/>
                <span className={'font-bold'}>1)</span> Walking courier for orders not exceeding 20 lb.<br/>
                <span className={'font-bold'}>2)</span> Couriers with cars for orders not more than 300 lb.<br/>
                <span className={'font-bold'}>3)</span> Trucks for big orders over 300 lb.
            </Typography.Paragraph>
        },
        {
            header: 'How quickly does a courier pick up my order?',
            text: <Typography.Paragraph>
                Bringa send fastest and nearest courier to you in accordance the time you have pointed.
            </Typography.Paragraph>
        },
        {
            header: 'How do I pay for my order?',
            text: <Typography.Paragraph>
                You have to pay to a courier one of the following ways:<br/>
                <span className={'font-bold'}>1)</span> Cash<br/>
                <span className={'font-bold'}>2)</span> Cash on delivery<br/>
                <span className={'font-bold'}>3)</span> Cash App, Zelle or Pay Pal
            </Typography.Paragraph>
        },
        {
            header: 'How can I track the order or check its status?',
            text: <Typography.Paragraph>
                You can check status of order in your account.
                Select the tab with list of orders, choose an order you would like to check and find out where is it now.
                You can also see a couriers phone number for emergency call.
            </Typography.Paragraph>
        },
        {
            header: 'How can I cancel my order?',
            text: <Typography.Paragraph>
                You can cancel not accepted orders only. If Bringa has already confirmed an order – please, contact our support service asap.
            </Typography.Paragraph>
        },
        {
            header: 'How can I make changes to my order?',
            text: <Typography.Paragraph>
                You can change your order if you still have no appointed courier. In case of accepted order contact the support team.
            </Typography.Paragraph>
        },
        {
            header: 'How do I know recipient got the order?',
            text: <Typography.Paragraph>
                Status of your order will change to “Completed’’ in your account.
            </Typography.Paragraph>
        },
        {
            header: 'What if there will be no one couriers for my order?',
            text: <Typography.Paragraph>
                Don’t panic and wait. During rush hours orders may accepted longer.
                Of course if you don’t want to deliver an elephant to Union Square :)
                Although there may be a brave courier for this!
            </Typography.Paragraph>
        },
        {
            header: 'What should I do if courier doesn’t pick up my order?',
            text: <Typography.Paragraph>
                Contact courier by phone he indicate in contact information.
            </Typography.Paragraph>
        },
        {
            header: 'What should I do if I have any problems or questions?',
            text: <Typography.Paragraph>
                Please, contact our support team via Support Button in your Personal Account.
            </Typography.Paragraph>
        },
    ]
    return (
        <>
            <Row style={{alignItems: 'center', marginBottom: 20}} justify={'space-between'}>
                <ButtonBack onClick={() => navigate(-1)}/>
                <Typography.Title style={{marginBottom: 0}} level={2}>Customer FAQ</Typography.Title>
            </Row>
            <Row>
                <Collapse activeKey={activePanel} onChange={(key) => setActivePanel(key as string)} style={{width: '100%'}}>
                    {viewConfig.map(({header, text}, i) =>
                        <Collapse.Panel header={header} key={i}>
                            {text}
                        </Collapse.Panel>
                    )}
                </Collapse>
            </Row>
        </>
    );
};
