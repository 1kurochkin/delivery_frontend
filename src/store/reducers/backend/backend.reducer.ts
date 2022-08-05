import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import appConfig from '../../../configs/app.config'
import {
    CourierRegistrationMutationType,
    ExistUserResponseType,
    LoginMutationType,
    LogoutMutationType
} from "./backend.reducer.types";

export const backendReducer = createApi({
    reducerPath: 'backend/api',
    baseQuery: fetchBaseQuery({
        baseUrl: appConfig.isProd ?
            `${appConfig.backend.prod.url}${appConfig.backend.api}`:
            `${appConfig.backend.local.url}${appConfig.backend.api}`
    }),
    endpoints: build => ({
        existUser: build.query<ExistUserResponseType, string>({
            query: (phoneNumber) => ({url: `/authorization/exist/${phoneNumber}`})
        }),
        getCode: build.query<boolean, string>({
            query: (phoneNumber) => ({url: `/authorization/code/${phoneNumber}`})
        }),
        login: build.mutation<any, LoginMutationType>({
            query: (body) => ({url: '/authorization/login', body})
        }),
        logout: build.mutation<any, LogoutMutationType>({
            query: (body) => ({url: '/authorization/logout', body})
        }),
        customerSignup: build.mutation<any, CourierRegistrationMutationType>({
            query: (body) => ({url: '/authorization/customer/signup', body})
        }),
        courierSignup: build.mutation<any, CourierRegistrationMutationType>({
            query: (body) => ({url: '/authorization/courier/signup', body})
        }),

    })
});

export const {useLazyExistUserQuery, useLoginMutation, useLazyGetCodeQuery} = backendReducer;