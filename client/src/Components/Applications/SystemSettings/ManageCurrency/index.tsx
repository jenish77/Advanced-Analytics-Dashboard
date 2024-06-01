import { ImagePath, RowCreateCallBackSpan, SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaBan, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { ManageCurrencyType } from "@/Types/SystemSettings";
import EditCurrency from "./EditCurrency";
import { MdBlock, MdDone } from "react-icons/md";
import AddCurrency from "./AddCurrency";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import { useQuery, useQueryClient } from "react-query";
import { CURRENCY_API_URL, axiosPrivate } from "@/security/axios";
import SweetAlert from "sweetalert2";
import Loader from "../../../../app/loading"
import SVG from "@/CommonComponent/SVG";
import { toast } from "react-toastify";
import ViewCurrency from "./ViewCurrency";


const ManageCurrencyContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [editCurrency, seteditCurrency] = useState<ManageCurrencyType>();
    const [editCurrencyModalOpen, seteditCurrencyModalOpen] = useState(false);
    const [addCurrencyModalOpen, setaddCurrencyModalOpen] = useState(false);
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [editError, setEditError] = useState(false);
    const [disableError, setDisableError] = useState(false);
    const [currentPage, setCurrentPage]: any = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [Loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [viewCurrency, setviewCurrency] = useState<ManageCurrencyType>()
    const [viewCurrencyModalOpen, setviewCurrencyModalOpen] = useState(false)

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'manage_currency_list': setShowError,
                'manage_currency_create': setCreateError,
                'manage_currency_edit': setEditError,
                'manage_currency_disable': setDisableError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

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

    const getCurrencyList: any = useMemo(() => ["getCurrencyApi", currentPage, pageSize], [currentPage, pageSize]);
    const { data: getCurrencyApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getCurrencyList,
        async () => {
            setLoading(true);
            const response = await axiosPrivate.get(
                CURRENCY_API_URL.getCurrency,
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

    const updateCurrencyStatus = async (row: any) => {
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
                    await axiosPrivate.put(CURRENCY_API_URL.changeCurrencyStatus, requestData);
                    SweetAlert.fire({
                        icon: "success",
                        text: "Status has been updated!",
                        confirmButtonColor: "#7A70BA"
                    });
                    queryClient.invalidateQueries('getCurrencyApi');
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

    const handleEdit = (editCurrency: ManageCurrencyType) => {
        seteditCurrency(editCurrency);
        seteditCurrencyModalOpen(true);
    }

    const handleView = (viewCurrencyData: ManageCurrencyType) => {
        setviewCurrency(viewCurrencyData);
        setviewCurrencyModalOpen(true);
    }

    const IpListActions = ({ data }: { data: ManageCurrencyType }) => {
        return (
            <div className="action_btn_list">
                <Button className="btn_gray" id={`view${data.id}`} onClick={() => handleView(data)}>
                    <FaEye size={17} />
                    <CommonButtonsToolTip
                        id={`view${data.id}`}
                        toolTipText="view"
                    />
                </Button>
                {!editError && <Button color="secondary" id={`edit${data.id}`} onClick={() => handleEdit(data)}>
                    <FaEdit size={17} />
                    <CommonButtonsToolTip
                        id={`edit${data.id}`}
                        toolTipText="edit"
                    />
                </Button>}
            </div >
        )
    }

    const IpListsTableColumn: TableColumn<ManageCurrencyType>[] = [
        {
            name: "ID",
            cell: (row: { currency_id: string; }) => `${row.currency_id}`,
        },
        {
            name: "Currency Code",
            cell: (row: { currency_code: string; }) => `${row.currency_code}`,
        },
        {
            name: "Currency Name",
            cell: (row: { currency_name: string; }) => `${row.currency_name}`,
        },
        {
            name: "Symbol",
            cell: (row: { symbol: string; }) => `${row.symbol}`,
        },
        {
            name: "Country",
            cell: (row: { country: string; }) => `${row.country}`,
        },

        !disableError ? {
            name: "Status",
            cell: (row: { active_status: boolean; }) =>
                <CommonSwitch
                    defaultChecked={row.active_status}
                    style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => updateCurrencyStatus({ status: row.active_status, row })}
                />
        } : {},
        // {
        //     name: "Enable",
        //     cell: (row: { active_status: string }) =>
        //         <CommonSwitch defaultChecked={row.active_status === "Active"} style={{ width: '32px', height: '18px' }} />
        // },
        !editError || !disableError ? {
            name: "Actions",
            cell: (row) => <IpListActions data={row} />,
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
                                            {/* {createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddCurrencyModalOpen(true)}>
                                                    <i className="fa fa-plus" />
                                                    Add Currency
                                                </div>
                                            </div>} */}
                                            {!createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddCurrencyModalOpen(true)}>
                                                    <i className="fa fa-plus" />
                                                    Add Currency
                                                </div>
                                            </div>}
                                        </div>
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                {Loading ? (
                                                    <Loader />
                                                ) : (getCurrencyApi && (
                                                    <DataTable
                                                        data={getCurrencyApi?.result}
                                                        columns={IpListsTableColumn}
                                                        highlightOnHover
                                                        striped
                                                        pagination
                                                        persistTableHead
                                                        paginationPerPage={pageSize}
                                                        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                        paginationTotalRows={getCurrencyApi?.totalCount}
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

                        <AddCurrency
                            addCurrencyModalOpen={addCurrencyModalOpen}
                            setaddCurrencyModalOpen={setaddCurrencyModalOpen}
                        />
                        <EditCurrency
                            editCurrency={editCurrency}
                            editCurrencyModalOpen={editCurrencyModalOpen}
                            seteditCurrencyModalOpen={seteditCurrencyModalOpen}
                        />
                        <ViewCurrency
                            viewCurrency={viewCurrency}
                            viewCurrencyModalOpen={viewCurrencyModalOpen}
                            setviewCurrencyModalOpen={setviewCurrencyModalOpen}
                        />
                    </Container>
            }
        </>
    );
};

export default ManageCurrencyContainer;
