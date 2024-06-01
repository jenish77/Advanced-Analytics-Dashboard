import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Col, Row } from "reactstrap";
import { ShiftsOverviewHeader } from "./DefaultDashboard/ShiftsOverview/ShiftsOverviewHeader";
import { PaymentByGatewayChart, ShiftsOptionChart } from "@/Data/General/Dashboard/DefaultDashboard";
import DashboardCommonHeader from "./common/DashboardCommonHeader";
import { PaymentByGatewayTitle, PaymentGrowthTitle, WithdrawByGatewayTitle } from "@/Constant";

const WithdrawByGateway = () => {
  return (
    <Col lg="4" sm="6" className="proorder-xl-3 proorder-md-3">
      <Card className="shifts-char-box">
        <DashboardCommonHeader title={WithdrawByGatewayTitle} />
        <CardBody>
          <ReactApexChart className="overview" id="shifts-overview" options={PaymentByGatewayChart} series={PaymentByGatewayChart.series} height={280} type="donut" />
        </CardBody>
      </Card>
    </Col>
  );
};

export default WithdrawByGateway;
