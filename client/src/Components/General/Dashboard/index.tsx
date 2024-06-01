import React from "react";
import { Container, Row } from "reactstrap";
import TotalOverView from "./TotalOverView";
import PaymentGrowth from "./PaymentGrowth";
import PaymentStatistic from "./PaymentStatistic";
import PaymentByGateway from "./PaymentByGateway";
import WithdrawByGateway from "./WithdrawByGateway";
import UserInfoWelcome from "./UserInfoWelcome";
import RecentPayments from "./RecentPaymentTable/RecentPayments";
import AffiliateOverview from "./AffiliateOverview";

const ProjectContainer = () => {
  return (
    <Container fluid className="dashboard-2 default-dashboard">
      <Row className="mb-4 gy-4">
        <UserInfoWelcome />
        <TotalOverView />
      </Row>
      <Row>
        <PaymentGrowth />
        <PaymentStatistic />
      </Row>
      <Row>
        <AffiliateOverview />
        <PaymentByGateway />
        <WithdrawByGateway />
      </Row>
      <Row>
        <RecentPayments />
      </Row>
    </Container>
  );
};

export default ProjectContainer;
