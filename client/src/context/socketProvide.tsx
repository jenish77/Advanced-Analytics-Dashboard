"use client";
import socketio from "socket.io-client";
import React, { createContext, useEffect, useState } from "react";
import { authStore } from '@/context/AuthProvider'
import { AUTH_API_URL, axiosPrivate } from "@/security/axios";
import Cookies from "js-cookie";

interface SocketContextProps {
    chatClient: any;
    hanldeRolePermission: (data: any) => void;
    hanldeRoleStatusUpdate: (data: any) => void;
    hanldeAdminStatusUpdate: (data: any) => void;
    joinSupportChat: (data: any) => void;
    connected: any;
    hanldeSendMessage: (data: any) => void;
}
export const SocketContext = createContext<SocketContextProps>({
    chatClient: null,
    connected: false,
    hanldeRolePermission: () => { },
    hanldeRoleStatusUpdate: () => { },
    hanldeAdminStatusUpdate: () => { },
    joinSupportChat: () => { },
    hanldeSendMessage: () => { },
});


const SocketContextProvider = ({ children }: any) => {
    const { adminData, role_id, removeAdminData } = authStore();
    const SocketURL: any = process.env.NEXT_PUBLIC_SOCKET_URL;
    const [connected, setConnected] = useState<boolean>(false);
    const [chatClient, setChatClient] = useState<any>(null);

    // set connection
    useEffect(() => {
        if (adminData && adminData?.id) {
            const { id, hasSubAdmin } = adminData
            //0 for Super_Admin 1 for Sub_Admin
            const initChat = () => {
                const client: any = socketio(SocketURL, {
                    query: {
                        userId: id,
                        userType: hasSubAdmin
                    },
                    transports: ["websocket"],
                    upgrade: true,
                    reconnection: false,
                    autoConnect: false,
                    forceNew: true,
                });
                if (!client.connected) {
                    client.connect();
                }
                setChatClient(client)

                client.on('connect', function () {
                    setConnected(true);
                });

                client.on('disconnect', function (reason: any) {
                    if (reason === "io server disconnect") {
                        client.connect();
                    }
                });

                client.connect();

            };
            initChat();
            return () => {
                if (chatClient) {
                    chatClient.off("connect");
                    chatClient.off("disconnect");
                }
            }
        }
    }, [adminData])

    const joinSupportChat = (supportId: any) => {
        chatClient.emit('join_support_chat', { supportId: supportId }, function (reason: any) {
            console.log('Maintenance mode activated successfully');
        });
    }

    const hanldeRolePermission = (rowId: string) => {
        chatClient.emit('role_permission_update', { role_id: rowId }, function (reason: any) {
            console.log('Maintenance mode activated successfully');
        });
    }

    const hanldeSendMessage = (data: string) => {

        chatClient.emit('support_send_message', data, function (reason: any) {
            console.log('support_send_message');
        });
    }

    useEffect(() => {
        if (connected && role_id) {
            chatClient.on('roleHasPermissionStatusUpdateEvent-' + role_id, function (reason: any) {
                if (reason.result && reason.role_id == role_id) {
                    LogOutUser()
                }
            });
            chatClient.on('subAdminUpdateEvent', function (reason: any) {
                if (reason.result) {
                    LogOutUser()
                }
            });
        }        
        if (connected) {
            chatClient.on('join_support_chat', function (reason: any) {
                if (reason.result) {
                    console.log('Message get successfully');
                }
            });
        }
   
    }, [connected])

    const hanldeRoleStatusUpdate = (rowId: string) => {
        chatClient.emit('role_permission_status_update', { role_id: rowId }, function (reason: any) {
            console.log('Status update successfully');
        });
    }

    const hanldeAdminStatusUpdate = (rowId: string) => {
        chatClient.emit('admin_status_update', { role_id: rowId }, function (reason: any) {
            console.log('Admin Status update successfully');
        });
    }

    const LogOutUser = async () => {
        try {

            const response = await axiosPrivate.patch(AUTH_API_URL.logout);
            if (response) {
                Cookies.remove("admin_email");
                removeAdminData();
                window.location.href = "/en/dashboard"
            }
        } catch (error) {
            console.log({ error })
        }
    };

    return (
        <SocketContext.Provider value={{
            chatClient,
            hanldeRolePermission,
            hanldeRoleStatusUpdate,
            hanldeAdminStatusUpdate,
            joinSupportChat,
            hanldeSendMessage,
            connected
        }}>
            {children}
        </SocketContext.Provider>
    );

};

export default SocketContextProvider;
