export const ROUTES = {
    AUTH: {
        PATH: 'auth',
        LOGIN_PAGE: '/auth/login',
        SIGNUP_PAGE: '/auth/signup',
    },
    ORDER: {
        PATH: 'order',
        CREATE_PAGE: '/order/create',
        UPDATE_PAGE: '/order/update:orderId',
        LIST_PAGE: '/order/list',
    },
    PROFILE: {
        PATH: 'profile',
        SETTINGS_PAGE: '/profile/settings',
        RULES_PAGE: '/profile/settings',
    },
    MAIN_PAGE: '/',
    BECOME_COURIER_PAGE: '/become_courier',
    404: '/404',
    403: '/403',

}

export const PAGINATION = {
    TAKE: 10,
}