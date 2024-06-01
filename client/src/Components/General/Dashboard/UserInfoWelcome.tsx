import { Card, CardBody, Col } from "reactstrap";
import { GoPremium, GoodDayLenaMiller } from "@/Constant";
import Link from "next/link";
import { useAppSelector } from "@/Redux/Hooks";

const data: any = localStorage.getItem("auth-storage");
const adminData = JSON.parse(data);
const name = adminData?.state?.adminData?.fullName;

const UserInfoWelcome = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);

  return (
    <Col lg="5" className="">
      <Card className="profile-greeting p-0 mb-0 h-100    ">
        <CardBody>
          <div className="img-overlay">
            <h1 className="mt-0">Good Day, {name}</h1>
            {/* <p>Welcome to the Payment Hub! We are delighted that you have visited our dashboard.</p> */}
            {/* <Link className="btn" href={`/${i18LangStatus}/dashboard/default_dashboard`}>{GoPremium}</Link> */}
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default UserInfoWelcome;
