export interface ManageNotificationsType {
    notification_id: string,
    recipient_type: string,
    recipient_ids: Array<string>,
    message_title:string,
    description :string,
    timestamp: string
}