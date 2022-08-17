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
    GetOrderQueryResponseType,
    GetOrdersQueryResponseType,
    GetOrdersQueryType,
    LoginMutationResponseType,
    LoginMutationType,
    OrderStatusEnum,
    SignupMutationResponseType,
    SignupMutationType,
    UpdateCourierSettingsMutationType,
    UpdateCustomerSettingsMutationType,
    UpdateOrderMutationType, UserRoleEnum
} from "./backend.api.types";
import Cookies from "js-cookie";
import {batch} from "react-redux";
import {settingsSliceActions} from '../settings/settings.slice'
import {appSliceActions} from '../app/app.slice'
import {notification} from "antd";

const {setSettingsField, resetSettingsState} = settingsSliceActions;
const {setAuth} = appSliceActions;
// const {setSettingsField, setAuth} = StoreActions;

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
            query: (body) => ({url: '/authorization/login', method: 'POST', body}),
            async onQueryStarted({data: {role}}, { dispatch, queryFulfilled }) {
                try {
                    const {data: loginData} = await queryFulfilled;
                    batch(() => {
                        Cookies.set('sid', loginData?.sid)
                        dispatch(setAuth(true))
                    })
                } catch {}
            },
        }),
        logout: build.mutation<any, void>({
            query: () => ({url: '/authorization/logout', method: 'POST'}),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    notification.success({message: 'You successful logout!'});
                    batch(() => {
                        Cookies.remove('sid')
                        dispatch(setAuth(false))
                        dispatch(resetSettingsState())
                    })
                } catch {
                    notification.error({message: "Error logout!"});
                }
            },
        }),
        signup: build.mutation<SignupMutationResponseType, SignupMutationType>({
            query: (body) => ({url: '/authorization/signup', method: 'POST', body}),
            async onQueryStarted({data: {role}}, { dispatch, queryFulfilled }) {
                try {
                    const {data: signupData} = await queryFulfilled;
                    batch(() => {
                        Cookies.set('sid', signupData?.sid)
                        dispatch(setAuth(true))
                    })
                } catch {}
            },
        }),
        //----------USER-----------//
        getUserInfo: build.query<GetCustomerInfoQueryType | GetCourierInfoQueryType, void>({
            query: () => ({url: '/user/info'}),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data: userSetting} = await queryFulfilled;
                    batch(() => {
                        for (const field in userSetting) {
                            dispatch(
                                setSettingsField({
                                    field,
                                    // @ts-ignore
                                    value: userSetting[field]
                                })
                            );
                            localStorage.setItem('role', userSetting.role);
                        }
                    })
                } catch (error) {
                    console.log(error, 'Error getUserInfo')
                    const {data: {status = null} = {}} = error as any || {};
                    if(status === 401) {
                        batch(() => {
                            Cookies.remove('sid')
                            dispatch(setAuth(false))
                            dispatch(resetSettingsState())
                        })
                    }
                }
            },
            // providesTags: () => ['User']
        }),
        updateUserSettings: build.mutation<boolean, UpdateCustomerSettingsMutationType | UpdateCourierSettingsMutationType>({
            query: (body) => ({url: '/user/update', method: 'POST', body}),
            async onQueryStarted(update, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    notification.success({message: 'Your settings updated successful!'})
                    batch(() => {
                        for (const field in update) {
                            dispatch(
                                setSettingsField({
                                    field,
                                    // @ts-ignore
                                    value: update[field]
                                })
                            );
                        }
                    })
                } catch (e) {
                    console.log(e, 'ERROR')
                   notification.error({message: 'Error update user info!'})
                }
            },
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
            query: (body) => ({url: '/order/create', method: 'POST', body}),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled;
                    if(data?.sid) {
                        batch(() => {
                            Cookies.set('sid', data?.sid)
                            dispatch(setAuth(true))
                        })
                    }
                } catch {}
            },
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
            query: (orderId) => ({url: '/order/take/', method: 'POST', body: {orderId}} ),
            invalidatesTags: result => ['Order']
        }),
        changeOrderStatus: build.mutation<boolean, { orderId: string, status: OrderStatusEnum }>({
            query: (body, ) => ({url: '/order/status', method: 'POST', body}),
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
    //---USER---//
    useLazyGetUserInfoQuery,
    useUpdateUserSettingsMutation,
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