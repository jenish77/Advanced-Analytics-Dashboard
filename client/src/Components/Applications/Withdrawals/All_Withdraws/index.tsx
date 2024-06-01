import { SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, CloseButton, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import { AllWithdrawalsType } from "@/Types/WithdrawalsType";
import { AllwithdrawalsTableData } from "@/Data/Application/Withdrawals";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import moment from "moment-timezone";
import { WITHDRAW_API_URL, axiosPrivate } from "@/security/axios";
import { useQuery } from "react-query";
import SVG from "@/CommonComponent/SVG";
import Loader from "../../../../app/loading"
import ViewAllWithdraw from "./ViewAllWithdraw";

const AllWithdrawalsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [viewError, setViewError] = useState(false);
    const [approveError, setApproveError] = useState(false);
    const [rejectError, setRejectError] = useState(false);
    const [currentPage, setCurrentPage]: any = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [Loading, setLoading] = useState(false);
    const [viewWithdraw, setviewWithdraw] = useState<AllWithdrawalsType>()
    const [viewWithdrawModalOpen, setviewWithdrawModalOpen] = useState(false)
    const [statusData, setStatusData] = useState('');
    const [typeData, setTypeData] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'withdrawals_list': setShowError,
                'withdrawals_view': setViewError,
                'withdrawals_approve': setApproveError,
                'withdrawals_reject': setRejectError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    // const filteredItems = AllwithdrawalsTableData.filter((item: AllWithdrawalsType) => item.UserName && item.UserName.toLowerCase().includes(filterText.toLowerCase()));


    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);


    const AllWithdrawalsTableStatus = ({ status }: { status: string }) => {
        return (

            <div className="status-box">
                <Button style={{ width: "80px" }} className={`ps-2 pe-2 ${status === "Accepted" ? "background-light-success font-success" : status === "Pending" ? "background-light-warning font-warning" : "background-light-danger font-danger"} f-w-500`} color="transparent">{status}</Button>
            </div>
        )
    }

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

    const getAllWithdraw: any = useMemo(() => ["getAllWithdrawApi", currentPage, pageSize, statusData, typeData, fromDate, toDate], [currentPage, pageSize, statusData, typeData, fromDate, toDate]);
    const { data: getAllWithdrawApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getAllWithdraw,
        async () => {
            setLoading(true)
            const response = await axiosPrivate.get(
                WITHDRAW_API_URL.getAllWithdraw,
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

    const handleView = (viewWithdrawData: AllWithdrawalsType) => {
        setviewWithdraw(viewWithdrawData);
        setviewWithdrawModalOpen(true);
    }

    const AllWithdrawalsTableAction = ({ data }: { data: AllWithdrawalsType }) => {
        return (
            <div className="action_btn_list">
                {
                    !viewError &&
                    <Button className="btn_gray" id={`view${data._id}`} onClick={() => handleView(data)}>
                        <FaEye size={17} />
                        <CommonButtonsToolTip
                            id={`view${data._id}`}
                            toolTipText="view"
                        />
                    </Button>
                }
                {/* {
                    !rejectError &&

                    <Button color="success" id={`check${data.WithdrawalID}`} onClick={handleApprove}>
                        <FaCheck />
                        <CommonButtonsToolTip
                            id={`check${data.WithdrawalID}`}
                            toolTipText="approve"
                        />
                    </Button>
                }
                {
                    !approveError &&
                    <Button color="danger" id={`reject${data.WithdrawalID}`} onClick={handleReject}>
                        <FaTimes />
                        <CommonButtonsToolTip
                            id={`reject${data.WithdrawalID}`}
                            toolTipText="reject"
                        />
                    </Button>
                } */}
            </div >
        )
    }

    const AllWithDrawalsTableColumn: TableColumn<AllWithdrawalsType>[] = [
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
            selector: (row) => `${moment(row.createdAt).format('YYYY-MM-DD hh:mm A')}`,
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
                return <span style={{ fontSize: "12px" }} className={`badge ${statusColorStyle}`}>{row.status == 0 ? "Pending" : row.status == 1 ? "Success" : row.status == 2 ? "Fail" : row.status == 3 ? "Cancel" : "Payment Pending"}</span>;
            }
        },
        !viewError || !rejectError || !approveError ? {
            name: "Actions",
            cell: (row) => <AllWithdrawalsTableAction data={row} />
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
                                            <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center mb-3 gap-4">
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
                                                <FilterData setStatusData={setStatusData} setTypeData={setTypeData} setFromDate={setFromDate} setToDate={setToDate} />
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
                                                    getAllWithdrawApi && (
                                                        <DataTable
                                                            data={getAllWithdrawApi.result}
                                                            columns={AllWithDrawalsTableColumn}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
                                                            paginationPerPage={pageSize}
                                                            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                            paginationTotalRows={getAllWithdrawApi.totalCount}
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
                        <ViewAllWithdraw
                            viewWithdraw={viewWithdraw}
                            viewWithdrawModalOpen={viewWithdrawModalOpen}
                            setviewWithdrawModalOpen={setviewWithdrawModalOpen}
                        />
                    </Container>
            }
        </>

    );
};

export default AllWithdrawalsContainer;
