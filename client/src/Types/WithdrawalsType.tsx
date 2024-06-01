export interface AllWithdrawalsType {
    _id: string;
    merchant_id: {
        _id: string,
        first_name: string,
        last_name: string
    },
    dealer_id: {
        _id: string,
        first_name: string,
        last_name: string
    },
    currency: {
        _id: string,
        currency_id: string,
        currency_code: string,
        currency_name: string,
        symbol: string,
        country: string
    },
    first_name: any;
    last_name: any;
    final_amount: number;
    transactionid: number;
    status: any;
    transaction_id: string;
    type: any;
    main_amount: string;
    dealer_commission: string;
    dealer_commission_rate: string;
    admin_commission: string;
    admin_commission_rate: string;
    trans_unique_id: string;
    status_description: string;
    createdAt: string;
}

export interface WithdrawalMethodType {
    MethodID: string,
    Image: string,
    MethodName: string,
    MinimumAmount: number,
    MaximumAmount: number,
    ProcessingTime: string,
    Fees: number,
    Active: boolean,
    Restrictions: string
}
export interface PendingWithdrawalsType {
    _id: string;
    merchant_id: {
        _id: string,
        first_name: string,
        last_name: string
    },
    dealer_id: {
        _id: string,
        first_name: string,
        last_name: string
    },
    currency: {
        _id: string,
        currency_id: string,
        currency_code: string,
        currency_name: string,
        symbol: string,
        country: string
    },
    first_name: any;
    last_name: any;
    final_amount: number;
    transactionid: number;
    status: any;
    transaction_id: string;
    type: any;
    main_amount: string;
    dealer_commission: string;
    dealer_commission_rate: string;
    admin_commission: string;
    admin_commission_rate: string;
    trans_unique_id: string;
    status_description: string;
    createdAt: string;
}