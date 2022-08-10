export enum UserRoleEnum {
    Courier = 'Courier',
    Customer = 'Customer'
}

export enum DeliveryTypeEnum {
    Walking = 'Walking',
    Car = 'Car',
    Truck = 'Truck',
}

export enum OrderPointTypeEnum {
    Pickup = 'Pickup',
    Delivery = 'Delivery',
}

export enum PayTypeEnum {
    SenderCash = 'Sender by cash',
    RecipientCash = 'Recipient by cash',
    ByBankApps = 'By bank apps',
}


//---AUTH---//
export type ExistUserType = {
    phone: string;
};
export type ExistUserResponseType = {
    exist: boolean;
    role: string | undefined;
};
export type LoginMutationType = {
    phone: string;
    code: string;
    role: UserRoleEnum;
};
export type LoginMutationResponseType = {
    sid: string;
};
export type LogoutMutationType = {
    userId: string;
};
export type SignupMutationType = {
    data: {
        name: string;
        // lastName: string;
        // birth: Date;
        phone: string;
        role: UserRoleEnum;
    }
    code: string;
};
export type SignupMutationResponseType = {sid: string};

//---CUSTOMER---//
export type GetCustomerInfoQueryType = {
    name: string;
    phone: string;
};
export type UpdateCustomerSettingsMutationType = {
    name: string
};

//---COURIER---//
export type GetCourierInfoQueryType = {
    name: string;
    phone: string;
};
export type UpdateCourierSettingsMutationType = {
    name: string
};

//---MAIL---//
export type ContactUsMutationType = {
    email: string;
    subject: string;
    text: string;
};

//---ORDER---//
export type CountOrderPriceAndDurationType = {
    origins: string;
    destinations: string[];
    deliveryType: DeliveryTypeEnum;
}
export type CountOrderPriceAndDurationResponseType = {
    price: number;
};

export type OrderPointType = {
    address: string;
    floor: number;
    apt: string;
    timeRangeFrom: number;
    timeRangeTo: number;
    date: Date;
    orderPointType: OrderPointTypeEnum;
    phone: string;
    payForPickup: boolean;
    comment: string;
}

export type CreateOrderMutationType = {
    deliveryType: DeliveryTypeEnum;
    weight: string;
    packageType: string;
    packagePrice: number;
    payType: PayTypeEnum;
    pickupPoint: OrderPointType
    deliveryPoints: [OrderPointType];
}
