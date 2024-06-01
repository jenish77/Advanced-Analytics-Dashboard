"use client";

import { authStore } from "@/context/AuthProvider";
import { useEffect } from "react";
import { axiosPrivate, ROLE_PERMISSION_API_URL } from "./axios";
import Security from "./Security";

const useAxiosPrivate = () => {
  const { isAuthenticated, sessionId, privateKey, removeAdminData, setAdminPermissionData, accessToken, refreshToken, isRefreshing, setIsRefreshing, role_id } = authStore();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (isAuthenticated) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          config.headers["session"] = sessionId;
        }
        // config.headers["env"] = "test";
        if (config.method !== "get" && config.data && !config.data._encrypted &&  config.headers['Content-Type'] !== "multipart/form-data") {
          if (isAuthenticated) {
            const encryptedData = new Security().encryptUserData(config.data);
            config.data = encryptedData;
            config.data._encrypted = true;
          } else {
            config.data = new Security().encryptPublicData(config.data);
            config.data._encrypted = true;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      function (response) {
        if (response?.data?.mac !== undefined) {
          if (isAuthenticated && !response?.config?.url.includes("logout")) {
            const { secret, mac, value } = response.data
            const decryptedData = new Security().decryptUserData(secret, mac, value, privateKey);
            response.data = decryptedData;
          } else {
            const { secret, mac, value } = response.data
            const decryptedData = new Security().decryptPublicData(secret, mac, value);
            response.data = decryptedData;
          }
        }
        return response;
      },
      async function (error) {
        const prevRequest = error?.config;
        if (error?.response?.status === 401) {
          if (!isRefreshing) {
            try {
              setIsRefreshing(true);
              removeAdminData();
              window.location.href = "/en/dashboard"
            } catch (error) {
            } finally {
              setIsRefreshing(false);
            }
          }
        }
        if (error?.response?.status === 403) {
          try {
            const response = await axiosPrivate.post(ROLE_PERMISSION_API_URL.getPermissionList, { role_id: role_id });
            if (response.data) {
              setAdminPermissionData(response.data)
            }

          } catch (error) {
          } finally {
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken, isAuthenticated, privateKey, isRefreshing]);

  return axiosPrivate;
};

export default useAxiosPrivate;
