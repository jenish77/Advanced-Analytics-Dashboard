import { ImagePath, RowCreateCallBackSpan, SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import { MethodSettingsType } from "@/Types/SystemSettings";
import AddMethod from "./AddMethod";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import EditMethod from "./EditMethod";
import { PAYMENT_API_URL, axiosPrivate } from "@/security/axios";
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import Loader from "../../../../app/loading"
import SVG from "@/CommonComponent/SVG";
import { toast } from "react-toastify";
import ViewMethod from "./ViewMethod";

const MethodSettingsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [addMethodModalOpen, setaddMethodModalOpen] = useState(false)
    const [editMethodModalOpen, seteditMethodModalOpen] = useState(false)
    const [editMethod, seteditMethod] = useState<MethodSettingsType>()
    const [currentPage, setCurrentPage]: any = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [copy, setCopy] = useState<{ id: string | null, type: string | null }>({ id: null, type: null });
    const queryClient = useQueryClient();
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [statusError, setStatusError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [editError, setEditError] = useState(false);
    const [depositError, setDepositError] = useState(false);
    const [withdrawError, setWithdrawError] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [viewMethod, setviewMethod] = useState<MethodSettingsType>()
    const [viewMethodModalOpen, setviewMethodModalOpen] = useState(false)

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'method_setting_list': setShowError,
                'method_setting_status': setStatusError,
                'method_setting_create': setCreateError,
                'method_setting_delete': setDeleteError,
                'method_setting_edit': setEditError,
                'method_setting_deposit': setDepositError,
                'method_setting_withdraw': setWithdrawError,
                'method_setting_iframe': setIframeError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    const handlePageSizeChange = (newPageSize: any) => {
        setPageSize(newPageSize);
    };

    const handleDelete = async (data: any) => {
        SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Method!",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosPrivate.delete(`${PAYMENT_API_URL.deleteMethod}?_id=${data._id}`);
                    if (response.status === 200) {
                        SweetAlert.fire({
                            icon: "success",
                            text: "Method has been deleted!",
                            confirmButtonColor: "#7A70BA"
                        });
                    }
                    queryClient.invalidateQueries('getAllMethodsApi')
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

    const handleEdit = (editMethodData: MethodSettingsType) => {
        seteditMethod(editMethodData);
        seteditMethodModalOpen(true)
    }

    const handleView = (viewMethodData: MethodSettingsType) => {
        setviewMethod(viewMethodData);
        setviewMethodModalOpen(true);
    }

    const MethodListActions = ({ data }: { data: MethodSettingsType }) => {
        return (
            <div className="action_btn_list">
                <Button className="btn_gray" id={`view${data.id}`} onClick={() => handleView(data)}>
                    <FaEye size={17} />
                    <CommonButtonsToolTip
                        id={`view${data.id}`}
                        toolTipText="view"
                    />
                </Button>
                {
                    !editError &&
                    <Button color="secondary" id={`edit${data.id}`} onClick={() => handleEdit(data)}>
                        <FaEdit size={17} />
                        <CommonButtonsToolTip
                            id={`edit${data.id}`}
                            toolTipText="edit"
                        />
                    </Button>
                }
                {
                    !deleteError &&
                    <Button color="danger" id={`delete${data.id}`} onClick={() => handleDelete(data)}>
                        <FaTrash size={17} />
                        <CommonButtonsToolTip
                            id={`delete${data.id}`}
                            toolTipText="Delete"
                        />
                    </Button>
                }
            </div >
        )
    }

    const getAllMethods: any = useMemo(() => ["getAllMethodsApi", currentPage, pageSize], [currentPage, pageSize]);
    const { data: getAllMethodsApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getAllMethods,
        async () => {
            setLoading(true)
            const response = await axiosPrivate.get(
                PAYMENT_API_URL.getAllMethods,
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

    const updateMethodPermission = async (row: any) => {
        const updatedRow = row.row;
        if (row.deposit == false || row.deposit == true) updatedRow.deposit = !updatedRow.deposit;
        if (row.withdraw == false || row.withdraw == true) updatedRow.withdraw = !updatedRow.withdraw;
        if (row.iFrame_access == false || row.iFrame_access == true) updatedRow.iFrame_access = !updatedRow.iFrame_access;
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
                        deposit: updatedRow.deposit,
                        withdraw: updatedRow.withdraw,
                        iFrame_access: updatedRow.iFrame_access,
                        active_status: updatedRow.active_status
                    };
                    const respose = await axiosPrivate.put(PAYMENT_API_URL.changeMethodPermission, requestData);
                    if (respose.status == 200) {

                        SweetAlert.fire({
                            icon: "success",
                            text: "Permission has been updated!",
                            confirmButtonColor: "#7A70BA"
                        });
                        queryClient.invalidateQueries('getAllMethodsApi');
                    }
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

    const handleCopy = (text: string, id: string, type: string) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopy({ id, type });
        setTimeout(() => {
            setCopy({ id: null, type: null });
        }, 2000);
    };
    
    const MethodSettingsListTableColumn: TableColumn<MethodSettingsType>[] = [
        {
            name: "Method ID",
            cell: (row: { method_id: string; }) => `${row.method_id}`,
            grow: 3,
        },
        {
            name: "Image",
            cell: (row) =>
                <div>                    
                    <img
                        className="img-fluid"
                        src={`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE}/methodImg/${row?.image}`}
                        alt={row.image}
                        height={'40px'}
                        width={'40px'}
                        onError={(e: any) => {
                            e.target.src = '/assets/images/logo.png';
                        }}
                        style={{ height: '40px', width: '40px' }}
                         />
                </div>
        },
        {
            name: "Name",
            cell: (row: { gateway_name: string; }) => `${row.gateway_name}`,
            grow: 2
        },
        // {
        //     name: "API Key",
        //     grow: 5,
        //     minWidth: '200px',
        //     maxWidth: '200px',
        //     cell: (row: { api_key: string; _id: string; }) =>
        //         <div className="class_key position-relative">
        //             <p className="mb-0">{row.api_key}</p>
        //             <Button className="btn-copy" onClick={() => handleCopy(row.api_key, row._id, 'api_key')}><i className="fa fa-copy" /></Button>
        //             {copy.id === row._id && copy.type === 'api_key' &&
        //                 <div className="copy_label">
        //                     Copied
        //                 </div>
        //             }
        //         </div>
        // },
        // {
        //     name: "Secret Key",
        //     grow: 5,
        //     minWidth: '200px',
        //     maxWidth: '200px',
        //     cell: (row: { secret_key: string; _id: string; }) =>
        //         <div className="class_key position-relative">
        //             <p className="mb-0">{row.secret_key}</p>
        //             <Button className="btn-copy" onClick={() => handleCopy(row.secret_key, row._id, 'secret_key')}><i className="fa fa-copy" /></Button>
        //             {copy.id === row._id && copy.type === 'secret_key' &&
        //                 <div className="copy_label">
        //                     Copied
        //                 </div>
        //             }
        //         </div>
        // },
        !depositError ? {
            name: "Deposit",
            cell: (row: { deposit: boolean; _id: string; }) =>
                <CommonSwitch
                    defaultChecked={row.deposit}
                    style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => updateMethodPermission({ deposit: row.deposit, row })}
                />
        } : {},
        !withdrawError ? {
            name: "Withdraw",
            cell: (row: { withdraw: boolean; _id: string; }) =>
                <CommonSwitch
                    defaultChecked={row.withdraw}
                    style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => updateMethodPermission({ withdraw: row.withdraw, row })}
                />
        } : {},
        !iframeError ? {
            name: "API access",
            cell: (row: { iFrame_access: boolean; _id: string; }) =>
                <CommonSwitch
                    defaultChecked={row.iFrame_access}
                    style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => updateMethodPermission({ iFrame_access: row.iFrame_access, row })}
                />
        } : {},
        {
            name: "MIN Transaction",
            cell: (row: { min_transaction: number; }) => `${row.min_transaction}`,
        },
        {
            name: "MAX Transaction",
            cell: (row: { max_transaction: number; }) => `${row.max_transaction}`,
        },
        {
            name: "Auto Reject Minimum",
            cell: (row: { auto_reject: number; }) => `${row.auto_reject}`,
        },
        !statusError ? {
            name: "Status",
            cell: (row: { active_status: boolean; _id: string; }) =>
                <CommonSwitch
                    defaultChecked={row.active_status}
                    style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => updateMethodPermission({ active_status: row.active_status, row })}
                />
        } : {},
        !editError || !deleteError ? {
            name: "Actions",
            cell: (row) => <MethodListActions data={row} />,
            grow: 2
        } : {},
    ];

    const handleSearch = () => {
        queryClient.fetchQuery(['getAllMethodsApi', filterText, currentPage, pageSize]);
    };

    useEffect(() => {
        getAllMethodsApi
    }, [currentPage])

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
                                    {/* <CardHeader className="pb-0 card-no-border">
                                        <h4>Payment Gateway</h4>
                                    </CardHeader>
                                    <hr /> */}
                                    <CardBody>
                                        <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                                            <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center mb-3 mb-lg-0">
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
                                            </div>
                                            {!createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddMethodModalOpen(true)}>
                                                    <i className="fa fa-plus" />
                                                    Add Method
                                                </div>
                                            </div>}
                                        </div>
                                        <FilterData />
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                {Loading ? (
                                                    <Loader />
                                                ) : (
                                                    getAllMethodsApi && (
                                                        <DataTable
                                                            data={getAllMethodsApi.result}
                                                            columns={MethodSettingsListTableColumn}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
                                                            paginationPerPage={pageSize}
                                                            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                            paginationTotalRows={getAllMethodsApi.totalCount}
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

                        <AddMethod
                            addMethodModalOpen={addMethodModalOpen}
                            setaddMethodModalOpen={setaddMethodModalOpen}
                        />
                        <EditMethod
                            editMethod={editMethod}
                            editMethodModalOpen={editMethodModalOpen}
                            seteditMethodModalOpen={seteditMethodModalOpen}
                        />
                        <ViewMethod
                            viewMethod={viewMethod}
                            viewMethodModalOpen={viewMethodModalOpen}
                            setviewMethodModalOpen={setviewMethodModalOpen}
                        />
                    </Container>
            }
        </>
    );
};

export default MethodSettingsContainer;
