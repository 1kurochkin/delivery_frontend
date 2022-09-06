import React, {useState} from 'react';
import {Collapse, Row, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {ButtonBack} from "../components/buttonBack.component";

export function CourierFaq() {
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState<undefined | string>(undefined)
    const viewConfig = [
        {header: 'What is that?', text: 'This is New york express delivery service'},
        {
            header: 'How i can order delivery?',
            text: <Typography.Paragraph>
               1) Enter the address from where the courier should pick up the package.<br/>
               2) Enter how much you are willing to pay. The average cost for a small package is $5 - $7.<br/>
               3) Enter the destination address where the courier should deliver the package.<br/>
               4) Choose the date for the parcel pickup.<br/>
               5) Pick the time when you want the package to be collected from your location.<br/>
               6) Make the payment. You are all set! <br/>
               7) Once your package arrives at the destination address, we will notify you.<br/>
            </Typography.Paragraph>
        },
        {
            header: 'How i can order delivery?',
            text: <Typography.Paragraph>
                1) Enter the address from where the courier should pick up the package.<br/>
                2) Enter how much you are willing to pay. The average cost for a small package is $5 - $7.<br/>
                3) Enter the destination address where the courier should deliver the package.<br/>
                4) Choose the date for the parcel pickup.<br/>
                5) Pick the time when you want the package to be collected from your location.<br/>
                6) Make the payment. You are all set! <br/>
                7) Once your package arrives at the destination address, we will notify you.<br/>
            </Typography.Paragraph>
        },
        {
            header: 'How much does it cost?',
            text: <Typography.Paragraph>
                TEXT
            </Typography.Paragraph>
        },
        {
            header: 'How can I pay?',
            text: <Typography.Paragraph>
                TEXT
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
