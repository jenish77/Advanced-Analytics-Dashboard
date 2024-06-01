import { Row } from "reactstrap";
import { MobileView } from "./MobileView";
import { BreadCrumbs } from "./BreadCrumbs";
import { PageHeader } from "./PageHeader";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { headerResponsive } from "@/Redux/Reducers/LayoutSlice";
import { usePathname } from "next/navigation";
import { setFilterClose } from "@/Redux/Reducers/ProductSlice";
import { ROLE_PERMISSION_API_URL } from "@/security/axios";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { authStore } from "@/context/AuthProvider";
import { useQuery } from "react-query";

export const Header = () => {
  const { toggleSidebar } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const pathame = usePathname()

  useEffect(() => {
    dispatch(headerResponsive());
  }, []);

  useEffect(() => {
    dispatch(setFilterClose())
  }, [pathame])

  const axiosPrivate = useAxiosPrivate();
  const { setAdminPermissionData, role_id } = authStore();
  
  const {
    data,
    isFetching,
    refetch,
  } = useQuery(
    ["getPermissionList"], // Query keys
    async () => {
      if(role_id){
        const response = await axiosPrivate.post(ROLE_PERMISSION_API_URL.getPermissionList, { role_id: role_id });
        console.log(response.data);
        
        setAdminPermissionData(response.data);
      }
    },
    {
      enabled: !!role_id, // Only enable when role_id is truthy
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  
  return (
    <Row className={`page-header ${toggleSidebar ? "close_icon" : ""}`} id="page-header">
      <MobileView />
      <BreadCrumbs />
      <PageHeader />
    </Row>
  );
};
