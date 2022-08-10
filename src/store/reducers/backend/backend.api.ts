import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import appConfig from '../../../configs/app.config'
import {
    ContactUsMutationType,
    CountOrderPriceAndDurationResponseType,
    CountOrderPriceAndDurationType,
    CreateOrderMutationType,
    ExistUserResponseType,
    GetCourierInfoQueryType,
    GetCustomerInfoQueryType,
    LoginMutationType,
    LogoutMutationType,
    SignupMutationResponseType,
    SignupMutationType,
    UpdateCourierSettingsMutationType,
    UpdateCustomerSettingsMutationType
} from "./backend.api.types";

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
            `${appConfig.backend.local.url}${appConfig.backend.api}`
    }),
    endpoints: build => ({
        //----------AUTH-----------//
        existUser: build.query<ExistUserResponseType, string>({
            query: (phoneNumber) => ({url: `/authorization/exist/${phoneNumber}`})
        }),
        getCode: build.query<boolean, string>({
            query: (phoneNumber) => ({url: `/authorization/code/${phoneNumber}`})
        }),
        login: build.mutation<any, LoginMutationType>({
            query: (body) => ({url: '/authorization/login', method: 'POST', body})
        }),
        logout: build.mutation<any, LogoutMutationType>({
            query: (body) => ({url: '/authorization/logout', method: 'POST', body})
        }),
        signup: build.mutation<SignupMutationResponseType, SignupMutationType>({
            query: (body) => ({url: '/authorization/signup', method: 'POST', body})
        }),
        //----------CUSTOMER-----------//
        getCustomerInfo: build.query<GetCustomerInfoQueryType, any>({
            query: () => ({url: '/customer/info'})
        }),
        updateCustomerSettings: build.mutation<boolean, UpdateCustomerSettingsMutationType>({
            query: (body) => ({url: '/customer/settings', method: 'POST', body})
        }),
        //----------COURIER-----------//
        getCourierInfo: build.query<GetCourierInfoQueryType, any>({
            query: () => ({url: '/courier/info'}),

        }),
        updateCourierSettings: build.mutation<boolean, UpdateCourierSettingsMutationType>({
            query: (body) => ({url: '/courier/settings', method: 'POST', body})
        }),
        //----------MAIL-----------//
        contactUs: build.mutation<boolean, ContactUsMutationType>({
            query: (body) => ({url: '/mail/contact', method: 'POST', body})
        }),
        //----------ORDER-----------//
        countOrderPriceAndDuration: build.mutation<CountOrderPriceAndDurationResponseType, CountOrderPriceAndDurationType>({
            query: (body) => ({url: '/order/count', method: 'POST', body})
        }),
        createOrder: build.mutation<boolean, CreateOrderMutationType>({
            query: (body) => ({url: '/order/create', method: 'POST', body})
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
} = backendApi;