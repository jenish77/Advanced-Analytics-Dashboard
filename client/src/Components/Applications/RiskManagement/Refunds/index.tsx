import { ImagePath, RowCreateCallBackSpan, SearchTableButton } from "@/Constant";
import { ProductListTableDataColumn } from "@/Data/Application/Ecommerce";
import { RowCreateCallData, RowCreateCallList, RowCreateCallColumn } from "@/Data/Form&Table/Table/DataTable/RowCreateCallbackData";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { DealerType } from "@/Types/UserListType";
import { VscCheck, VscChromeClose, VscEye } from "react-icons/vsc";
import { FaCheck, FaEdit, FaEye, FaTimes, FaTrash } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import LargeModal from "@/Components/UiKits/Modal/SizesModal/LargeModal";
import { MethodSettingsType } from "@/Types/SystemSettings";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import { RefundsListTableData } from "@/Data/Application/RiskManagement";
import { RefundType } from "@/Types/RiskManagementType";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { Check, X } from "react-feather";
import CustomBottomRightToast from "@/Components/BonusUi/Toast/LiveToast/BottomRightToast/CustomBottomRightToast";
import { MdCheck, MdClose } from "react-icons/md";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";


const RefundsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [open, setopen] = useState(false);
    const [color, setcolor] = useState("primary");
    const [msg, setmsg] = useState("");
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [viewError, setViewError] = useState(false);
    const [approveError, setApproveError] = useState(false);
    const [rejectError, setRejectError] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'refund_list': setShowError,
                'refund_view': setViewError,
                'refund_approve': setApproveError,
                'refund_reject': setRejectError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);


    const filteredItems = RefundsListTableData.filter((item: RefundType) => item.userName && item.userName.toLowerCase().includes(filterText.toLowerCase()));


    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);



    const handleApprove = () => {
        setmsg("Refund Approved")
        setcolor("success")
        setopen(true)
    };
    const handleReject = () => {
        setmsg("Refund Rejected")
        setcolor("danger")
        setopen(true)
    };


    const RefundsListActions = ({ data }: { data: any }) => {
        return (
            // <ul className="action simple-list d-flex w-100 justify-content-center gap-2 gap-md-3 align-items-center">
            //     <li className="view text-primary">

            //         <VscEye id={`view${data.id}`} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            //         <CommonButtonsToolTip
            //             id={`view${data.id}`}
            //             toolTipText="view"
            //         />
            //     </li>
            //     <li className="approve text-success" onClick={handleApprove}>
            //         <Check id={`check${data.id}`} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            //         <CommonButtonsToolTip
            //             id={`check${data.id}`}
            //             toolTipText="approve"
            //         />
            //     </li>
            //     <li className="reject text-danger" onClick={handleReject}>
            //         <X id={`reject${data.id}`} className="text-danger" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            //         <CommonButtonsToolTip
            //             id={`reject${data.id}`}
            //             toolTipText="reject"
            //         />
            //     </li>
            // </ul>
            <div className="action_btn_list">
                {
                    !viewError &&
                    <Button className="btn_gray" id={`view${data.WithdrawalID}`}>
                        {/* <VscEye /> */}
                        <FaEye size={17} />
                        <CommonButtonsToolTip
                            id={`view${data.WithdrawalID}`}
                            toolTipText="view"
                        />
                    </Button>
                }
                {
                    !rejectError &&

                    <Button color="success" id={`check${data.WithdrawalID}`} onClick={handleApprove}>
                        <FaCheck size={17} />
                        <CommonButtonsToolTip
                            id={`check${data.WithdrawalID}`}
                            toolTipText="approve"
                        />
                    </Button>
                }
                {
                    !approveError &&
                    <Button color="danger" id={`reject${data.WithdrawalID}`} onClick={handleReject}>
                        <FaTimes size={17} />
                        <CommonButtonsToolTip
                            id={`reject${data.WithdrawalID}`}
                            toolTipText="reject"
                        />
                    </Button>
                }
            </div >
        )
    }


    const RefundTableStatus = ({ status }: { status: string }) => {
        return (

            <div className="status-box">
                <Button style={{ width: "90px" }} className={`ps-2 pe-2 ${status === "Completed" ? "background-light-success font-success" : "background-light-warning font-warning"} f-w-500`} color="transparent">{status}</Button>
            </div>
        )
    }


    const RefundsListTableColumn: TableColumn<RefundType>[] = [
        {
            name: "ID",
            cell: (row: { id: string; }) => `${row.id}`,
        },
        {
            name: "User Name",
            cell: (row: { userName: string; }) => `${row.userName}`,
        },
        {
            name: "Transaction Id",
            cell: (row: { originalTransactionId: string; }) => `${row.originalTransactionId}`,
        },
        {
            name: "Original Amount",
            selector: (row: { originalTransactionAmount: number; }) => `${row.originalTransactionAmount}`,
            sortable: true
        },
        {
            name: "Refund Amount",
            selector: (row: { refundAmount: number; }) => `${row.refundAmount}`,
            sortable: true
        },
        {
            name: "Gateway",
            cell: (row: { gateway: string; }) => `${row.gateway}`,
        },
        {
            name: "Refund Reason",
            cell: (row: { refundReason: string; }) => `${row.refundReason}`,
            grow: 2
        },
        {
            name: "Status",
            cell: (row: { refundStatus: any; }) =>
                <RefundTableStatus status={row.refundStatus} />,
        },
        {
            name: "Refund Date",
            selector: (row: { refundDate: any; }) => `${row.refundDate}`,
            sortable: true
        },
        !viewError || !rejectError || !approveError ? {
            name: "Actions",
            cell: (row) =>
                <RefundsListActions data={row} />,
        } : {},
    ];


    return (
        <>
            {
                showError ?
                    <Error403Container />
                    :
                    <Container fluid>
                        <Row>
                            <Col sm="12">
                                <Card>
                                    <CardHeader className="pb-0 card-no-border">
                                        {/* <h4>Dealer List</h4> */}
                                    </CardHeader>
                                    <CardBody>
                                        <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                                            <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center  mb-3 mb-lg-0">
                                                <Label className="me-2">{SearchTableButton}:</Label>
                                                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText}
                                                />
                                            </div>
                                            <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                <FilterHeader />
                                            </div>
                                        </div>
                                        <FilterData />
                                        {/* <div className="list-product-header">
                                <FilterHeader />
                                <FilterData />
                            </div> */}
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                <DataTable data={filteredItems} persistTableHead columns={RefundsListTableColumn} highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
                                                    rows: {
                                                        style: {
                                                            paddingTop: '15px',
                                                            paddingBottom: '15px',
                                                        }
                                                    }
                                                }} />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <CustomBottomRightToast
                            msg={msg}
                            open={open}
                            setopen={setopen}
                            color={color}
                        />
                    </Container>
            }
        </>
    );
};

export default RefundsContainer;
