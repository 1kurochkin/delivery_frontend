export enum UserRoleEnum {
    Courier = 'Courier',
    Customer = 'Customer'
}

export type ExistUserType = {
    phone: string;
};
export type ExistUserResponseType = {
    isExist: boolean;
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

export type CourierRegistrationMutationType = {
    name: string;
    lastName: string;
    birth: Date;
    phone: string;
    code: string;
};