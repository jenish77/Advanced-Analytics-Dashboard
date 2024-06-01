import { SearchTableButton } from "@/Constant";
import { useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Tooltip } from "reactstrap";
import { Container, Row } from "reactstrap";
import { MerchantType } from "@/Types/UserListType";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { FilterData } from "../FilterData";
import AddMerchant from "./AddMerchant";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { useQuery } from "react-query";
import { MERCHANT_API_URL } from "@/security/axios";
import SVG from "@/CommonComponent/SVG";
import EditMerchant from "./EditMerchant";
import Loader from "../../../../app/loading"
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { FilterHeader } from "../FilterHeader";
import ViewMerchant from "./ViewMerchant";
import { UserFiltersData } from "@/Data/Application/Ecommerce";

const MerchantListContainer = () => {

    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [statusError, setStatusError] = useState(false);
    const [editError, setEditError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [copy, setCopy] = useState<{ id: string | null, type: string | null }>({ id: null, type: null });
    const [viewMerchant, setviewMerchant] = useState<MerchantType>()
    const [viewMerchantModalOpen, setviewMerchantModalOpen] = useState(false)

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'merchant_list': setShowError,
                'merchant_create': setCreateError,
                'merchant_status': setStatusError,
                'merchant_edit': setEditError,
                'merchant_delete': setDeleteError
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    // ------------------------------- VARIABLES ------------------------------- //

    const axiosPrivate = useAxiosPrivate();
    const [filterText, setFilterText] = useState("");
    const [limit, setLimit] = useState(10);
    const [merchantListTableData, setMerchantListTableData] = useState([])
    const [editData, setEditData] = useState({})
    const [addMerchantModalOpen, setAddMerchantModalOpen] = useState(false)
    const [editMerchantModalOpen, setEditMerchantModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState<number | any>(1)
    const [Loading, setLoading] = useState(false);
    const [statusData, setStatusData] = useState('');
    const [locationData, setLocationData] = useState('');

    // ------------------------------- COMMON FUNCTIONS ------------------------------- //

    const getUserData: any = useMemo(() => ["getAllUsers", currentPage, limit, statusData, locationData], [currentPage, limit, statusData, locationData]);
    const { data: getAllUsersApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getUserData,
        async () => {
            setLoading(true);
            const response = await axiosPrivate.get(
                `${MERCHANT_API_URL.getMerchantList}?searchText=${filterText}&page=${currentPage}&limit=${limit}&status=${statusData}&location=${locationData}`
            );

            setMerchantListTableData(response && response.data && response.data.result)
            setLoading(false);
            return response.data
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    const updateUserPermission = async (merchantId: string) => {
        SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Want to change this permission?",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {

                    const response: any = await axiosPrivate.put(`${MERCHANT_API_URL.changeUserPermission}?user_id=${merchantId}&active_status=${true}`);
                    const res = response.data;

                    if (response.status == 200) {
                        const status = res.result.active_status
                        const updatedRoleValue: any = merchantListTableData.map((user: any) => {
                            if (user._id === res.result._id) {
                                user.active_status = status;
                            }
                            return user;
                        })

                        setMerchantListTableData(updatedRoleValue)
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
    }

    //  Responsible for Edit event //
    const handleEdit = (data: any) => {
        setEditData(data)
        setEditMerchantModalOpen(true)
    };

    //  Responsible for Delete event //
    const handleDelete = (merchantId: string) => {
        SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: "Once deleted, you will not be able to recover this Dealer!", confirmButtonColor: "#7A70BA", showCancelButton: true }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response: any = await axiosPrivate.put(`${MERCHANT_API_URL.changeUserPermission}?user_id=${merchantId}&delete_status=${true}`);
                    const res = response.data;

                    if (response.status == 200) {
                        refetch()
                    }

                    SweetAlert.fire({ icon: "success", text: "Dealer has been deleted!", confirmButtonColor: "#7A70BA" });
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

    }

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

    const handleView = (viewMerchantData: MerchantType) => {
        setviewMerchant(viewMerchantData);
        setviewMerchantModalOpen(true);
    }

    // Action Tab //
    const MerchantListTableAction = ({ data }: { data: MerchantType }) => {
        return (
            <div className="action_btn_list">
                <Button className="btn_gray" id={`view${data.id}`} onClick={() => handleView(data)}>
                    <FaEye size={17} />
                    <CommonButtonsToolTip
                        id={`view${data.id}`}
                        toolTipText="view"
                    />
                </Button>
                {!editError && <Button color="secondary" id={`edit${data?.id}`} onClick={() => handleEdit(data)}>
                    <FaEdit size={17} />
                    <CommonButtonsToolTip
                        id={`edit${data?.id}`}
                        toolTipText="Edit"
                    />
                </Button>}
                {
                    !deleteError &&
                    <Button color="danger" id={`delete${data._id}`} onClick={() => handleDelete(data._id)}>
                        <FaTrash size={17} />
                        <CommonButtonsToolTip
                            id={`delete${data._id}`}
                            toolTipText="Delete"
                        />
                    </Button>
                }
            </div >
        )
    }

    // columns //
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggleTooltip = () => {
        setTooltipOpen(!tooltipOpen);
    };

    const handleCopyClick = (text: any, id: any, type: any) => {
        handleCopy(text, id, type);
        setTooltipOpen(true);
        setTimeout(() => setTooltipOpen(false), 1000); 
    };

    const MerchantListTableColumn: TableColumn<MerchantType>[] = [
        {
            name: "Sr",
            cell: (row: { id: string; }, index: number) => `${index + 1}`,
            grow: 0
        },
        {
            name: "Name",
            selector: (row: { first_name: string; last_name: string; }) => `${row.first_name} ${row.last_name}`,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: "Email",
            cell: (row: { email: any; }) => row.email,
            minWidth: '250px',
        },
        {
            name: "API Key",
            grow: 5,
            minWidth: '200px',
            maxWidth: '200px',
            cell: (row: { api_key: string; _id: string; }) =>
                <div className="class_key position-relative">
                    <p className="mb-0 api-key-text">{row.api_key}</p>
                    <Button
                        className="btn-copy"
                        id={`Tooltip-${row._id}`}
                        onClick={() => handleCopyClick(row.api_key, row._id, 'api_key')}
                    >
                        <i className="fa fa-copy" />
                    </Button>
                    <Tooltip
                        placement="top"
                        isOpen={tooltipOpen && copy.id === row._id && copy.type === 'api_key'}
                        target={`Tooltip-${row._id}`}
                        toggle={toggleTooltip}
                    >
                        Copied
                    </Tooltip>
                </div>
        },
        {
            name: "Secret Key",
            grow: 5,
            minWidth: '200px',
            maxWidth: '200px',
            cell: (row: { secret_key: string; _id: string; }) =>
                <div className="class_key position-relative">
                    <p className="mb-0 api-key-text">{row.secret_key}</p>
                    <Button
                        className="btn-copy"
                        id={`Tooltip-${row._id}`}
                        onClick={() => handleCopyClick(row.secret_key, row._id, 'secret_key')}
                    >
                        <i className="fa fa-copy" />
                    </Button>
                    <Tooltip
                        placement="top"
                        isOpen={tooltipOpen && copy.id === row._id && copy.type === 'secret_key'}
                        target={`Tooltip-${row._id}`}
                        toggle={toggleTooltip}
                    >
                        Copied
                    </Tooltip>
                </div>
        },
        {
            name: "Contact Number",
            cell: (row: { contact_number: string; }) => `${row.contact_number}`,
            // grow: 3
        },
        !statusError ? {
            name: "Status",
            cell: (row: { _id: any, active_status: boolean; }) =>
                <CommonSwitch defaultChecked={row.active_status === true} style={{ width: '32px', height: '18px' }} onChange={() => updateUserPermission(row._id)} />,
            grow: -4

        } : {},
        // {
        //     name: "Business type",
        //     selector: (row: { business_type: any; }) => row?.business_type?.business_type ?? "-",
        //     minWidth: '150px',
        // },
        // {
        //     name: "Business Name",
        //     selector: (row: { business_name: any; }) => row.business_name ?? "-",
        //     minWidth: '150px',
        // },
        {
            name: "Joined Date",
            selector: (row: { createdAt: any; }) => moment(row.createdAt).format("DD-MM-YYYY"),
            sortable: true,
        },
        !editError || !deleteError ? {
            name: "Actions",
            cell: (row) =>
                <MerchantListTableAction data={row} />,
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
                                    </CardHeader>
                                    <CardBody>
                                        <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                                            <div className="d-flex w-100 gap-4">
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
                                                <div className="">
                                                    <FilterData setStatusData={setStatusData} setLocationData={setLocationData} />
                                                </div>
                                            </div>
                                            {!createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                <div className="btn btn-primary pt-2 pb-2" onClick={() => setAddMerchantModalOpen(true)}>
                                                    <i className="fa fa-plus" />
                                                    Add Merchant
                                                </div>
                                            </div>}
                                        </div>

                                        <div className="list-product">
                                            <div className="table-responsive">
                                                {Loading ? (
                                                    <Loader />
                                                ) : (
                                                    merchantListTableData && (
                                                        <DataTable
                                                            data={merchantListTableData}
                                                            columns={MerchantListTableColumn}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
                                                            paginationPerPage={limit}
                                                            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                            paginationTotalRows={getAllUsersApi?.totalCount}
                                                            onChangePage={page => setCurrentPage(page)}
                                                            onChangeRowsPerPage={(currentRowsPerPage) => setLimit(currentRowsPerPage)}
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
                        {addMerchantModalOpen && <AddMerchant
                            addMerchantModalOpen={addMerchantModalOpen}
                            refetch={refetch}
                            setAddMerchantModalOpen={setAddMerchantModalOpen}
                        />}
                        {editMerchantModalOpen && <EditMerchant
                            merchantData={editData}
                            refetch={refetch}
                            merchantModalOpen={editMerchantModalOpen}
                            setMerchantModalOpen={setEditMerchantModalOpen}
                        />}
                        <ViewMerchant
                            viewMerchant={viewMerchant}
                            viewMerchantModalOpen={viewMerchantModalOpen}
                            setviewMerchantModalOpen={setviewMerchantModalOpen}
                        />
                    </Container>
            }

        </>
    );
};

export default MerchantListContainer;
