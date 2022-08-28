import {Moment} from "moment";

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

export enum OrderStatusEnum {
    Available = 'Available',
    Active = 'Active',
    Completed = 'Completed',
    Canceled = 'Canceled',
    Fault = 'Fault',
}


export enum PackageWeightEnum {
    Under1 = 'Under 1 lb',
    Under2 = 'Under 2 lb',
    Under5 = 'Under 5 lb',
    Under10 = 'Under 10 lb',
    Under15 = 'Under 15 lb',
    Under20 = 'Under 20 lb',
    More20 = 'More 20 lb',
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
    data: {
        phone: string;
        role: UserRoleEnum;
    },
    code: string;
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
export type SignupMutationResponseType = { sid: string };

//---CUSTOMER---//
export type GetCustomerInfoQueryType = {
    name: string;
    phone: string;
    role: UserRoleEnum;
};
export type UpdateCustomerSettingsMutationType = {
    name: string
};

//---COURIER---//
export type GetCourierInfoQueryType = {
    name: string;
    phone: string;
    role: UserRoleEnum;
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
    id: string;
    orderId: string;
    address: string;
    floor: number;
    apt: string;
    timeRangeFrom: Moment;
    timeRangeTo: Moment;
    date: Moment;
    orderPointType: OrderPointTypeEnum;
    phone: string;
    payForPickup: boolean;
    comment: string;
    updatedAt: Moment;
    createdAt: Moment;
}

export type CreateOrderMutationType = {
    deliveryType: DeliveryTypeEnum;
    weight: string;
    packageType: string;
    packagePrice: number;
    payType: PayTypeEnum;
    pickupPoint: OrderPointType
    deliveryPoint: OrderPointType;
}
export type UpdateOrderMutationType = {
    orderId: number;
    update: Partial<CreateOrderMutationType>
}
export type OrderType = {
    id: number;
    customerId: string;
    courierId: string;
    courier?: {
        name: string;
        phone: string;
    },
    customer?: {
        name: string;
        phone: string;
    }
    pickupPoint: OrderPointType
    deliveryPoint: OrderPointType;
    duration: number;
    deliveryType: DeliveryTypeEnum;
    status: OrderStatusEnum;
    weight: string;
    packageType: string;
    packagePrice: number;
    deliveryPrice: number;
    payType: PayTypeEnum;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
export type GetOrdersQueryType = {
    status?: OrderStatusEnum;
    skip: number;
    take: number;
}
export type GetOrdersQueryResponseType = {
    list: Array<OrderType>,
    pagination: { total: number }
}
export type GetOrderQueryResponseType = OrderType