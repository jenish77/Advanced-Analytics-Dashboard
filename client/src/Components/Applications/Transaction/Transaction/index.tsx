import { SearchTableButton } from "@/Constant";
import React, { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import { TransactionType } from "@/Types/EcommerceType";
import SVG from "@/CommonComponent/SVG";
import { FilterData } from "../FilterData";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { FaEye } from "react-icons/fa";
import { useQuery } from "react-query";
import { TRANSACTION_API_URL, axiosPrivate } from "@/security/axios";
import Loader from "../../../../app/loading"
import ViewTransaction from "./ViewTransaction";
import moment from "moment-timezone";

const PaparaContainer = () => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage]: any = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [Loading, setLoading] = useState(false);
  const [viewTransaction, setviewTransaction] = useState<TransactionType>()
  const [viewTransactionModalOpen, setviewTransactionModalOpen] = useState(false)
  const [statusData, setStatusData] = useState('');
  const [typeData, setTypeData] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const getTransaction: any = useMemo(() => ["getTransactionApi", currentPage, pageSize, statusData, typeData, fromDate, toDate], [currentPage, pageSize, statusData, typeData, fromDate, toDate]);
  const { data: getTransactionApi, isFetching: isLoadingProfile, refetch } = useQuery(
    getTransaction,
    async () => {
      setLoading(true)
      const response = await axiosPrivate.get(
        TRANSACTION_API_URL.getTransaction,
        {
          params: {
            searchText: filterText,
            page: currentPage,
            limit: pageSize,
            status: statusData,
            type: typeData,
            fromDate: fromDate,
            toDate: toDate
          }
        }
      );
      setLoading(false);
      setCurrentPage(response.data.currentPage)
      return response?.data
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const handlePageSizeChange = (newPageSize: any) => {
    setPageSize(newPageSize);
  };

  const handleView = (viewTransactionData: TransactionType) => {
    // console.log(viewTransactionData, 'viewTransactionData');

    setviewTransaction(viewTransactionData);
    setviewTransactionModalOpen(true);
  }
  const ProductListTableAction = ({ data }: { data: TransactionType }) => {
    return (
      <div className="action_btn_list">
        <Button className="btn_gray" id={`view${data._id}`} onClick={() => handleView(data)}>
          <FaEye size={17} />
          <CommonButtonsToolTip
            id={`view${data._id}`}
            toolTipText="view"
          />
        </Button>
      </div >
    );
  };

  const ProductListTableDataColumn: TableColumn<TransactionType>[] = [
    {
      name: "ID",
      selector: (row: any, index: any) => `${(currentPage - 1) * 10 + index + 1}`,
      sortable: true,
      grow: 0
    },
    {
      name: "Merchant",
      selector: (row) => `${row.merchant_id.first_name} ${row.merchant_id.last_name}`,
      minWidth: "200px",
      maxWidth: "200px",
    },
    {
      name: "Dealer",
      selector: (row) => `${row.dealer_id.first_name} ${row.dealer_id.last_name}`,
      sortable: true,
    },
    {
      name: "Main Amount",
      selector: (row) => `${row.main_amount}`,
      sortable: true,
    },
    {
      name: "Final Amount",
      selector: (row) => `${row.final_amount}`,
      sortable: true,
    },
    {
      name: "Currency",
      selector: (row) => `${row.currency.currency_name}`,
      sortable: true,
    },
    {
      name: "Transaction Id",
      selector: (row) => `${row.transaction_id}`,
      sortable: true,
    },
    {
      name: "Created Date",
      cell: (row) => {
        return <div>{moment(row.createdAt).format('YYYY-MM-DD hh:mm A')}</div>
      },
    },
    {
      name: "Status",
      cell: (row) => {
        let statusColorStyle;
        switch (row.status) {
          case 0:
            statusColorStyle = "badge-warning";
            break;
          case 1:
            statusColorStyle = "badge-success";
            break;
          case 2:
            statusColorStyle = "badge-danger";
            break;
          case 3:
            statusColorStyle = "badge-cancel";
            break;
          default:
            statusColorStyle = "badge-primary";
            break;
        }
        return (
          <span style={{ fontSize: "12px" }} className={`badge ${statusColorStyle}`}>
            {row.status === 0 ? "Pending" :
              row.status === 1 ? "Success" :
                row.status === 2 ? "Fail" :
                  row.status === 3 ? "Cancel" :
                    "Payment Pending"}
          </span>
        );
      }
    },
    {
      name: "Type",
      cell: (row) => {
        const typeColorStyle = row.type === 1 ? "badge-light" : "badge-info";
        return <span style={{ fontSize: "12px" }} className={`badge ${typeColorStyle}`}>{row.type == 1 ? "Withdraw" : "Deposit"}</span>;
      }
    },
    {
      name: "Action",
      cell: (row) => <ProductListTableAction data={row} />,
    },
  ];

  useEffect(() => {
    getTransactionApi
  }, [currentPage, pageSize, statusData, typeData])

  return (
    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>

              <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                <div id="row_create_filter" className="dataTables_filter d-flex align-items-center mb-3 gap-4">
                  <div className="custom-search">
                    <Input placeholder={SearchTableButton} onKeyDown={(ev: any) => {
                      if (ev.keyCode == 13) {
                        refetch()
                      }
                    }
                    } onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText}
                      className="rounded-end-0"
                    />
                    <div className="search-icon" style={{ cursor: "pointer" }} onClick={() => refetch()} >
                      <SVG className="search-bg svg-color" iconId="search" />
                    </div>
                  </div>
                  <FilterData setStatusData={setStatusData} setTypeData={setTypeData} setFromDate={setFromDate} setToDate={setToDate}/>
                </div>
                {/* <div className="list-product-header flex-shrink-0">
                  <FilterHeader />
                </div> */}
              </div>
              <div className="list-product">
                <div className="table-responsive">
                  {Loading ? (
                    <Loader />
                  ) : (
                    getTransactionApi && (
                      <DataTable
                        data={getTransactionApi.result}
                        columns={ProductListTableDataColumn}
                        highlightOnHover
                        striped
                        pagination
                        persistTableHead
                        paginationPerPage={pageSize}
                        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                        paginationTotalRows={getTransactionApi.totalCount}
                        onChangePage={page => setCurrentPage(page)}
                        onChangeRowsPerPage={handlePageSizeChange}
                        paginationServer
                        paginationDefaultPage={currentPage}
                        className="tbl_custome"
                      />
                    )
                  )}

                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ViewTransaction
        viewTransaction={viewTransaction}
        viewTransactionModalOpen={viewTransactionModalOpen}
        setviewTransactionModalOpen={setviewTransactionModalOpen}
      />

    </Container>
  );
};

export default PaparaContainer;
