"use client"

import NoSsr from "@/utils/NoSsr";
import "../../src/index.scss";
import MainProvider from "./MainProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import SocketContextProvider from "@/context/socketProvide";
import MiddlewareProvider from "@/context/MiddlewareProvider";
import { authStore } from "@/context/AuthProvider";
import { useEffect } from "react";
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { title } = authStore();

  useEffect(() => {
    document.title = `Admin | ${title || 'Login'}`;
  }, [title]);
  
  return (
    <html>
      <head>
        {/* <title>Admin | {title}</title> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
        {/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAjeJEPREBQFvAIqDSZliF0WjQrCld-Mh0"></script> */}
      </head>
      <body suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <SocketContextProvider>
            <NoSsr>
              <MainProvider>
                <MiddlewareProvider>{children}</MiddlewareProvider>
              </MainProvider>
            </NoSsr>
          </SocketContextProvider>
        </QueryClientProvider>
        <ToastContainer />
      </body>
    </html>
  );
}