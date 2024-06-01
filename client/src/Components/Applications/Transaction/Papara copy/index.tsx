import { ImagePath, SearchTableButton } from "@/Constant";
import { AllTransactionTableData, ProductListTableData, ProductListTableDataColumn, TransactionTableData } from "@/Data/Application/Ecommerce";
import React, { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Badge, Button, Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import { AllTransactionType, ProductListTableDataColumnType, ProductListTableProduct, TransactionType } from "@/Types/EcommerceType";
import { useAppSelector } from "@/Redux/Hooks";
import Link from "next/link";
import SVG from "@/CommonComponent/SVG";
import RatioImage from "@/CommonComponent/RatioImage";
import { Rating } from "react-simple-star-rating";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { FaBan, FaCheck, FaEye, FaTimes } from "react-icons/fa";
import { MdBlock, MdCheck, MdClose } from "react-icons/md";
import SweetAlert from "sweetalert2";
import { VscEye } from "react-icons/vsc";
import { useQuery } from "react-query";
import { TRANSACTION_API_URL, axiosPrivate } from "@/security/axios";
import { Loader } from "react-feather";
import ViewTransaction from "./ViewTransaction";


const handleReject = () => {
  SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: "You Really want to reject this Transaction", confirmButtonColor: "#7A70BA", showCancelButton: true }).then((result) => {
    if (result.isConfirmed) {
      SweetAlert.fire({ icon: "success", text: "Transaction is Rejected!", confirmButtonColor: "#7A70BA" });
    }
  });
};
const handleApprove = () => {
  SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: "You Really want to Approve this Transaction", confirmButtonColor: "#7A70BA", showCancelButton: true }).then((result) => {
    if (result.isConfirmed) {
      SweetAlert.fire({ icon: "success", text: "Transaction is Approved!", confirmButtonColor: "#7A70BA" });
    }
  });
};




const ProductListTableProductName: React.FC<ProductListTableProduct> = ({ images, name }) => {
  return (
    <div className="product-names my-2">
      <div className="light-product-box bg-img-cover">
        <RatioImage className="img-fluid" src={`${ImagePath}/${images}`} alt="laptop" />
      </div>
      <p>{name}</p>
    </div>
  );
};

const ProductListTableStatus = ({ name, colorStyle }: any) => {
  return <span style={colorStyle}>{name}</span>;
};

const ProductListTableType = ({ name, colorStyle }: any) => {
  return <span style={colorStyle}>{name}</span>;
};

const ProductListTableRating: React.FC<ProductListTableProduct> = ({ rate }) => {
  return <Rating initialValue={rate} size={17} fillColor="#D77748" />;
};



const PaparaContainer = () => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage]: any = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [Loading, setLoading] = useState(false);
  const [viewTransaction, setviewTransaction] = useState<TransactionType>()
  const [viewTransactionModalOpen, setviewTransactionModalOpen] = useState(false)

  const filteredItems = TransactionTableData.filter((item) => item.merchant && item.merchant.toLowerCase().includes(filterText.toLowerCase()));

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="dataTables_filter d-flex align-items-center">
        <Label className="me-2">{SearchTableButton}:</Label>
        <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
      </div>
    );
  }, [filterText]);

  const getTransaction: any = useMemo(() => ["getTransactionApi", currentPage, pageSize], [currentPage, pageSize]);
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
    setviewTransaction(viewTransactionData);
    setviewTransactionModalOpen(true);
  }
  const ProductListTableAction = ({ data }: { data: TransactionType }) => {
    return (
      <div className="action_btn_list">
        <Button className="btn_gray" id={`view${data._id}`} onClick={() => handleView(data)}>
          <FaEye />
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
      selector: (row, index: any) => `${index + 1}`,
      sortable: true,
    },
    {
      name: "Merchant",
      selector: (row) => `${row.merchant_id.first_name} ${row.merchant_id.last_name}`,
      sortable: true,
    },
    {
      name: "Dealer",
      selector: (row) => `${row.dealer_id.first_name} ${row.dealer_id.last_name}`,
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
      name: "Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
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
            statusColorStyle = "badge-secondary";
            break;
          default:
            statusColorStyle = "badge-primary";
            break;
        }
        return <span className={`badge ${statusColorStyle}`}>{row.status == 0 ? "Pending" : row.status == 1 ? "Success" : row.status == 2 ? "Fail" : row.status == 3 ? "Cancel" : "Payment Pending"}</span>;
      }
    },
    {
      name: "Type",
      cell: (row) => {
        const typeColorStyle = row.type === 1 ? "badge-primary"  : "badge-info" ;
        return <span className={`badge ${typeColorStyle}`}>{row.type == 1 ? "Withdraw" : "Deposit"}</span>;
      }
    },    
    {
      name: "Action",
      cell: (row) => <ProductListTableAction data={row} />,
    },
  ];

  useEffect(() => {
    getTransactionApi
  }, [currentPage])

  return (
    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>

              <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center  mb-3 mb-lg-0">
                  <Label className="me-2">{SearchTableButton}:</Label>
                  <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText}
                  />
                </div>
                <div className="list-product-header flex-shrink-0">
                  <FilterHeader />
                </div>
              </div>
              {/* <FilterData /> */}
              {/* <div className="list-product-header">
                      <FilterHeader />
                  </div> */}
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
