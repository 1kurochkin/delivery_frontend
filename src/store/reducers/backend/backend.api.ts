import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import appConfig from '../../../configs/app.config'
import {
    ContactUsMutationType,
    CountOrderPriceAndDurationResponseType,
    CountOrderPriceAndDurationType,
    CreateOrderMutationType,
    OrderStatusEnum,
    ExistUserResponseType,
    GetCourierInfoQueryType,
    GetCustomerInfoQueryType,
    GetOrderQueryResponseType,
    GetOrdersQueryResponseType,
    GetOrdersQueryType,
    LoginMutationResponseType,
    LoginMutationType,
    SignupMutationResponseType,
    SignupMutationType,
    UpdateCourierSettingsMutationType,
    UpdateCustomerSettingsMutationType,
    UpdateOrderMutationType
} from "./backend.api.types";
import Cookies from "js-cookie";

// const axiosBaseQuery =
//     ({ baseUrl } = { baseUrl: "" }) =>
//         async ({ url, method, data }) => {
//             try {
//                 const result = await axios({ url: baseUrl + url, method, data });
//                 return { data: result.data };
//             } catch (axiosError) {
//                 let err = axiosError;
//                 return {
//                     error: { status: err.response?.status, data: err.response?.data },
//                 };
//             }
//         };

export const backendApi = createApi({
    reducerPath: 'backendApi',
    baseQuery: fetchBaseQuery({
        baseUrl: appConfig.isProd ?
            `${appConfig.backend.prod.url}${appConfig.backend.api}`:
            `${appConfig.backend.local.url}${appConfig.backend.api}`,
        prepareHeaders: headers => {
            console.log('prepareHeaders')
            Cookies.get('sid') && headers.set("auth-token", Cookies.get('sid') || '');
            return headers;
        },
    }),
    tagTypes: ['Order', 'User'],
    endpoints: build => ({
        //----------AUTH-----------//
        existUser: build.query<ExistUserResponseType, string>({
            query: (phoneNumber) => ({url: `/authorization/exist/${phoneNumber}`})
        }),
        getCode: build.query<boolean, string>({
            query: (phoneNumber) => ({url: `/authorization/code/${phoneNumber}`})
        }),
        login: build.mutation<LoginMutationResponseType, LoginMutationType>({
            query: (body) => ({url: '/authorization/login', method: 'POST', body})
        }),
        logout: build.mutation<any, void>({
            query: () => ({url: '/authorization/logout', method: 'POST'})
        }),
        signup: build.mutation<SignupMutationResponseType, SignupMutationType>({
            query: (body) => ({url: '/authorization/signup', method: 'POST', body})
        }),
        //----------CUSTOMER-----------//
        getCustomerInfo: build.query<GetCustomerInfoQueryType, void>({
            query: () => ({url: '/customer/info'}),
            // providesTags: () => ['User']
        }),
        updateCustomerSettings: build.mutation<boolean, UpdateCustomerSettingsMutationType>({
            query: (body) => ({url: '/customer/settings', method: 'POST', body}),
            // invalidatesTags: () => ['User']
        }),
        //----------COURIER-----------//
        getCourierInfo: build.query<GetCourierInfoQueryType, void>({
            query: () => ({url: '/courier/info'}),
            // providesTags: () => ['User']
        }),
        updateCourierSettings: build.mutation<boolean, UpdateCourierSettingsMutationType>({
            query: (body) => ({url: '/courier/settings', method: 'POST', body}),
            // invalidatesTags: () => ['User']
        }),
        //----------MAIL-----------//
        contactUs: build.mutation<boolean, ContactUsMutationType>({
            query: (body) => ({url: '/mail/contact', method: 'POST', body})
        }),
        //----------ORDER-----------//
        countOrderPriceAndDuration: build.mutation<CountOrderPriceAndDurationResponseType, CountOrderPriceAndDurationType>({
            query: (body) => ({url: '/order/count', method: 'POST', body})
        }),
        createOrder: build.mutation<{ result: true, sid: string }, CreateOrderMutationType>({
            query: (body) => ({url: '/order/create', method: 'POST', body})
        }),
        updateOrder: build.mutation<boolean, UpdateOrderMutationType>({
            query: (body) => ({url: '/order/update', method: 'POST', body})
        }),
        getOrders: build.query<GetOrdersQueryResponseType, GetOrdersQueryType>({
            query: (params) => ({url: '/order/list', method: 'GET', params}),
            providesTags: () => ['Order']
        }),
        getOrder: build.query<GetOrderQueryResponseType, string>({
            query: (orderId) => ({url: `/order`, method: 'GET', params: {orderId}})
        }),
        takeOrder: build.mutation<boolean, string>({
            query: (orderId) => ({url: '/order/take', method: 'POST', body: {orderId}} )
        }),
        changeOrderStatus: build.mutation<boolean, { orderId: string, status: OrderStatusEnum }>({
            query: (body, ) => {
                console.log(body, "BODY changeOrderStatus")
                return {url: '/order/status', method: 'POST', body}
            },
            invalidatesTags: result => ['Order']
        }),
        //------------------------//
    })
});

export const {
    //---AUTH---//
    useLazyExistUserQuery,
    useLoginMutation,
    useLazyGetCodeQuery,
    useSignupMutation,
    useLogoutMutation,
    //---COURIER---//
    useLazyGetCourierInfoQuery,
    useUpdateCourierSettingsMutation,
    //---CUSTOMER---//
    useLazyGetCustomerInfoQuery,
    useUpdateCustomerSettingsMutation,
    //---MAIL---//
    useContactUsMutation,
    //---ORDER---//
    useCountOrderPriceAndDurationMutation,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useLazyGetOrdersQuery,
    useGetOrdersQuery,
    useLazyGetOrderQuery,
    useTakeOrderMutation,
    useChangeOrderStatusMutation,
} = backendApi;