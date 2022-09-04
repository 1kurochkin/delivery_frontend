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
        {pattern: new RegExp('[0-9]{11}'), message: '', transform: value => String(value)},
        {type: "number", message: ''},
    ] as Rule[],
    code: [
        {required: true, message: ''},
        {transform: value => String(value)},
        {type: "string", min:6, max:6, message: ''},
    ] as Rule[],
}