import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Table } from "reactstrap";
import { useQuery } from "react-query";
import axios from "@/security/axios";
import Loader from "../../../../app/loading";
import PaginationDynamic from "@/utils/Paginations";
import DashboardCommonHeader from "../common/DashboardCommonHeader";
import { RecentPaymentsTableHead } from "./RecentPaymentsTableHead";
import RecentPaymentsTableBody from './RecentPaymentsTableBody';
import { RecentPaymentTitle } from "@/Constant";

const RecentPayments = () => {

  useEffect(() => {
    const handleKeyDown = (event:any) => {
      if (
        (event.ctrlKey && (event.key === 'a' || event.key === 'c')) ||
        (event.metaKey && (event.key === 'a' || event.key === 'c')) ||
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && event.key === 'I')
      ) {
        event.preventDefault();
      }
    };

    const disableContextMenu = (event:any) => {
      event.preventDefault();
    };

    const disableDragStart = (event:any) => {
      event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('dragstart', disableDragStart);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('dragstart', disableDragStart);
    };
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPage] = useState(1);
  const [Loading, setLoading] = useState(false);

  const { data: getTransactionApi, refetch } = useQuery(
    ["getTransactionApi", currentPage, pageSize],
    async () => {
      setLoading(true);
      const response = await axios.get('user/get-transaction', {
        params: {
          page: currentPage,
          limit: pageSize,
        }
      });
      setLoading(false);
      setCurrentPage(response.data.currentPage);
      setTotalPage(response.data.totalPages);
      return response?.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, refetch]);

  const currentItems = useMemo(() => {
    return getTransactionApi ?? [];
  }, [getTransactionApi]);

  return (
    <Col className="proorder-xl-5 box-col-7 proorder-md-5">
      <Card>
        <DashboardCommonHeader title={RecentPaymentTitle} dropDownFalse={true} />
        <hr />
        <CardBody className="pt-0 projects px-0">
          <div className="dataTables_wrapper">
            <div className="table-responsive theme-scrollbar">
              {Loading ? (
                <Loader />
              ) : (
                <Table className="display w-100 top-border dataTable text-nowrap" id="selling-product">
                  <RecentPaymentsTableHead />
                  <RecentPaymentsTableBody currentItems={currentItems} />
                </Table>
              )}
            </div>
            {/* <PaginationDynamic totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} /> */}
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RecentPayments;
