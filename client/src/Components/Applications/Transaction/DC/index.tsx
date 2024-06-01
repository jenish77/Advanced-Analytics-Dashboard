import { ImagePath, SearchTableButton } from "@/Constant";
import { AllTransactionTableData, ProductListTableData, ProductListTableDataColumn, TransactionTableData } from "@/Data/Application/Ecommerce";
import React, { useMemo, useState } from "react";
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


const ProductListTableAction = ({ data }: { data: any }) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);

  return (
    // <div className="product-action">
    //   <Link href={`/${i18LangStatus}/ecommerce/add_product`}>
    //     <SVG iconId="edit-content" />
    //   </Link>
    //   <SVG iconId="trash1" />
    // </div>
    <div className="action_btn_list">
      <Button className="btn_gray" id={`view${data.paymentid}`}>
        {/* <VscEye   /> */}
        <FaEye />
        <CommonButtonsToolTip
          id={`view${data.paymentid}`}
          toolTipText="view"
        />
      </Button>
      <Button color="primary" id={`disable${data.paymentid}`}>
        <FaBan />
        <CommonButtonsToolTip
          id={`disable${data.paymentid}`}
          toolTipText="Disable"
        />
      </Button>
      <Button color="success" id={`check${data.paymentid}`} onClick={handleApprove}>
        <FaCheck />
        <CommonButtonsToolTip
          id={`check${data.paymentid}`}
          toolTipText="approve"
        />
      </Button>
      <Button color="danger" id={`reject${data.paymentid}`} onClick={handleReject}>
        <FaTimes />
        <CommonButtonsToolTip
          id={`reject${data.paymentid}`}
          toolTipText="reject"
        />
      </Button>
    </div >
  );
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

const ProductListTableStatus: React.FC<ProductListTableProduct> = ({ name }) => {
  return (
    <Badge color="" className={`p-2 badge-light-${name === "Sold Out" ? "secondary" : "primary"}`}>
      {name}
    </Badge>
  );
};

const ProductListTableRating: React.FC<ProductListTableProduct> = ({ rate }) => {
  return <Rating initialValue={rate} size={17} fillColor="#D77748" />;
};



const DebitContainer = () => {
  const [filterText, setFilterText] = useState("");

  const filteredItems = TransactionTableData.filter((item) => item.merchant && item.merchant.toLowerCase().includes(filterText.toLowerCase()));

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="dataTables_filter d-flex align-items-center">
        <Label className="me-2">{SearchTableButton}:</Label>
        <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
      </div>
    );
  }, [filterText]);

  const ProductListTableDataColumn: TableColumn<any>[] = [
    {
      name: "Payment ID",
      selector: (row) => `${row.paymentid}`,
      sortable: true,
      grow: 2,
    },
    {
      name: "intiatied on",
      selector: (row) => `${row.intiatied}`,
      sortable: true,
    },
    {
      name: "By Merchant",
      selector: (row) => `${row.merchant}`,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `${row.amount}`,
      sortable: true,
    },
    {
      name: "Transaction ID",
      selector: (row) => `${row.transactionid}`,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => <ProductListTableStatus name={row.status} />,
    },
    {
      name: "Action",
      cell: (row) => <ProductListTableAction data={row} />,
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>

              <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center mb-3 mb-lg-0">
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
                  <DataTable className="theme-scrollbar tbl_custome" persistTableHead data={filteredItems} columns={ProductListTableDataColumn} striped highlightOnHover pagination />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DebitContainer;
