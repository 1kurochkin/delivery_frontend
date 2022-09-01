export const ROUTES = {
    AUTH: {
        PATH: 'auth',
        LOGIN_PAGE: {
            PATH: '/auth/login',
            PARAMS: '/:userRole'
        },
        SIGNUP_PAGE: '/auth/signup',
    },
    ORDER: {
        PATH: 'order',
        CREATE_PAGE: '/order/create',
        UPDATE_PAGE: {
            PATH: '/order/update',
            PARAMS: '/:orderId'
        },
        LIST_PAGE: '/order/list',
        ORDER_PAGE: {
            PATH: '/order',
            PARAMS: '/:orderId'
        },
    },
    SETTINGS_PAGE: '/settings',
    MAIN_PAGE: '/home',
    BECOME_COURIER_PAGE: '/become_courier',
    THANK_YOU: '/thankyou',
    404: '/404',
    403: '/403',

}

export const COLORS = {
    MAIN: '#27CB84',
    SECOND: '#807E98',
    SUCCESS: '#27CB84',
    ERROR: 'red',
    WARNING: 'yellow'
}

export const PAGINATION = {
    TAKE: 5,
}