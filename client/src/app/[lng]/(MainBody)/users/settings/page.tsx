import React from "react";
import { Container, Row } from "reactstrap";
import TwoFactorAuthentication from "./TwoFactorAuthentication";

const TwoFactorContainer = () => {
  return (
    <Container fluid>
      <Row>
        <TwoFactorAuthentication />
      </Row>
    </Container>
  );
};

export default TwoFactorContainer;
