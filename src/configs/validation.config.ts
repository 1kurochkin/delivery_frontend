import {Rule} from "rc-field-form/lib/interface";

export const VALIDATION_CONFIG = {
    deliveryType: [{required: false, message: ''}],
    timeRange: [{required: false, message: ''}],
    date: [{required: false, message: ''}],
    weight: [{required: false, message: ''}],
    payType: [{required: false, message: ''}],
    name: [
        {required: false, message: ''},
        {type: "string", max: 15, min: 3,  message: ''},
    ] as Rule[],
    packagePrice: [
        {required: true, message: ''},
        {type: "number", max: 900, min: 0, message: ''},
    ] as Rule[],
    packageType: [
        {required: true, message: ''},
        {type: "string", min: 3, max: 10, message: ''},
    ] as Rule[],
    address: [
        {required: true, message: ''},
        {type: "string", min: 11, max: 50, message: ''}
    ] as Rule[],
    phone: [
        {required: true, message: ''},
        {len: 11, message: ''},
        {type: "number", message: ''},
    ] as Rule[],
    code: [
        {required: true, message: ''},
        {type: "number", len: 6, message: ''},
    ] as Rule[],
}