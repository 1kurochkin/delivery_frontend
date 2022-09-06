export const ROUTES = {
    LOGIN: {
        PATH: '/login',
        PARAMS: '/:userRole'
    },
    CREATE_ORDER: '/order/create',
    UPDATE_ORDER: {
        PATH: '/order/update',
        PARAMS: '/:orderId'
    },
    LIST_ORDERS: '/order/list' ,
    ORDER: {
        PATH: '/order',
        PARAMS: '/:orderId'
    },
    SETTINGS: '/settings',
    START: '/',
    COURIER_FAQ: '/courierFaq',
    CUSTOMER_FAQ: '/customerFaq',
    TERMS_AND_CONDITIONS: '/termsAndConditions',
    PRIVACY_POLICY: '/privacyPolicy',
    CHECKOUT: '/checkout',

}

export const COLORS = {
    MAIN: '#27CB84',
    SECOND: '#807E98',
    SUCCESS: '#27CB84',
    ERROR: 'red',
    WARNING: 'yellow',
    BLUE: '#0170fe',
}

export const PAGINATION = {
    TAKE: 5,
}