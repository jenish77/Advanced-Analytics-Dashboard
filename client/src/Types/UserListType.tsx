export interface DealerType {
  id: string,
  _id: string,
  first_name: string,
  last_name: string,
  company_name:string,
  location: string,
  email: string,
  balance: number,
  contact_number: string,
  active_status: boolean,
  createdAt: string,
}
export interface MerchantType {
  id: string,
  _id:any,
  first_name: string,
  last_name: string,
  location: string,
  email: string,
  api_key: string,
  secret_key: string,
  balance: number,
  contact_number: string,
  active_status: boolean,
  business_type: string
  business_name: string
  createdAt: string,
}

export interface SubAdminUserListType {
  _id: string,
  fullName: string,
  roleName: string,
  createdAt: string,
  status: number,
  }

export interface BusinesstypeListType {
  id: string,
  _id: string,
  business_type: string,
  active_status: string,
  createdAt: string,
}

