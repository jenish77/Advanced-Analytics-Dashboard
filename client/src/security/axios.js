import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_PATH = BASE_URL + "/admin";

const AUTH_API_URL = {
  login: path(ROOTS_PATH, "/admin-login"),
  logout: path(ROOTS_PATH, "/admin-logout"),
  getProfile: path(ROOTS_PATH, "/get-profile"),
  updateProfile: path(ROOTS_PATH, "/update-profile"),
  changePassword: path(ROOTS_PATH, "/change-password"),
  generateGoogle2fa: path(ROOTS_PATH, "/generate-qrcode"),
  google2faCheck: path(ROOTS_PATH, "/enable-google-2fa"),
  google2faCheckLoginTime: path(ROOTS_PATH, "/verify-google-2fa"),
};

const DEALER_API_URL = {
  addDealer: path(ROOTS_PATH, "/addDealer"),
  updateDealer: path(ROOTS_PATH, "/editDealerDetails"),
  changeUserPermission: path(ROOTS_PATH, "/changeUserStatus"),
  getDealerList: path(ROOTS_PATH, "/getAllDealers"),
  getDealersNames: path(ROOTS_PATH, "/getDealerNames"),
  getOneDealer: path(ROOTS_PATH, "/getOneUser"),
};

const MERCHANT_API_URL = {
  getMerchantList: path(ROOTS_PATH, "/getAllMerchants"),
  addMerchant: path(ROOTS_PATH, "/addMerchant"),
  updateMerchant: path(ROOTS_PATH, "/editMerchantDetails"),
  changeUserPermission: path(ROOTS_PATH, "/changeUserStatus"),
  getActiveCurrency: path(ROOTS_PATH, "/getActiveCurrency"),
};

const ROLE_PERMISSION_API_URL = {
  permissionList: path(ROOTS_PATH, "/permission-list"),
  roleEdit: path(ROOTS_PATH, "/role-edit"),
  rolestatus: path(ROOTS_PATH, "/role-status"),
  roleUpdate: path(ROOTS_PATH, "/role-update"),
  roleList: path(ROOTS_PATH, "/role-list"),
  roleStatusList: path(ROOTS_PATH, "/role-status-list"),
  rolaHasPermissionCreate: path(ROOTS_PATH, "/add-roleHasPermission"),
  getPermissionList: path(ROOTS_PATH, "/get-permission-list"),
};

const SUB_ADMIN_API_URL = {
  subAdminCreate: path(ROOTS_PATH, "/sub-admin-create"),
  subAdminUpdate: path(ROOTS_PATH, "/sub-admin-update"),
  subAdminList: path(ROOTS_PATH, "/sub-admin-list"),
  subAdminStatus: path(ROOTS_PATH, "/sub-admin-status"),
  getActivityLog: path(ROOTS_PATH, "/getActivityLog"),
};

const PAYMENT_API_URL = {
  // METHOD URL
  getAllMethods: path(ROOTS_PATH, "/getAllMethods"),
  getAllMethodsName: path(ROOTS_PATH, "/getMethodsName"),
  addMethod: path(ROOTS_PATH, "/addMethod"),
  editMethod: path(ROOTS_PATH, "/editMethodDetails"),
  deleteMethod: path(ROOTS_PATH, "/deleteMethod"),
  uploadImage: path(ROOTS_PATH, "/image-upload"),
  changeMethodPermission: path(ROOTS_PATH, "/changeMethodPermission"),
  getOneMethod: path(ROOTS_PATH, "/getOneMethod"),
};

const DOMAIN_API_URL = {
  getDomain: path(ROOTS_PATH, "/getDomain"),
  addDomain: path(ROOTS_PATH, "/addDomain"),
  editDomain: path(ROOTS_PATH, "/editDomain"),
  deleteDomain: path(ROOTS_PATH, "/deleteDomain"),
  changeDomainStatus: path(ROOTS_PATH, "/changeDomainStatus"),
};

const SYS_CONFIGRATION_URL = {
  getSysConfirgration: path(ROOTS_PATH, "/getSysConfirgration"),
  changeSysConfirgrationStatus: path(
    ROOTS_PATH,
    "/changeSysConfirgrationStatus"
  ),
};

const IP_ADDRESS_API_URL = {
  getIpAddress: path(ROOTS_PATH, "/getIpAddress"),
  addIpAddress: path(ROOTS_PATH, "/addIpAddress"),
  editIpAddress: path(ROOTS_PATH, "/editIpAddress"),
  deleteIpAddress: path(ROOTS_PATH, "/deleteIpAddress"),
  changeIpAddressStatus: path(ROOTS_PATH, "/changeIpAddressStatus"),
};

const BUSINESS_TYPE_URL = {
  addbusinesstype: path(ROOTS_PATH, "/addBusinessType"),
  editBusinessTypeDetails: path(ROOTS_PATH, "/editBusinessTypeDetails"),
  getbusinesstype: path(ROOTS_PATH, "/getBusinessType"),
  changeBussinessTypePermission: path(ROOTS_PATH, "/changeTypeStatus"),
};

const CURRENCY_API_URL = {
  getCurrency: path(ROOTS_PATH, "/getCurrency"),
  addCurrency: path(ROOTS_PATH, "/addCurrency"),
  editCurrencyDetails: path(ROOTS_PATH, "/editCurrencyDetails"),
  changeCurrencyStatus: path(ROOTS_PATH, "/changeCurrencyStatus"),
  getCurrencyDetail: path(ROOTS_PATH, "/getCurrencydetail"),
};

const BANK_API_URL = {
  getAllBanks: path(ROOTS_PATH, "/getAllBanks"),
  addBank: path(ROOTS_PATH, "/addBank"),
  editBankDetails: path(ROOTS_PATH, "/editBankDetails"),
  changeBankStatus: path(ROOTS_PATH, "/changeBankStatus"),
  getOneBankDetails: path(ROOTS_PATH, "/getOneBankDetails"),
};

const TICKET_API_URL = {
  getTicket: path(ROOTS_PATH, "/get_ticket"),
  updateTicket: path(ROOTS_PATH, "/update_status_ticket"),
  sendMessage: path(ROOTS_PATH, "/send_support_message"),
  getMessage: path(ROOTS_PATH, "/get_message"),
};

const COMMISSION_API_URL = {
  getCommission: path(ROOTS_PATH, "/getCommissionRates"),
  addEditCommission: path(ROOTS_PATH, "/addCommissionRate"),
  deleteCommission: path(ROOTS_PATH, "/deleteCommissionRate"),
};

const IMAGE_UPLOAD = {
  uploadImage: path(ROOTS_PATH, "/support-upload"),
};

const TRANSACTION_API_URL = {
  getTransaction: path(ROOTS_PATH, "/getTransaction"),
  getAllTransaction: path(ROOTS_PATH, "/getAllTransaction"),
  viewTransaction: path(ROOTS_PATH, "/viewTransactiondata"),
};

const WITHDRAW_API_URL = {
  getAllWithdraw: path(ROOTS_PATH, "/getAllWithdraw"),
  getPendingWithdraw: path(ROOTS_PATH, "/getPendingWithdraw"),
};

const IFRAME_API_URL = {
  getIframe: path(ROOTS_PATH, "/getIframe"),
  addIframe: path(ROOTS_PATH, "/addIframe"),
  editIframe: path(ROOTS_PATH, "/editIframe"),
  deleteIframe: path(ROOTS_PATH, "/deleteIframe"),
  changeIframePermission: path(ROOTS_PATH, "/changeIframeStatus"),
};

const GET_TRANSACTION_API_URL = {
  getRecentTransactions: path(ROOTS_PATH, "/getRecentTransactions"),
  getTransactionCounts: path(ROOTS_PATH, "/getTransactionCounts"),
};

export {
  AUTH_API_URL,
  TICKET_API_URL,
  IMAGE_UPLOAD,
  DEALER_API_URL,
  MERCHANT_API_URL,
  PAYMENT_API_URL,
  ROLE_PERMISSION_API_URL,
  SUB_ADMIN_API_URL,
  DOMAIN_API_URL,
  IP_ADDRESS_API_URL,
  BUSINESS_TYPE_URL,
  axiosPrivate,
  SYS_CONFIGRATION_URL,
  CURRENCY_API_URL,
  BANK_API_URL,
  COMMISSION_API_URL,
  TRANSACTION_API_URL,
  WITHDRAW_API_URL,
  IFRAME_API_URL,
  GET_TRANSACTION_API_URL
};
