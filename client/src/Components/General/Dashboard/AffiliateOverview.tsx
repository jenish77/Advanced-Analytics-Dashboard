import { AffiliateOverViewTitle, ImagePath, OverView } from "@/Constant";
import { AffiliateOverviewData, ProjectStatusData } from "@/Data/General/Dashboard/Project";
import { Card, CardBody, Col, Row } from "reactstrap";
import DashboardCommonHeader from "./common/DashboardCommonHeader";

const AffiliateOverview = () => {
  return (
    <Col lg="4" className="">
      <Card className="">
        <DashboardCommonHeader title={AffiliateOverViewTitle} />
        <CardBody className="">
          <Row className="g-3 h-100">
            {AffiliateOverviewData.map((data, index) => (
              <Col xs="12" key={index} className="mt-2">
                <div className={`btn-light1-${data.color} b-r-10 h-100`}>
                  <div className={`upcoming-box p-sm-3 p-2 py-4 d-flex align-items-center flex-sm-row flex-column h-100 gap-xxl-3 gap-2 mb-0 ${data.className ? data.className : ""}`}>
                    <div className={`upcoming-icon flex-shrink-0 m-0 bg-${data.color}`}>
                      <img src={`${ImagePath}/dashboard-2/svg-icon/${data.image}`} alt="icons" />
                    </div>
                    <div className="text-sm-start">
                      <h6 className="mb-1">{data.title}</h6>
                      <p>{data.detail}</p>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AffiliateOverview;
