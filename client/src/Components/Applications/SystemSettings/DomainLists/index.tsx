import { SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaBan, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import { DomainListType } from "@/Types/SystemSettings";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import { MdDone } from "react-icons/md";
import EditDomain from "./EditDomain";
import AddDomain from "./AddDomain";
import { useQuery, useQueryClient } from "react-query";
import { DOMAIN_API_URL, axiosPrivate } from "@/security/axios";
import moment from "moment";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import Loader from "../../../../app/loading"
import SVG from "@/CommonComponent/SVG";
import { toast } from "react-toastify";
import ViewDomain from "./ViewDomain";

const DomainListsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [addDomainModalOpen, setaddDomainModalOpen] = useState(false)
    const [editDomainModalOpen, seteditDomainModalOpen] = useState(false)
    const [viewDomainModalOpen, setviewDomainModalOpen] = useState(false)
    const [editDomain, seteditDomain] = useState<DomainListType>()
    const [viewDomain, setviewDomain] = useState<DomainListType>()
    const [currentPage, setCurrentPage]: any = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const queryClient = useQueryClient();


    const handlePageSizeChange = (newPageSize: any) => {
        setPageSize(newPageSize);
    };
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [viewError, setViewError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [editError, setEditError] = useState(false);
    const [disableError, setDisableError] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("");


    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'domain_list': setShowError,
                'domain_create': setCreateError,
                'domain_view': setViewError,
                'domain_edit': setEditError,
                'domain_disable': setDisableError,
                'domain_delete': setDeleteError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    const getDomainList: any = useMemo(() => ["getDomainApi", currentPage, pageSize, statusFilter], [currentPage, pageSize, statusFilter]);
    const { data: getDomainApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getDomainList,
        async () => {
            setLoading(true);
            const response = await axiosPrivate.get(
                DOMAIN_API_URL.getDomain,
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

    const handleDelete = async (data: any) => {
        SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Domain!",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosPrivate.delete(`${DOMAIN_API_URL.deleteDomain}?_id=${data._id}`);
                    if (response.status === 200) {
                        SweetAlert.fire({
                            icon: "success",
                            text: "Domain has been deleted!",
                            confirmButtonColor: "#7A70BA"
                        });
                    }
                    queryClient.invalidateQueries('getDomainApi')
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

    const handleEdit = (editDomain: DomainListType) => {
        seteditDomain(editDomain);
        seteditDomainModalOpen(true)
    }

    const handleView = (viewDomain: DomainListType) => {
        setviewDomain(viewDomain);
        setviewDomainModalOpen(true)
    }

    const updateDomainStatus = async (row: any) => {
        const updatedRow = row.row;
        if (row.status == false || row.status == true) updatedRow.status = !updatedRow.status;

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
                        status: updatedRow.status
                    };
                    await axiosPrivate.put(DOMAIN_API_URL.changeDomainStatus, requestData);
                    SweetAlert.fire({
                        icon: "success",
                        text: "Status has been updated!",
                        confirmButtonColor: "#7A70BA"
                    });
                    queryClient.invalidateQueries('getDomainApi');
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

    const DomainListActions = ({ data }: { data: DomainListType }) => {
        return (
            <div className="action_btn_list">
                {/* {!viewError && <Button className="btn_gray" id={`view${data.id}`}>
                    <FaEye />
                    <CommonButtonsToolTip
                        id={`view${data.id}`}
                        toolTipText="view"
                    />
                </Button>} */}
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

                {/* {!disableError && <Button color="primary" id={`disable${data.id}`}>
                    {data.status ? <MdDone /> : <FaBan />}
                    <CommonButtonsToolTip
                        id={`disable${data.id}`}
                        toolTipText="Disable"
                    />
                </Button>} */}
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


    const DomainListsTableColumn: TableColumn<DomainListType>[] = [
        {
            name: "ID",
            cell: (row: { domain_id: string; }) => `${row.domain_id}`,
        },
        {
            name: "Domain Name",
            cell: (row: { domain_name: string; }) => `${row.domain_name}`,
        },
        {
            name: "Merchant Name",
            cell: (row: { merchant: { name: string }; }) => `${row.merchant.name}`,
        },
        {
            name: "Date time",
            cell: (row: { createdAt: string; }) => `${moment(row.createdAt).format("DD-MM-YYYY hh:mm A")}`,
        },
        !disableError ? {
            name: "Status",
            cell: (row: { status: boolean; _id: string; }) =>
                <CommonSwitch
                    defaultChecked={row.status}
                    style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => updateDomainStatus({ status: row.status, row })}
                />
        } : {},
        !viewError || !editError || !deleteError ? {

            name: "Actions",
            cell: (row) => <DomainListActions data={row} />,
        } : {},
    ];

    // Handle status filter change
    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatusFilter(e.target.value);
    };

    // Function to filter data based on status
    const filteredData = useMemo(() => {
        if (!getDomainApi) return [];
        if (!statusFilter) return getDomainApi.result; // No filter applied, return all data
        return getDomainApi.result.filter((item: any) => item.status.toString() === statusFilter);
    }, [getDomainApi, statusFilter]);
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
                                                <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddDomainModalOpen(true)}>
                                                    <i className="fa fa-plus" />
                                                    Add Domain
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
                                                ) : (
                                                    getDomainApi && (
                                                        <DataTable
                                                            data={(getDomainApi?.result)}
                                                            columns={DomainListsTableColumn}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
                                                            paginationPerPage={pageSize}
                                                            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                            paginationTotalRows={getDomainApi?.totalCount}
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


                        <AddDomain
                            addDomainModalOpen={addDomainModalOpen}
                            setaddDomainModalOpen={setaddDomainModalOpen}
                        />
                        <EditDomain
                            editDomain={editDomain}
                            editDomainModalOpen={editDomainModalOpen}
                            seteditDomainModalOpen={seteditDomainModalOpen}
                        />
                        <ViewDomain
                            viewDomain={viewDomain}
                            viewDomainModalOpen={viewDomainModalOpen}
                            setviewDomainModalOpen={setviewDomainModalOpen}
                        />
                    </Container>
            }
        </>
    );
};

export default DomainListsContainer;
