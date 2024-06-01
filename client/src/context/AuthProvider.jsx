import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
// import { createStore, useStore } from 'zustand'
import Cookies from "js-cookie";

const middleware_ = (f) =>
  create(
    devtools(
      persist(f, {
        name: "auth-storage",
        // storage: createJSONStorage(() => localStorage),
      })
    )
  );

const authStore = middleware_((set, get) => ({
  isAuthenticated: false,
  isRefreshing: false,
  accessToken: "",
  refreshToken: "",
  privateKey: "",
  adminData: "",
  permission: "",
  secret: "",
  role_id: '',
  isMaintenanceMode: "",
  ticketData: "",
  title: "",
  setAccessToken: (data) => set({ accessToken: data }),
  setIsRefreshing: (data) => set({ isRefreshing: data }),
  setAdminData: async (data) => {
    try {
      set({
        accessToken: data?.accessToken,
        role_id: data?.roleId,
        refreshToken: data?.refreshToken,
        adminData: data?.admindata,
        privateKey: data?.privateKey,
        permission: data?.permission,
        isAuthenticated: true,
        secret: data?.secret,
      });
      setCookie('accessToken', data?.accessToken);
      setCookie('refreshToken', data?.refreshToken);
    } catch (error) { }
  },
  updateAdminProfile: (data) => {
    set({
      adminData: data,
    });
  },
  updatePageTitle: (data) => {
    set({
      title: data,
    });
  },
  removeAdminData: async () => {
    try {
      set({
        accessToken: "",
        refreshToken: "",
        adminData: "",
        permission: "",
        privateKey: "",
        role_id: "",
        secret: "",
        isAuthenticated: false,
        ticketData: "",
        title:"Login"
      });
      Cookies.remove("admin_email");
    } catch (error) {
    }
  },
  setAdminPermissionData: async (data) => {
    try {
      set({permission: data});
    } catch (error) { }
  },
  setTicketData: async (data) => {
    try {
      set({ticketData: data});
    } catch (error) { }
  },
  setState: set,
  getState: get,
}));

export { authStore };
