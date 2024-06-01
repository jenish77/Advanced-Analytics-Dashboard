import { SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaBan, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import { ManageBanksTableData } from "@/Data/Application/SystemSettings";
import { ManageBanksType } from "@/Types/SystemSettings";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import EditBank from "./EditBank";
import AddBank from "./AddBank";
import ViewBank from "./ViewBank";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import { MdDone } from "react-icons/md";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import { useQuery, useQueryClient } from "react-query";
import { BANK_API_URL, axiosPrivate } from "@/security/axios";
import Loader from "../../../../app/loading"
import SVG from "@/CommonComponent/SVG";
import { toast } from "react-toastify";

const ManageBanksContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [addBankModalOpen, setaddBankModalOpen] = useState(false)
    const [editBankModalOpen, seteditBankModalOpen] = useState(false)
    const [viewBankModalOpen, setviewBankModalOpen] = useState(false)
    const [editBank, seteditBank] = useState<ManageBanksType>()
    const [viewBank, setviewBank] = useState<ManageBanksType>()
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [viewError, setViewError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [editError, setEditError] = useState(false);
    const [disableError, setDisableError] = useState(false);
    const [currentPage, setCurrentPage]: any = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [Loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState<string>("");


    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'manage_bank_list': setShowError,
                'manage_bank_create': setCreateError,
                'manage_bank_view': setViewError,
                'manage_bank_edit': setEditError,
                'manage_bank_disable': setDisableError,
                'manage_bank_delete': setDeleteError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    // const filteredItems = ManageBanksTableData.filter((item: ManageBanksType) => item.username && item.username.toLowerCase().includes(filterText.toLowerCase()));

    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);

    const handlePageSizeChange = (newPageSize: any) => {
        setPageSize(newPageSize);
    };

    const getBankList: any = useMemo(() => ["getBankApi", currentPage, pageSize, statusFilter], [currentPage, pageSize, statusFilter]);
    const { data: getBankApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getBankList,
        async () => {
            setLoading(true);
            const response = await axiosPrivate.get(
                BANK_API_URL.getAllBanks,
                {
                    params: {
                        searchText: filterText,
                        page: currentPage,
                        limit: pageSize,
                        status: statusFilter,
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

    const handleDelete = (data: any) => {
        const updatedRow = data;
        if (data.delete_status == false || data.delete_status == true) updatedRow.delete_status = !updatedRow.delete_status;

        SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Bank!",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const requestData = {
                        _id: updatedRow._id,
                        delete_status: updatedRow.delete_status
                    };
                    await axiosPrivate.put(BANK_API_URL.changeBankStatus, requestData);
                    SweetAlert.fire({
                        icon: "success",
                        text: "Bank has been deleted!",
                        confirmButtonColor: "#7A70BA"
                    });
                    queryClient.invalidateQueries('getBankApi');
                } catch (error) {
                    console.error("Error updating delete bank:", error);
                }
            }
        });
    };

    const handleEdit = (editBankData: ManageBanksType) => {
        seteditBank(editBankData);
        seteditBankModalOpen(true);
    }

    const handleView = (viewBankData: ManageBanksType) => {
        setviewBank(viewBankData);
        setviewBankModalOpen(true);
    }

    const updateMethodPermission = async (row: any) => {
        const updatedRow = row.row;
        if (row.active_status == false || row.active_status == true) updatedRow.active_status = !updatedRow.active_status;

        SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Want to change this permission?",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const requestData = {
                        _id: updatedRow._id,
                        active_status: updatedRow.active_status
                    };
                    await axiosPrivate.put(BANK_API_URL.changeBankStatus, requestData);
                    SweetAlert.fire({
                        icon: "success",
                        text: "Permission has been updated!",
                        confirmButtonColor: "#7A70BA"
                    });
                    queryClient.invalidateQueries('getBankApi');
                } catch (error) {
                    const errorData = error?.response?.data?.message;
                    if (errorData) {
                        toast.error(errorData);
                    }
                    if (error?.response.status == 403) {
                        toast.error("Permission Denied");
                    }
                }
            }
        });
    };

    const ManageBanksActions = ({ data }: { data: ManageBanksType }) => {
        return (
            <div className="action_btn_list">
                {!viewError && <Button className="btn_gray" id={`view${data.id}`} onClick={() => handleView(data)}>
                    <FaEye size={17} />
                    <CommonButtonsToolTip
                        id={`view${data.id}`}
                        toolTipText="view"
                    />
                </Button>}
                {!editError && <Button color="secondary" id={`edit${data.id}`} onClick={() => handleEdit(data)}>
                    <FaEdit size={17} />
                    <CommonButtonsToolTip
                        id={`edit${data.id}`}
                        toolTipText="edit"
                    />
                </Button>}
                {!deleteError && <Button color="danger" id={`delete${data.id}`} onClick={() => handleDelete(data)}>
                    <FaTrash size={17} />
                    <CommonButtonsToolTip
                        id={`delete${data.id}`}
                        toolTipText="Delete"
                    />
                </Button>}
            </div >
        )
    }

    const ManageBanksTableColumn: TableColumn<ManageBanksType>[] = [
        {
            name: "User Name",
            cell: (row: { user_name: { first_name: string }; }) => `${row.user_name.first_name}`,
        },
        {
            name: "Balance",
            selector: (row: { balance: number; }) => `${row.balance}`,
            sortable: true
        },
        {
            name: "Company",
            cell: (row: { company_name: string; }) => `${row.company_name}`,
            grow: 2
        },
        {
            name: "Bank Name",
            cell: (row: { bank_name: string; }) => `${row.bank_name}`,
            grow: 2
        },
        {
            name: "Account Owner",
            cell: (row: { account_owner: string; }) => `${row.account_owner}`,
            grow: 2
        },
        {
            name: "Account IBAN",
            cell: (row: { account_IBAN: string; }) => `${row.account_IBAN}`,
            grow: 2
        },
        {
            name: "Limit",
            selector: (row: { limit: number; }) => `${row.limit}`,
            sortable: true
        },
        {
            name: "API",
            cell: (row: { api: string; }) => `${row.api}`,
            grow: 2
        },
        !disableError ? {
            name: "Status",
            cell: (row: { active_status: boolean; _id: string; }) =>
                <CommonSwitch
                    defaultChecked={row.active_status}
                    style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => updateMethodPermission({ active_status: row.active_status, row })}
                />
        } : {},
        {
            name: "Approval Type",
            cell: (row: { approval_type: string; }) => `${row.approval_type}`,
        },

        !viewError || !editError || !deleteError ? {
            name: "Actions",
            cell: (row) => <ManageBanksActions data={row} />,
            grow: 3
        } : {},
    ];

    // Handle status filter change
    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatusFilter(e.target.value);
    };

    // Function to filter data based on status
    const filteredData = useMemo(() => {
        if (!getBankApi) return [];
        if (!statusFilter) return getBankApi.result; // No filter applied, return all data
        return getBankApi.result.filter((item: any) => item.active_status.toString() === statusFilter);
    }, [getBankApi, statusFilter]);

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
                                        <div className="d-flex gap-4 w-100">
                                                <div className="custom-search" style={{ minWidth: "260px" }}>
                                                    <Input placeholder={SearchTableButton} onKeyDown={(ev: any) => {
                                                        if (ev.keyCode == 13) {
                                                            refetch()
                                                        }
                                                    }}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                                                        type="search" value={filterText} className="rounded-end-0" />
                                                    <div className="search-icon" style={{ cursor: "pointer" }} onClick={() => refetch()} >
                                                        <SVG className="search-bg svg-color" iconId="search" />
                                                    </div>
                                                </div>

                                                {/* Input for selecting active status */}
                                                <Input className="form-control" type="select" style={{ maxWidth: "200px" }} value={statusFilter} onChange={handleStatusFilterChange}>
                                                    <option value="">All</option>
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </Input>
                                            </div>
                                            {!createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                {/* <FilterHeader /> */}
                                                <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddBankModalOpen(true)}>
                                                    <i className="fa fa-plus" />
                                                    Add Bank
                                                </div>
                                            </div>}
                                        </div>
                                        {/* <FilterData /> */}
                                        {/* <div className="list-product-header">
                                <FilterHeader />
                                <FilterData />
                            </div> */}
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                {Loading ? (
                                                    <Loader />
                                                ) : (getBankApi && (
                                                    <DataTable
                                                        data={(getBankApi?.result)}
                                                        columns={ManageBanksTableColumn}
                                                        highlightOnHover
                                                        striped
                                                        pagination
                                                        persistTableHead
                                                        paginationPerPage={pageSize}
                                                        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                        paginationTotalRows={getBankApi?.totalCount}
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


                        <AddBank
                            addBankModalOpen={addBankModalOpen}
                            setaddBankModalOpen={setaddBankModalOpen}
                        />
                        <EditBank
                            editBank={editBank}
                            editBankModalOpen={editBankModalOpen}
                            seteditBankModalOpen={seteditBankModalOpen}
                        />
                        <ViewBank
                            viewBank={viewBank}
                            viewBankModalOpen={viewBankModalOpen}
                            setviewBankModalOpen={setviewBankModalOpen}
                        />

                    </Container>
            }
        </>
    );
};

export default ManageBanksContainer;
