import React, {useState} from 'react';
import {Collapse, Row, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {ButtonBack} from "../components/buttonBack.component";
import {ROUTES} from "../configs/app.constants";

export function CourierFaq() {
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState<undefined | string>(undefined)
    const viewConfig = [
        {
            header: 'What is Bringa.me for a courier?',
            text: <Typography.Paragraph>
                <span className={'font-bold'}>Bringa.me</span> is a service in which couriers can deliver packages and earn money on it.
            </Typography.Paragraph>
        },
        {
            header: 'Who can become a courier?',
            text: <Typography.Paragraph>
                Anyone who is ready to transport small-sized, medium-sized and large-sized cargoes can become a Bringa courier.
            </Typography.Paragraph>
        },
        {
            header: 'Can I become a courier if I don\'t have a car?',
            text: <Typography.Paragraph>
                Yes, you can. We need couriers not only with their own car, but also on foot to transport small-sized packages such as papers, documents and etc.
            </Typography.Paragraph>
        },
        {
            header: 'What are the advantages for a courier working in Bringa.me?',
            text: <Typography.Paragraph>
                The main advantages include:<br/>
                <span className={'font-bold'}>Flexible schedule</span> - Deliver packages when it is comfortable for you.<br/>
                <span className={'font-bold'}>It's easy to get started</span> - Register, add money on your balance and start making a profit for delivering packages around the city.<br/>
                <span className={'font-bold'}>Small commission</span> - Only after you have received a profit from the delivery of the package, we withhold a service tax of 10% from delivery price.<br/>
            </Typography.Paragraph>
        },
        {
            header: 'Why i should add money to the balance?',
            text: <Typography.Paragraph>
                By add money to the balance, you guarantee the safety of the package that you deliver.
                the larger your balance, the more money you can earn by delivering more valuable packages.
            </Typography.Paragraph>
        },
        {
            header: 'How i will make money?',
            text: <Typography.Paragraph>
                 You profit from the delivery of the package directly from the customer in cash or by transferring money to your bank account.
            </Typography.Paragraph>
        },
        {
            header: 'How to get started with Bringa.me?',
            text: <Typography.Paragraph>
                Follow these simple steps to get started:<br/>
                <span className={'font-bold'}>1)</span> Go to <Link style={{textDecoration: 'underline'}} to={ROUTES.START}>bringa.me</Link><br/>
                <span className={'font-bold'}>2)</span> Select the option to log in as a courier<br/>
                <span className={'font-bold'}>3)</span> Add money to your balance in bitcoins (you can use ATMs or any cryptocurrency wallet)<br/>
                <span className={'font-bold'}>Ready! Starting earn money!🚀</span><br/>
                You can take your first order and start earning in Bringa (go to the order and click the take order button)<br/>
                After you take the order to work, you will have access to the contact information of the customer and more detailed information on the order.
            </Typography.Paragraph>
        },
        {
            header: 'What’s need to be delivered?',
            text: <Typography.Paragraph>
                Our clients are individuals, companies and online stores.<br/>
                You need to deliver various orders, for example: documents, flowers, medicines, clothes, food etc that is not prohibited by the laws of the state of New York.
            </Typography.Paragraph>
        },
        {
            header: 'How does the cost of an order calculated?',
            text: <Typography.Paragraph>
                The cost of the order based on the route and type of delivery (on walking , by car or truck).
            </Typography.Paragraph>
        },
        {
            header: 'What transport can I use to deliver packages?',
            text: <Typography.Paragraph>
                You can choose anything to carry for the package as long as it's legal.
            </Typography.Paragraph>
        },
        {
            header: 'Where can I go if I have problems or questions?',
            text: <Typography.Paragraph>
                If you have any questions, our operators will help you.
                Please contact support to resolve your issue.
                Go to Settings screen, then scroll to bottom and push Support Button, fill a contact form and press send button
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
