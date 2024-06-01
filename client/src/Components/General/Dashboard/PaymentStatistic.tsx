import { Card, CardBody, Col } from "reactstrap";
import { PaymentStatisticTitle } from "@/Constant";
import ReactApexChart from "react-apexcharts";
import { RevenueChartData } from "@/Data/General/Dashboard/Ecommerce";
import DashboardCommonHeader from "./common/DashboardCommonHeader";

const RevenueByCategory = () => {
  return (
    <Col md="4" className="mb-4">
      <Card className="h-100">
        <DashboardCommonHeader title={PaymentStatisticTitle} />
        <CardBody className="revenue-category">
          <div className="donut-legend d-flex justify-content-center align-items-center h-100" id="legend">
            <ReactApexChart id="chart" options={RevenueChartData} series={RevenueChartData.series} type="pie" height={240} />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RevenueByCategory;