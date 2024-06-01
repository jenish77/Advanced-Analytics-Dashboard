export interface CreatedApiListsType {
    id: string,
    userId: string,
    username: string,
    createdOn: string,
    apiKey: string,
    secretKey: string,
    method: string
}

export interface CreatedIFrameListsType {
    id: string,
    _id: string,
    user_id: string,
    user_name: string,
    iframe_name: string,
    method_id: string,
    name: string,
    url: string,
    createdAt: string,
    status: boolean,
    method: {
        method_id: string,
        name: string
    }
}