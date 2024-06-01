import { authStore } from "@/context/AuthProvider";
import LogoutModal from "@/Components/UiKits/Modal/LogoutModal";
import { Href, ImagePath, Logout } from "@/Constant";
import { UserProfileData } from "@/Data/Layout";
import { useAppSelector } from "@/Redux/Hooks";
import { AUTH_API_URL } from "@/security/axios";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut } from "react-feather";

export const Profile = () => {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const axiosPrivate = useAxiosPrivate();
  const {adminData} = authStore();

  const [logoutModalOpen, setlogoutModalOpen] = useState(false)
  const [data, setData]: any = useState('')
  const updatedData: any = localStorage.getItem('auth-storage');
  const datas = JSON.parse(updatedData)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosPrivate.get(AUTH_API_URL.getProfile);
  //       setData(response.data)
  //     } catch (error) {
  //       console.error('Error fetching profile:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  const truncateString = (str:any, num:any) => {
    if(str){
      return str.length > num ? str.slice(0, num) + '...' : str;
    }else{
      return ''
    }
  }
  return (
    <>
      <li className="profile-nav onhover-dropdown px-0 py-0">
        <div className="d-flex profile-media align-items-center">
          <img className="img-30" src={`${ImagePath}/dashboard/profile_dummy.jpg`} alt="" />
          <div className="flex-grow-1">
            <span>{adminData?.hasSubAdmin === 0 ? "Super Admin" : "Sub Admin"}</span>
            <p className="mb-0 font-outfit">
            {truncateString(datas?.state?.adminData?.fullName,20)}<i className="fa fa-angle-down"></i>
            {/* {adminData?.hasSubAdmin==0?"Super Admin":"Sub Admin"}<i className="fa fa-angle-down"></i> */}
            </p>
          </div>
        </div>
        <ul className="profile-dropdown onhover-show-div">
          {UserProfileData.map((item, index) => (
            <li key={index}>
              <Link  className="d-flex align-items-center" style={{lineHeight:1}} href={`/${i18LangStatus}/${item.link}`}>{item.icon}<span>{item.title} </span></Link>
            </li>
          ))}
          <li onClick={()=>setlogoutModalOpen(true)}><Link href={Href} scroll={false} ><LogOut /><span>{Logout} </span></Link></li>
        </ul>
      </li>
      <LogoutModal
        logoutModalOpen={logoutModalOpen}
        setlogoutModalOpen={setlogoutModalOpen}
      />
    </>
  );
};
