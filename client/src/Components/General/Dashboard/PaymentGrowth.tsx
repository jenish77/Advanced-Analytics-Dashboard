import { Card, CardBody, Col } from "reactstrap";
import { PaymentGrowthTitle } from "@/Constant";
import ReactApexChart from "react-apexcharts";
import DashboardCommonHeader from "./common/DashboardCommonHeader";
import { CustomerChartData } from "@/Data/General/Dashboard/DefaultDashboard";

const PaymentGrowth = () => {
  return (
    <Col md="8" className="proorder-md-2">
      <Card className="">
        <DashboardCommonHeader title={PaymentGrowthTitle} />
        <CardBody className="p-0">
          <ReactApexChart id="customer-transaction" options={CustomerChartData} series={CustomerChartData.series} height={310} type="bar" />
        </CardBody>
      </Card>
    </Col>
  );
};

export default PaymentGrowth;
