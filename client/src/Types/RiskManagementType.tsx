export interface BannedCardType {
    id: string,
    cardNumber: string,
    cardHolderName: string,
    expiryDate: string,
    reason: string,
    bannedBy: string,
    bannedDate: string
}

export interface BannedNameType {
    id: string;
    name: string;
    reason: string;
    bannedBy: string;
    bannedDate: string;
}

export interface RefundType {
    id: string,
    userName: string,
    originalTransactionId: string,
    originalTransactionAmount: number,
    refundAmount: number,
    gateway:string,
    refundDate: string | null,
    refundReason: string,
    refundStatus: string
}