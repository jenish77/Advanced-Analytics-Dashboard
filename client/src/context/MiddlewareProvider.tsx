"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";
import { authStore } from "./AuthProvider";

const MiddlewareProvider = ({ children }: { children: ReactNode }) => {
  const path = usePathname();

  const route = useRouter();
  const { isAuthenticated } = authStore();
  useLayoutEffect(() => {
    if (path !== "/api-documentation")
      // if (!isAuthenticated) {
      //   route.push("/en/dashboard");
      // }
    if (isAuthenticated && path == '/en/dashboard') {
      route.push("/secureAdmin/dashboard");
    }
  }, [isAuthenticated, path]);

  return <>{children}</>;
};

export default MiddlewareProvider;
