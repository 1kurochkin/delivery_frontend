import React from 'react';
import {Button, Result} from "antd";
import {Link} from "react-router-dom";
import {ROUTES} from "../../configs/app.constants";

export function NotAuthorizedPage() {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary">
                <Link to={ROUTES.AUTH.LOGIN_PAGE}>Login</Link>
            </Button>}
        />
    );
};
