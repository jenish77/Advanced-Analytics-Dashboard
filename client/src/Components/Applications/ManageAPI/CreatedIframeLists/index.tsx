import { SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import LargeModal from "@/Components/UiKits/Modal/SizesModal/LargeModal";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { CreatedIFrameListsType } from "@/Types/ManageApiType";
import { CreatedIframeListsData } from "@/Data/Application/ManageAPI";
import SweetAlert from "sweetalert2";
import CreateIframe from "./CreateIframe";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import moment from "moment-timezone";
import { IFRAME_API_URL, axiosPrivate } from "@/security/axios";
import { useQuery, useQueryClient } from "react-query";
import Loader from "../../../../app/loading"
import { toast } from "react-toastify";
import SVG from "@/CommonComponent/SVG";
import EditIframe from "./EditIframe";

const CreatedIFrameListsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [createIframeModalOpen, setcreateIframeModalOpen] = useState(false);
    const [editIframeModalOpen, seteditIframeModalOpen] = useState(false)
    const [editIframe, seteditIframe] = useState<CreatedIFrameListsType>()
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [viewError, setViewError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [currentPage, setCurrentPage]: any = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [Loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'create_iframe_list': setShowError,
                'create_iframe_view': setViewError,
                'create_iframe_create': setCreateError,
                'create_iframe_delete': setDeleteError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    // const filteredItems = CreatedIframeListsData.filter((item: CreatedIFrameListsType) => item.username && item.username.toLowerCase().includes(filterText.toLowerCase()));

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

    const handleDelete = async (data: any) => {
        SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Iframe!",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosPrivate.delete(`${IFRAME_API_URL.deleteIframe}?_id=${data._id}`);
                    if (response.status === 200) {
                        SweetAlert.fire({
                            icon: "success",
                            text: "Iframe has been deleted!",
                            confirmButtonColor: "#7A70BA"
                        });
                    }
                    queryClient.invalidateQueries('getIframeApi')
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

    const handleEdit = (editIframeData: CreatedIFrameListsType) => {
        seteditIframe(editIframeData);
        seteditIframeModalOpen(true)
    }

    const handleView = (viewMethodData: CreatedIFrameListsType) => {
        // setviewMethod(viewMethodData);
        // setviewMethodModalOpen(true);
    }

    const getIframe: any = useMemo(() => ["getIframeApi", currentPage, pageSize], [currentPage, pageSize]);
    const { data: getIframeApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getIframe,
        async () => {
            setLoading(true)
            const response = await axiosPrivate.get(
                IFRAME_API_URL.getIframe,
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

    const updateIframeStatus = async (row: any) => {
        const updatedRow = row.row;
        if (row.status == false || row.status == true) updatedRow.status = !updatedRow.status;

        SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Want to change this status?",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const requestData = {
                        _id: updatedRow._id,
                        status: updatedRow.status
                    };
                    await axiosPrivate.put(IFRAME_API_URL.changeIframePermission, requestData);
                    SweetAlert.fire({
                        icon: "success",
                        text: "Status has been updated!",
                        confirmButtonColor: "#7A70BA"
                    });
                    queryClient.invalidateQueries('getIframeApi');
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

    const CreatedIFrameListActions = ({ data }: { data: CreatedIFrameListsType }) => {
        return (
            <div className="action_btn_list">
                <Button className="btn_gray" id={`view${data.id}`} onClick={() => handleView(data)}>
                    <FaEye size={17} />
                    <CommonButtonsToolTip
                        id={`view${data.id}`}
                        toolTipText="view"
                    />
                </Button>
                <Button color="secondary" id={`edit${data.id}`} onClick={() => handleEdit(data)}>
                    <FaEdit size={17} />
                    <CommonButtonsToolTip
                        id={`edit${data.id}`}
                        toolTipText="edit"
                    />
                </Button>
                <Button color="danger" id={`delete${data.id}`} onClick={() => handleDelete(data)}>
                    <FaTrash size={17} />
                    <CommonButtonsToolTip
                        id={`delete${data.id}`}
                        toolTipText="Delete"
                    />
                </Button>
            </div >
        )
    }

    const CreatedIFrameListsTableColumn: TableColumn<CreatedIFrameListsType>[] = [
        {
            name: "ID",
            cell: (row: { id: string; }, index: number) => `${index + 1}`,
        },
        {
            name: "User ID",
            cell: (row: { user_id: string; }) => `${row.user_id}`,
        },
        {
            name: "User Name",
            cell: (row: { user_name: string; }) => `${row.user_name}`,
        },
        {
            name: "IFrame Name",
            cell: (row: { iframe_name: string; }) => `${row.iframe_name}`,
        },
        {
            name: "URL",
            cell: (row: { url: string; }) => `${row.url}`,
            grow: 2
        },
        {
            name: "Method",
            cell: (row: { method: { name: string }; }) => `${row.method.name}`,
        },
        {
            name: "Status",
            cell: (row: { status: boolean; _id: string; }) =>
                <CommonSwitch
                    defaultChecked={row.status}
                    style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => updateIframeStatus({ status: row.status, row })}
                />
        },
        {
            name: "Created On",
            cell: (row: { createdAt: string; }) => `${moment(row.createdAt).format("DD-MM-YYYY hh:mm A")}`,
            grow: 2
        },
        !deleteError || !viewError ? {

            name: "Actions",
            cell: (row) => <CreatedIFrameListActions data={row} />
        } : {}
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
                                            </div>
                                            {!createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                {/* <FilterHeader /> */}
                                                <div className="btn btn-primary pt-2 pb-2"
                                                    onClick={() => setcreateIframeModalOpen(!createIframeModalOpen)}
                                                >
                                                    <i className="fa fa-plus" />
                                                    Create IFrame
                                                </div>
                                            </div>}
                                        </div>
                                        {/* <FilterData /> */}

                                        <div className="list-product">
                                            <div className="table-responsive">
                                                {Loading ? (
                                                    <Loader />
                                                ) : (
                                                    getIframeApi && (
                                                        <DataTable
                                                            data={getIframeApi.result}
                                                            columns={CreatedIFrameListsTableColumn}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
                                                            paginationPerPage={pageSize}
                                                            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                            paginationTotalRows={getIframeApi.totalCount}
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
                        <CreateIframe
                            createIframeModalOpen={createIframeModalOpen}
                            setcreateIframeModalOpen={setcreateIframeModalOpen}
                        />
                        <EditIframe
                            editIframe={editIframe}
                            editIframeModalOpen={editIframeModalOpen}
                            seteditIframeModalOpen={seteditIframeModalOpen}
                        />
                    </Container>
            }
        </>
    );
};

export default CreatedIFrameListsContainer;
