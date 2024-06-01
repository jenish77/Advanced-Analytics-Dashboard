import { SearchTableButton } from "@/Constant";
import { useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaEye, FaTrash } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import { CreatedApiListsData } from "@/Data/Application/ManageAPI";
import { CreatedApiListsType } from "@/Types/ManageApiType";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import CreateAPI from "./CreateAPI";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";


const CreatedApiListsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [createAPIModalOpen, setcreateAPIModalOpen] = useState(false);

    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [viewError, setViewError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'create_api_list': setShowError,
                'create_api_view': setViewError,
                'create_api_create': setCreateError,
                'create_api_delete': setDeleteError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    const filteredItems = CreatedApiListsData.filter((item: CreatedApiListsType) => item.username && item.username.toLowerCase().includes(filterText.toLowerCase()));


    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);


    const handleDelete = () => {
        SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: "Once deleted, you will not be able to recover this API !", confirmButtonColor: "#7A70BA", showCancelButton: true }).then((result) => {
            if (result.isConfirmed) {
                SweetAlert.fire({ icon: "success", text: "Your API has been deleted!", confirmButtonColor: "#7A70BA" });
            }
        });
    };


    const CreatedApiListActions = ({ id }: { id: any }) => {
        return (
            // <ul className="action simple-list d-flex flex-row gap-2 gap-md-3 align-items-center">
            //     <li className="view text-primary">
            //         <VscEye id={`view${id}`} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            //         <CommonButtonsToolTip
            //             id={`view${id}`}
            //             toolTipText="view"
            //         />
            //     </li>
            //     <li className="delete text-danger" onClick={handleDelete}>
            //         <FaTrash id={`delete${id}`} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            //         <CommonButtonsToolTip
            //             id={`delete${id}`}
            //             toolTipText="Delete"
            //         />
            //     </li>
            // </ul>
            <div className="action_btn_list">
                {!viewError && <Button className="btn_gray" id={`view${id}`}>
                    {/* <VscEye  /> */}
                    <FaEye size={17} />
                    <CommonButtonsToolTip
                        id={`view${id}`}
                        toolTipText="view"
                    />
                </Button>}
                {!deleteError &&
                    <Button color="danger" id={`delete${id}`} onClick={handleDelete}>
                        <FaTrash size={17} />
                        <CommonButtonsToolTip
                            id={`delete${id}`}
                            toolTipText="Delete"
                        />
                    </Button>}
            </div >
        )
    }


    const CreatedApiListsTableColumn: TableColumn<CreatedApiListsType>[] = [
        {
            name: "ID",
            cell: (row: { id: string; }) => `${row.id}`
        },
        {
            name: "User ID",
            cell: (row: { userId: string; }) => `${row.userId}`,
        },
        {
            name: "User Name",
            cell: (row: { username: string; }) => `${row.username}`,
        },
        {
            name: "Created On",
            cell: (row: { createdOn: string; }) => `${row.createdOn}`,
            grow: 2
        },
        {
            name: "API Key",
            cell: (row: { apiKey: string; }) => `${row.apiKey}`,
        },
        {
            name: "Secret Key",
            cell: (row: { secretKey: string; }) => `${row.secretKey}`,
            grow: 2
        },
        {
            name: "Method",
            cell: (row: { method: string; }) => `${row.method}`,
        },
        !deleteError || !viewError ? {
            name: "Actions",
            cell: (row) =>
                <CreatedApiListActions id={row.id} />
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
                                    </CardHeader>
                                    <CardBody>
                                        <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                                            <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center  mb-3 mb-lg-0">
                                                <Label className="me-2">{SearchTableButton}:</Label>
                                                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText}
                                                />
                                            </div>
                                            {!createError &&
                                                <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                    <FilterHeader />
                                                    <div className="btn btn-primary pt-2 pb-2"
                                                        onClick={() => setcreateAPIModalOpen(!createAPIModalOpen)}
                                                    >
                                                        <i className="fa fa-plus" />
                                                        Create API
                                                    </div>
                                                </div>}
                                        </div>
                                        {/* <FilterData /> */}
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                <DataTable data={filteredItems} persistTableHead columns={CreatedApiListsTableColumn} highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
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
                        <CreateAPI
                            createAPIModalOpen={createAPIModalOpen}
                            setcreateAPIModalOpen={setcreateAPIModalOpen}
                        />
                    </Container>
            }
        </>
    );
};

export default CreatedApiListsContainer;
