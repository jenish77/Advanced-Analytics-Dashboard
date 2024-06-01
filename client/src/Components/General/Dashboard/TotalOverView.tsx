import React from 'react';
import { ImagePath, OverView } from "@/Constant";
import { ProjectStatusData } from "@/Data/General/Dashboard/Project";
import { Card, CardBody, Col, Row } from "reactstrap";
import DashboardCommonHeader from "./common/DashboardCommonHeader";
import { useQuery } from "react-query";
import { GET_TRANSACTION_API_URL, axiosPrivate } from "@/security/axios";

const TotalOverView = () => {

  // const { data: getTransactionCountApi, isLoading, isError, error, refetch } = useQuery(
  //   ["getTransactionCountApi"],
  //   async () => {
  //     const response = await axiosPrivate.get(GET_TRANSACTION_API_URL.getTransactionCounts);
      
  //     return response?.data;
  //   },
  //   {
  //     enabled: true,
  //     refetchOnWindowFocus: false,
  //     retry: false,
  //   }
  // );

  // Function to find the detail value from getTransactionCountApi
  // const getDetailValue = (transactionType: any) => {
  //   if (!getTransactionCountApi) return 0; 

  //   switch(transactionType) {
  //     case 'totaldeposit':
  //       return getTransactionCountApi.totalDeposits;
  //     case 'pendingdeposit':
  //       return getTransactionCountApi.pendingDeposits;
  //     case 'completeddeposit':
  //       return getTransactionCountApi.successDeposits;
  //     case 'totalwithdraw':
  //       return getTransactionCountApi.totalWithdraws;
  //     case 'pendingwithdraw':
  //       return getTransactionCountApi.pendingWithdraws;
  //     case 'completedwithdraw':
  //       return getTransactionCountApi.successWithdraws;
  //     default:
  //       return 0;
  //   }
  // };

 
  return (
    <Col lg="7" className="">
      <Card className="mb-0 h-100">
        <DashboardCommonHeader title={OverView} />
        <CardBody className="">
          <Row className="g-3 h-100">
            {ProjectStatusData.map((data, index) => {
              // Find the corresponding detail value from getTransactionCountApi
              // const detailValue = getDetailValue(data.title.toLowerCase().replace(/\s+/g, ''));
              
              return (
                <Col sm="4" xs="6" key={index}>
                  <div className={`btn-light1-${data.color} b-r-10 h-100`}>
                    <div className={`upcoming-box p-sm-3 p-2 py-4 d-flex align-items-center flex-sm-row flex-column h-100 gap-xxl-3 gap-2 mb-0 ${data.className? data.className : ""}`}>
                      <div className={`upcoming-icon flex-shrink-0 m-0 bg-${data.color}`}>
                        <img src={`${ImagePath}/dashboard-2/svg-icon/${data.image}`} alt="icons" />
                      </div>
                      <div className="text-sm-start">
                        <h6 className="mb-1">{data.title}</h6>
                        {/* <p>{detailValue}</p> */}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TotalOverView;

