import { AllTransactionTableData } from "@/Data/Application/Ecommerce";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Badge, Button, Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import { AllTransactionType } from "@/Types/EcommerceType";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaBan, FaLink } from "react-icons/fa";
import SweetAlert from "sweetalert2";
import Error403Container from "@/Components/Other/Error/Error403";
import { useQuery } from "react-query";
import moment from "moment-timezone";
import Loader from "../../../../app/loading";
import ViewAllTransaction from "./ViewAllTransaction";
import axios from "@/security/axios";

const AllTransactionContainer = () => {

  useEffect(() => {
    const handleKeyDown = (event:any) => {
      if (
        (event.ctrlKey && (event.key === 'a' || event.key === 'c')) ||
        (event.metaKey && (event.key === 'a' || event.key === 'c'))
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


  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage]: any = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [Loading, setLoading] = useState(false);
  const [viewAllTransaction, setviewAllTransaction] = useState<AllTransactionType>();
  const [viewAllTransactionModalOpen, setviewAllTransactionModalOpen] = useState(false);
  const [statusData, setStatusData] = useState('');
  const [typeData, setTypeData] = useState('');
  const [data, setData] = useState<AllTransactionType[]>([]);

  const filteredItems = AllTransactionTableData.filter((item) => item.merchant && item.merchant.toLowerCase().includes(filterText.toLowerCase()));
  const { data: getAllTransactionApi, refetch } = useQuery(
    '',
    async () => {
      setLoading(true);
      const response = await axios.get('user/get-order');
      setData(response.data);
      setLoading(false);
      setCurrentPage(response.data.currentPage);
      return response?.data;
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

  const handleView = (viewAllTransactionData: AllTransactionType) => {
    setviewAllTransaction(viewAllTransactionData);
    setviewAllTransactionModalOpen(true);
  };

  const handleGeneratePaymentLink = async (orderId: string, amount: number) => {
    try {
      const response = await axios.post('http://localhost:7000/user/generate-payment-link', {
        orderId,
        amount
      });
      if (response.data && response.data.paymentLink) {
        const paymentLink = response.data.paymentLink;
        // Display the payment link to the user
        SweetAlert.fire({
          title: 'Payment Link Generated',
          html: `<a href="${paymentLink}" target="_blank">${paymentLink}</a>`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Complete Payment'
        }).then((result) => {
          if (result.isConfirmed) {
            const token = new URL(paymentLink).searchParams.get('token');
            if (token) {
              handleCompletePayment(orderId, token);
            } else {
              SweetAlert.fire('Error', 'Failed to extract token from payment link', 'error');
            }
          }
        });
      } else {
        SweetAlert.fire('Error', 'Failed to generate payment link', 'error');
      }
    } catch (error) {
      SweetAlert.fire('Error', 'Failed to generate payment link', 'error');
    }
  };

  const handleCompletePayment = async (orderId: string, token: string) => {
    try {
      const response = await axios.post('http://localhost:7000/user/complete-payment', {
        token
      });
      if (response.data) {
        // Update the status of the transaction in the state
        setData((prevData) =>
          prevData.map((transaction) =>
            transaction.orderId === orderId ? { ...transaction, status: 'paid' } : transaction
          )
        );
        SweetAlert.fire('Payment Complete', 'The payment has been completed successfully', 'success');
      } else {
        SweetAlert.fire('Error', 'Failed to complete payment', 'error');
      }
    } catch (error) {
      SweetAlert.fire('Error', 'Failed to complete payment', 'error');
    }
  };

  const ProductListTableAction = ({ data }: { data: AllTransactionType }) => {
    return (
      <div className="action_btn_list">
        <Button className="btn_gray" id={`view${data._id}`} onClick={() => handleView(data)}>
          <FaEye size={17} />
          <CommonButtonsToolTip id={`view${data._id}`} toolTipText="View" />
        </Button>
        <Button className="btn_gray" id={`generateLink${data._id}`} onClick={() => handleGeneratePaymentLink(data.orderId, data.totalPrice)}>
          <FaLink size={17} />
          <CommonButtonsToolTip id={`generateLink${data._id}`} toolTipText="Generate Payment Link" />
        </Button>
      </div>
    );
  };

  const ProductListTableDataColumn: TableColumn<AllTransactionType>[] = [
    {
      name: "ID",
      selector: (row, index: any) => `${index + 1}`,
      sortable: false,
      grow: 0,
    },
    {
      name: "Order ID",
      selector: (row: any) => `${row.orderId}`,
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
    },
    {
      name: "Customer Name",
      selector: (row: any) => `${row.customerName}`,
      sortable: true,
    },
    {
      name: "Total Price",
      selector: (row: any) => `${row.totalPrice}`,
      sortable: true,
      grow: 1,
    },
    {
      name: "Order Date",
      selector: (row: any) => `${moment(row.orderDate).format('YYYY-MM-DD hh:mm A')}`,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
        const statusColorStyle = row.status === "Pending" ? "badge-warning" : "badge-success";
        return (
          <span style={{ fontSize: "12px" }} className={`badge ${statusColorStyle}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => <ProductListTableAction data={row} />,
    },
  ];

  useEffect(() => {
    getAllTransactionApi;
  }, [currentPage, pageSize, statusData, typeData]);

  const customStyles = {
    rows: {
      style: {
        minHeight: '62px',
      },
    },
  };

  return (
    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                <div id="row_create_filter" className="dataTables_filter d-flex align-items-center mb-3 gap-4">
                  <div className="custom-search">
                    <Input
                      type="text"
                      placeholder="Search by Merchant"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="list-product">
                <div className="table-responsive">
                  {Loading ? (
                    <Loader />
                  ) : (
                    data && (
                      <DataTable
                        data={data}
                        columns={ProductListTableDataColumn}
                        highlightOnHover
                        striped
                        pagination
                        persistTableHead
                        className="tbl_custome"
                        customStyles={customStyles}
                      />
                    )
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <ViewAllTransaction
        viewAllTransaction={viewAllTransaction}
        viewAllTransactionModalOpen={viewAllTransactionModalOpen}
        setviewAllTransactionModalOpen={setviewAllTransactionModalOpen}
      />
    </Container>
  );
};

export default AllTransactionContainer;
