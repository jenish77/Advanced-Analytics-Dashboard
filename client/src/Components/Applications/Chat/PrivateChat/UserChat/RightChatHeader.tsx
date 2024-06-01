import { ImagePath } from "@/Constant";
import { authStore } from "@/context/AuthProvider";
import { useAppSelector } from "@/Redux/Hooks";
import { Button } from "reactstrap";
import { useRouter } from "next/navigation";

const RightChatHeader = () => {
  const { ticketData: selectedUser, setTicketData } = authStore();
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const route = useRouter();

  const back = () => {
    setTicketData("")
    route.push(`/${i18LangStatus}/contact_support/contact_support_list`);

  }
  return (
    <div className="right-sidebar-title">
      <div className="common-space">
        <div className="chat-time w-100">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="support-message">
              <h6 className="mb-2">
                <span className="text">
                  <b>{selectedUser ? selectedUser?.fullName : "Unknown"}</b>
                </span>
              </h6>
              <h6><span className="text">{selectedUser.message}</span></h6>
            </div>
            <Button color="primary" className="plus-popup" onClick={() => back()} >Back</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightChatHeader;
