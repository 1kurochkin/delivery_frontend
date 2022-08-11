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

export enum DeliveryStatusEnum {
    Waiting = 'Waiting',
    Process = 'Process',
    Delivered = 'Delivered',
    Canceled = 'Canceled',
    Fault = 'Fault',
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
    timeRangeFrom: string;
    timeRangeTo: string;
    date: string;
    orderPointType: OrderPointTypeEnum;
    phone: string;
    // payForPickup: boolean;
    comment: string;
}

export type CreateOrderMutationType = {
    deliveryType: DeliveryTypeEnum;
    weight: string;
    packageType: string;
    packagePrice: number;
    payType: PayTypeEnum;
    pickupPoint: OrderPointType
    deliveryPoints: Array<OrderPointType>;
    phone: string;
    code: string;
}
export type UpdateOrderMutationType = Partial<CreateOrderMutationType>

export type OrderType = {
    id: string;
    customerId: string;
    courierId: string;
    courier: {
        name: string;
        phone: string;
    }
    pickupPoint: OrderPointType
    deliveryPoints: Array<OrderPointType>;
    duration: number;
    deliveryType: DeliveryTypeEnum;
    deliveryStatus: DeliveryStatusEnum;
    weight: string;
    packageType: string;
    packagePrice: number;
    deliveryPrice: number;
    payType: PayTypeEnum;
    createdAt: Date;
    updatedAt: Date;
}
export type GetOrdersQueryType = {
    filter?: Partial<{ active: boolean, completed: boolean }>;
    pagination: {
        skip: number;
        take: number;
    }
}
export type GetOrdersQueryResponseType = {
    list: Array<OrderType>,
    pagination: {total: number}
}
export type GetOrderQueryResponseType = OrderType