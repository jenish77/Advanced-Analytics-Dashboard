import { authStore } from "@/context/AuthProvider";
import { SocketContext } from "@/context/socketProvide";
import { useContext, useEffect, useState } from "react";

export const MenuList = () => {
  const [permissionData, setPermissionData] = useState<any>([]);
  const { chatClient } = useContext(SocketContext);
  const { setAdminPermissionData, adminData, permission } = authStore();
  const hasSubAdmin = adminData?.hasSubAdmin == 1
  useEffect(() => {
    if (adminData?.hasSubAdmin == 1) {
      const permissions = JSON.parse(localStorage.getItem('auth-storage') ?? 'null')?.state;

      setPermissionData(permissions?.permission);

      const onUpdatePermission = (value: any) => {

        const login_dataa: any = localStorage.getItem('auth-storage');
        let adminDetailsObj = JSON.parse(login_dataa);
        if (value.role_id === adminDetailsObj?.state?.role_id) {
          let curState = adminDetailsObj?.state;
          curState.permission = value.result;
          setPermissionData(value.result);
          setAdminPermissionData(value.result);
        }
      };

      chatClient?.on(`roleHasPermissionUpdateEvent-${permissions?.role_id}`, onUpdatePermission);

      return () => {
        chatClient?.off(`roleHasPermissionUpdateEvent-${permissions?.role_id}`, onUpdatePermission);
      };
    }

  }, [hasSubAdmin, permission]);

  const dealerListPermission = permissionData?.includes('dealer_list') || !hasSubAdmin;
  const merchantListPermission = permissionData?.includes('merchant_list') || !hasSubAdmin;
  const transactionListPermission = permissionData?.includes('transaction_list') || !hasSubAdmin;

  const manageTransactionListPermission = permissionData?.includes('manage_transaction_list') || !hasSubAdmin;
  const withdrawalsListPermission = permissionData?.includes('withdrawals_list') || !hasSubAdmin;
  const pendingListPermission = permissionData?.includes('pending_list') || !hasSubAdmin;

  const bannedCardListPermission = permissionData?.includes('banned_card_list') || !hasSubAdmin;
  const bannedNameListPermission = permissionData?.includes('banned_name_list') || !hasSubAdmin;
  const refundListPermission = permissionData?.includes('refund_list') || !hasSubAdmin;

  const createApiListPermission = permissionData?.includes('create_api_list') || !hasSubAdmin;
  const createIframeListPermission = permissionData?.includes('create_iframe_list') || !hasSubAdmin;


  const methodSettingListPermission = permissionData?.includes('method_setting_list') || !hasSubAdmin;
  const transferSettingListPermission = permissionData?.includes('transfer_setting_list') || !hasSubAdmin;
  const manageBankListPermission = permissionData?.includes('manage_bank_list') || !hasSubAdmin;
  const domainListPermission = permissionData?.includes('domain_list') || !hasSubAdmin;
  const ipListPermission = permissionData?.includes('ip_list') || !hasSubAdmin;
  const manageCurrencyListPermission = permissionData?.includes('manage_currency_list') || !hasSubAdmin;
  const systemConfigurationPermission = permissionData?.includes('system_configuration') || !hasSubAdmin;
  const commissionListPermission = permissionData?.includes('commission_list') || !hasSubAdmin;

  const supportTicketPermission = permissionData?.includes('support_ticket') || !hasSubAdmin;

  const manageNotificationPermission = permissionData?.includes('manage_notification_list') || !hasSubAdmin;

  const rolePermissionListPermission = permissionData?.includes('role_permission_list') || !hasSubAdmin;

  const subAdminListPermission = permissionData?.includes('sub_admin_list') || !hasSubAdmin;

  const iframeListPermission = permissionData?.includes('iframe_list') || !hasSubAdmin;
  const apiListPermission = permissionData?.includes('api_list') || !hasSubAdmin;

  const businessListPermission = permissionData?.includes('business_list') || !hasSubAdmin;

  const menuListData = [
    {
      title: "General",
      lanClass: "lan-1",
      menucontent: "Dashboards,Widgets",
      Items: [
        { path: "/dashboard", icon: "home", title: "Dashboard", type: "link" },
        // ...(businessListPermission ? [{ id: 11, path: "/business_type", icon: "support-tickets", type: "link", active: false, title: "Business Type" }] : []),
        {
          title: "Users",
          id: 1,
          icon: "user",
          type: "sub",
          active: false,
          children: [
            { path: "/users_list/dealer_list" , type: "link", title: "User list" },
           
          ],
        },
       { path: "/transaction/all_transaction", icon: "transaction", title: "Payment list", type: "link" }
        // ...(manageTransactionListPermission ? [{
        //   title: "Manage Transaction",
        //   id: 2,
        //   icon: "manage-transaction",
        //   type: "sub",
        //   active: false,
        //   children: [
        //     { path: "/transaction/withdraw_deposit", title: "Withdraw/deposit", type: "link" },
        //     // { path: "/transaction/credit_card_transaction", title: "CC Transaction", type: "link" },
        //     // { path: "/transaction/debit_card_transaction", title: "DC Transaction", type: "link" },
        //   ]
        // }] : []),
        // ...(withdrawalsListPermission || pendingListPermission ? [{
        //   title: "Manage Withdraws",
        //   id: 3,
        //   icon: "withdraw",
        //   type: "sub",
        //   active: false,
        //   children: [
        //     ...(withdrawalsListPermission ? [{ path: "/withdrawals/all_withdraws", title: "All Withdraws", type: "link" }] : []),
        //     // { path: "/withdrawals/withdrawal_methods", title: "Withdrawal Methods", type: "link" },
        //     ...(pendingListPermission ? [{ path: "/withdrawals/pending_withdraws", title: "Pending Withdraws", type: "link" }] : []),
        //   ]
        // }] : []),
        // ...(bannedCardListPermission || bannedNameListPermission || refundListPermission ? [{

        //   title: "Risk Management",
        //   id: 4,
        //   icon: "risk-management",
        //   type: "sub",
        //   active: false,
        //   children: [
        //     ...(bannedCardListPermission ? [{ path: "/risk_mangement/banned_cards", title: "Banned Cards", type: "link" }] : []),
        //     ...(bannedNameListPermission ? [{ path: "/risk_mangement/banned_names", title: "Banned Names", type: "link" }] : []),
        //     ...(refundListPermission ? [{ path: "/risk_mangement/refunds", title: "Refunds", type: "link" }] : []),
        //   ]
        // }] : []),
        // ...(createApiListPermission || createIframeListPermission ? [{
        //   title: "Manage API",
        //   id: 5,
        //   icon: "api",
        //   type: "sub",
        //   active: false,
        //   children: [
        //     ...(createApiListPermission ? [{ path: "/manage_api/created_API_list", title: "Created API lists", type: "link" }] : []),
        //     ...(createIframeListPermission ? [{ path: "/manage_api/created_IFrame_list", title: "Created Iframe lists", type: "link" }] : []),
        //   ]
        // }] : []),
        // ...(commissionListPermission || systemConfigurationPermission || manageCurrencyListPermission || ipListPermission || domainListPermission || manageBankListPermission || transferSettingListPermission || methodSettingListPermission ? [{
        //   title: "System Settings",
        //   id: 6,
        //   icon: "knowledgebase",
        //   type: "sub",
        //   active: false,
        //   children: [
        //     ...(methodSettingListPermission ? [{ path: "/system_settings/method_settings", title: "Method settings", type: "link" }] : []),
        //     ...(transferSettingListPermission ? [{ path: "/system_settings/transfer_settings", title: "Transfer Settings", type: "link" }] : []),
        //     ...(manageBankListPermission ? [{ path: "/system_settings/manage_banks", title: "Manage Banks", type: "link" }] : []),
        //     ...(domainListPermission ? [{ path: "/system_settings/domain_lists", title: "Domain Lists", type: "link" }] : []),
        //     ...(ipListPermission ? [{ path: "/system_settings/IP_lists", title: "IP Lists", type: "link" }] : []),
        //     ...(manageCurrencyListPermission ? [{ path: "/system_settings/manage_currency", title: "Manage Currency", type: "link" }] : []),
        //     ...(systemConfigurationPermission ? [{ path: "/system_settings/system_configration", title: "System Configuration", type: "link" }] : []),
        //     ...(commissionListPermission ? [{ path: "/system_settings/commission", title: "commission", type: "link" }] : []),
        //   ]
        // }] : []),
        // ...(supportTicketPermission ? [{ id: 7, path: "/contact_support/contact_support_list", icon: "support-tickets", type: "link", active: false, title: "Support Ticket" }] : []),
        // ...(manageNotificationPermission ? [{ id: 8, path: "/manage_notifications/", icon: "notification", title: "Manage notifications", type: "link" }] : []),
        // ...(rolePermissionListPermission || subAdminListPermission ? [{
        //   title: "Manage Sub Admin",
        //   id: 9,
        //   icon: "user",
        //   type: "sub",
        //   active: false,
        //   children: [
        //     ...(rolePermissionListPermission ? [{ path: "/manage_subadmin/roles_permission", type: "link", title: "Roles & Permission" }] : []),
        //     ...(subAdminListPermission ? [{ path: "/manage_subadmin/sub_admin_List", type: "link", title: "Sub admin user list" }] : []),
        //   ],
        // }] : []),
        // ...(iframeListPermission || apiListPermission ? [{
        //   title: "API Demo",
        //   id: 10,
        //   icon: "api",
        //   type: "sub",
        //   active: false,
        //   children: [
        //     ...(iframeListPermission ? [{ path: "/manage_api/created_IFrame_list", type: "link", title: "Iframe Demo" }] : []),
        //     ...(apiListPermission ? [{ path: "/manage_api/created_API_list", type: "link", title: "API Demo" }] : []),
        //   ],
        // }] : []),
      ],
    },
  ];
  // if (hasSubAdmin == false) {
  //   const manageSubAdminIndex = menuListData[0].Items.findIndex(item => item.id === 9);
  //   if (manageSubAdminIndex !== -1) {
  //     menuListData[0].Items.splice(manageSubAdminIndex + 1, 0, {
  //       title: "System Log",
  //       id: 12,
  //       path: "/system_log/system_log_list",
  //       icon: "file",
  //       type: "link",
  //       active: false,
  //     });
  //   }
  // }
  return menuListData
}