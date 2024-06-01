import { SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../PendingWithdrawFilterData";
import { PendingWithdrawalsType } from "@/Types/WithdrawalsType";
import { PendingWithdrawalsTableData } from "@/Data/Application/Withdrawals";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import CustomBottomRightToast from "@/Components/BonusUi/Toast/LiveToast/BottomRightToast/CustomBottomRightToast";
import { authStore } from "@/context/AuthProvider";
import { FaCheck, FaEye, FaTimes, FaTrash } from "react-icons/fa";
import Error403Container from "@/Components/Other/Error/Error403";
import { WITHDRAW_API_URL, axiosPrivate } from "@/security/axios";
import { useQuery } from "react-query";
import moment from "moment-timezone";
import Loader from "../../../../app/loading"
import SVG from "@/CommonComponent/SVG";
import ViewAllWithdraw from "./ViewPendingWithdraw";


const PendingWithdrawalsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [open, setopen] = useState(false);
    const [color, setcolor] = useState("primary");
    const [msg, setmsg] = useState("");
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [viewError, setViewError] = useState(false);
    const [approveError, setApproveError] = useState(false);
    const [rejectError, setRejectError] = useState(false);
    const [currentPage, setCurrentPage]: any = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [Loading, setLoading] = useState(false);
    const [viewWithdraw, setviewWithdraw] = useState<PendingWithdrawalsType>()
    const [viewWithdrawModalOpen, setviewWithdrawModalOpen] = useState(false)
    const [statusData, setStatusData] = useState('');
    const [typeData, setTypeData] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // const filteredItems = PendingWithdrawalsTableData.filter((item: PendingWithdrawalsType) => item.InitiatingUserEntity && item.InitiatingUserEntity.toLowerCase().includes(filterText.toLowerCase()));

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'pending_list': setShowError,
                'pending_view': setViewError,
                'pending_approve': setApproveError,
                'pending_reject': setRejectError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

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

    const getPendingWithdraw: any = useMemo(() => ["getPendingWithdrawApi", currentPage, pageSize, statusData, typeData, fromDate, toDate], [currentPage, pageSize, statusData, typeData, fromDate, toDate]);
    const { data: getPendingWithdrawApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getPendingWithdraw,
        async () => {
            setLoading(true)
            const response = await axiosPrivate.get(
                WITHDRAW_API_URL.getPendingWithdraw,
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

    const handleView = (viewWithdrawData: PendingWithdrawalsType) => {
        setviewWithdraw(viewWithdrawData);
        setviewWithdrawModalOpen(true);
    }


    const PendingWithdrawalsTableAction = ({ data }: { data: PendingWithdrawalsType }) => {
        return (
            <div className="action_btn_list">
                {
                    !viewError &&
                    <Button className="btn_gray" id={`view${data._id}`} onClick={() => handleView(data)}>
                        {/* <VscEye /> */}
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


    const PendingWithdrawalsColumns: TableColumn<PendingWithdrawalsType>[] = [
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
        !viewError || !rejectError || !approveError ? {
            name: "Actions",
            cell: (row) => <PendingWithdrawalsTableAction data={row} />
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
                                                    getPendingWithdrawApi && (
                                                        <DataTable
                                                            data={getPendingWithdrawApi.result}
                                                            columns={PendingWithdrawalsColumns}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
                                                            paginationPerPage={pageSize}
                                                            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                            paginationTotalRows={getPendingWithdrawApi.totalCount}
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

export default PendingWithdrawalsContainer;
