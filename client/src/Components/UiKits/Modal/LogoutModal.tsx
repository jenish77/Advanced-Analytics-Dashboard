import { ImagePath, NoLogOut, YesLogOut } from "@/Constant";
import { FC, SetStateAction, useState } from "react";
import { Button, Spinner } from "reactstrap";
import Cookies from "js-cookie";
import CommonModal from "./Common/CommonModal";
import { authStore } from "@/context/AuthProvider";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { AUTH_API_URL } from "@/security/axios";
import { toast } from "react-toastify";

interface LogoutModalProps {
    logoutModalOpen: boolean,
    setlogoutModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const LogoutModal: FC<LogoutModalProps> = ({ logoutModalOpen, setlogoutModalOpen }) => {
    const [loading, setLoading] = useState(false);

    const { removeAdminData } = authStore();
    const toggle = () => setlogoutModalOpen(!logoutModalOpen);
    const axiosPrivate = useAxiosPrivate();

    const LogOutUser = async () => {
        try {

            const response = await axiosPrivate.patch(AUTH_API_URL.logout);
            if (response) {
                Cookies.remove("admin_email");
                removeAdminData();
                window.location.href = "/en/dashboard"
                toast.success("Logout successful");
            }
        } catch (error) {
            console.log({ error });
            toast.error("Logout failed");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <CommonModal centered isOpen={logoutModalOpen} size="md" toggle={toggle}>
            <div className="modal-toggle-wrapper pb-3">
                <div className="modal-toggle-wrapper">
                    <ul className="modal-img" >
                        <li className="text-center" > <img src={`${ImagePath}/gif/logout.gif`} alt="logout" /> </li>
                    </ul>
                    <h2 className="pt-3 text-center pb-2" > You Are leaving ?</h2>
                    <p className="text-center mb-4" > Are you sure ? You Really want to logout this dashboard ? </p>
                    <div className="d-flex justify-content-center gap-4">
                        <Button color="dark" className="d-flex " onClick={LogOutUser} disabled={loading}> {loading ? <Spinner size="sm" /> : YesLogOut} </Button>
                        <Button color="dark" className="d-flex " onClick={toggle}> {NoLogOut} </Button>
                    </div>
                </div>
            </div>
        </CommonModal>

    )
};

export default LogoutModal;