export interface MethodSettingsType {
    _id: any,
    id: any,
    method_id: string,
    gateway_name: string,
    image: string,
    api_key: string,
    secret_key: string,
    deposit: boolean,
    withdraw: boolean,
    iFrame_access: boolean,
    min_transaction: number,
    max_transaction: number,
    auto_reject: number,
    active_status: boolean,
    commission: string,
    manual_commission: number,
    allow_currency: string,
}

export interface TransferSettingsType {
    id: string,
    gateway?: string,
    name: string,
}


export interface ManageBanksType {
    _id: string,
    id: string,
    company_name: string,
    bank_name: string,
    account_owner: string,
    account_IBAN: string,
    limit: number,
    balance: number,
    api: string,
    active_status: boolean,
    delete_status: boolean,
    approval_type: string,
    status: boolean,
    user_name: {
        _id: string,
        first_name: string
    }
}

export interface DomainListType {
    domain_id: string,
    id: string,
    _id: string,
    domain_name: string,
    merchant_id: string,
    dateTime: string,
    status: boolean,
    createdAt: string,
    merchant: {
        merchant_id: string,
        name: string
    }
}

export interface SystemLogListType {
    userId: string,
    id: string,
    _id: string,
    createdAt: string,
    adminData: {
        fullName: string,
        hasSubAdmin: any
    }
}

export interface IpListsType {
    id: string,
    _id: string,
    ip_id: string,
    ip_address: string,
    merchant_id: string,
    createdAt: string,
    country: string,
    status: boolean,
    merchant: {
        merchant_id: string,
        name: string
    }
}

export interface ManageCurrencyType {
    id: string,
    currency_id: string,
    currency_code: string,
    currency_name: string,
    symbol: string,
    country: string,
    active_status: boolean,
    delete_status: string
}

export interface CommissionType {
    id: string,
    _id: string,
    percentage: number,
}