import { RowCreateCallBackSpan, SearchTableButton } from "@/Constant";
import { ProductListTableDataColumn } from "@/Data/Application/Ecommerce";
import { RowCreateCallData, RowCreateCallList, RowCreateCallColumn } from "@/Data/Form&Table/Table/DataTable/RowCreateCallbackData";
import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { VscEye } from "react-icons/vsc";
import { FaBan, FaEdit, FaTrash } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import LargeModal from "@/Components/UiKits/Modal/SizesModal/LargeModal";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import { SubAdminUserListType } from "@/Types/ManageSubAdminType";
import { SubAdminUserListTableData } from "@/Data/Application/ManageSubAdmin";
import { MdBlock } from "react-icons/md";
import AddRole from "./AddRole";


const RolesAndPermissionContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [addRoleModalOpen, setaddRoleModalOpen] = useState(false)


    const filteredItems = SubAdminUserListTableData.filter((item: SubAdminUserListType) => item.username && item.username.toLowerCase().includes(filterText.toLowerCase()));


    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);

    const handleDelete = () => {
        SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: "Once deleted, you will not be able to recover this Dealer!", confirmButtonColor: "#7A70BA", showCancelButton: true }).then((result) => {
            if (result.isConfirmed) {
                SweetAlert.fire({ icon: "success", text: "Dealer has been deleted!", confirmButtonColor: "#7A70BA" });
            }
        });
    };

    const handleEdit = (editSubAdmin: SubAdminUserListType) => {

    }

    const SubAdminUserListTableAction = ({ data }: { data: SubAdminUserListType }) => {
        return (
            <div className="action_btn_list">
                <Button color="secondary" id={`edit${data.id}`}>
                    <FaEdit size={17} />
                    <CommonButtonsToolTip
                        id={`edit${data.id}`}
                        toolTipText="edit"
                    />
                </Button>
                <Button color="primary" id={`disable${data.id}`}>
                    <FaBan size={17} />
                    <CommonButtonsToolTip
                        id={`disable${data.id}`}
                        toolTipText="Disable"
                    />
                </Button>
                <Button color="danger" id={`delete${data.id}`} onClick={handleDelete}>
                    <FaTrash size={17} />
                    <CommonButtonsToolTip
                        id={`delete${data.id}`}
                        toolTipText="Delete"
                    />
                </Button>
            </div >
        )
    }


    const SubAdminUserListTableColumn: TableColumn<SubAdminUserListType>[] = [
        {
            name: "Id",
            cell: (row: { id: any; }) => `${row.id}`,
        },
        {
            name: "User Name",
            cell: (row: { username: string; }) => `${row.username}`,
        },
        {
            name: "Email",
            cell: (row: { email: string; }) => row.email,
            grow: 2
        },
        {
            name: "Role",
            cell: (row: { role: string; }) => `${row.role}`,
        },
        {
            name: "created On",
            selector: (row: { createdOn: string; }) => `${row.createdOn}`,
            sortable: true,
        },
        {
            name: "Status",
            cell: (row: { status: string; }) =>
                <div className="status-box">
                    <Button style={{ width: "80px" }} className={`ps-2 pe-2 ${row.status === "Active" ? "background-light-success font-success" : "background-light-danger font-danger"} f-w-500`} color="transparent">{row.status}</Button>
                </div>
        },
        {
            name: "Actions",
            cell: (row) => <SubAdminUserListTableAction data={row} />,
        },
    ];


    return (

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
                                    <Label className="me-2">{SearchTableButton}:</Label>
                                    <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText}
                                    />
                                </div>
                                <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                    <FilterHeader />
                                    <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddRoleModalOpen(!addRoleModalOpen)}>
                                        <i className="fa fa-plus" />
                                        Add Role
                                    </div>
                                </div>
                            </div>
                            <FilterData />
                            {/* <div className="list-product-header">
                                <FilterHeader />
                                <FilterData />
                            </div> */}
                            <div className="list-product">
                                <div className="table-responsive">
                                    <DataTable data={filteredItems} persistTableHead columns={SubAdminUserListTableColumn} highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
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

            <AddRole
                addRoleModalOpen={addRoleModalOpen}
                setaddRoleModalOpen={setaddRoleModalOpen}
            />
        </Container>

    );
};

export default RolesAndPermissionContainer;
