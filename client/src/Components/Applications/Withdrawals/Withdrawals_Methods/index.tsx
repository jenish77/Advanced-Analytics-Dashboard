import { ImagePath, RowCreateCallBackSpan, SearchTableButton } from "@/Constant";
import { ProductListTableDataColumn } from "@/Data/Application/Ecommerce";
import { RowCreateCallData, RowCreateCallList, RowCreateCallColumn } from "@/Data/Form&Table/Table/DataTable/RowCreateCallbackData";
import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { VscEye } from "react-icons/vsc";
import { FaCheck, FaEdit, FaEye, FaTimes, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { WithdrawalsMethodsTableData } from "@/Data/Application/Withdrawals";
import { WithdrawalMethodType } from "@/Types/WithdrawalsType";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import AddMethod from "./AddMethod";
import SweetAlert from "sweetalert2";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { FilterHeader } from "../../Common/Filter/FilterHeader";
import { FilterData } from "../../Common/Filter/FilterData";


const WithdrawalsMethodsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [addMethodModalOpen, setaddMethodModalOpen] = useState(false)

    const filteredItems = WithdrawalsMethodsTableData.filter((item: WithdrawalMethodType) => item.MethodName && item.MethodName.toLowerCase().includes(filterText.toLowerCase()));


    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);


    const handleDelete = () => {
        SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: "Once deleted, you will not be able to recover this Method!", confirmButtonColor: "#7A70BA", showCancelButton: true }).then((result) => {
            if (result.isConfirmed) {
                SweetAlert.fire({ icon: "success", text: "Method has been deleted!", confirmButtonColor: "#7A70BA" });
            }
        });
    };

    // const handleEdit = (editMethodData: MethodSettingsType) => {
    //     seteditMethod(editMethodData);
    //     seteditMethodModalOpen(true)
    // }

    const WithdrawalsMethodsTableAction = ({ data }: { data: WithdrawalMethodType }) => {
        return (
            <div className="action_btn_list">
                <Button className="btn_gray" id={`view${data.MethodID}`}>
                    {/* <VscEye   /> */}
                    <FaEye size={17} />
                    <CommonButtonsToolTip
                        id={`view${data.MethodID}`}
                        toolTipText="view"
                    />
                </Button>
                <Button color="secondary" id={`edit${data.MethodID}`} >
                    <FaEdit size={17} />
                    <CommonButtonsToolTip
                        id={`edit${data.MethodID}`}
                        toolTipText="edit"
                    />
                </Button>
                <Button color="danger" id={`delete${data.MethodID}`} onClick={handleDelete}>
                    <FaTrash size={17} />
                    <CommonButtonsToolTip
                        id={`delete${data.MethodID}`}
                        toolTipText="Delete"
                    />
                </Button>
            </div >
        )
    }



    const WithdrawalsMethodsTableColumn: TableColumn<WithdrawalMethodType>[] = [
        {
            name: "MethodID",
            cell: (row: { MethodID: any; }) => `${row.MethodID}`,
            grow: 2
        },
        {
            name: "Image",
            cell: (row) =>
                <div>
                    <img className="img-fluid" src={`${ImagePath}/withdrawals/${row.Image}`} alt={row.MethodName} />
                </div>,
        },
        {
            name: "Method Name",
            cell: (row: { MethodName: string; }) => `${row.MethodName}`,
            grow: 2
        },
        {
            name: "Minimum",
            cell: (row: { MinimumAmount: number; }) => `${row.MinimumAmount}`,
        },
        {
            name: "Maximum",
            cell: (row: { MaximumAmount: number; }) => `${row.MaximumAmount}`,
        },
        {
            name: "Processing Time",
            cell: (row: { ProcessingTime: string; }) => `${row.ProcessingTime}`,
            grow: 2
        },
        {
            name: "Fees",
            cell: (row: { Fees: number; }) => `${row.Fees}`,
        },
        {
            name: "Active",
            cell: (row: { Active: boolean; }) =>
                <CommonSwitch defaultChecked={row.Active} style={{ width: '32px', height: '18px' }} />
        },
        {
            name: "Restrictions",
            cell: (row: { Restrictions: string; }) => row.Restrictions,
            grow: 2
        },
        {
            name: "Actions",
            cell: (row) => <WithdrawalsMethodsTableAction data={row} />,
            grow: 2
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
                                <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center  mb-3 mb-lg-0">
                                    <Label className="me-2">{SearchTableButton}:</Label>
                                    <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText}
                                    />
                                </div>
                                <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                    <FilterHeader />
                                    <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddMethodModalOpen(true)}>
                                        <i className="fa fa-plus" />
                                        Add Method
                                    </div>
                                </div>
                            </div>
                            <FilterData />
                            <div className="list-product">
                                <div className="table-responsive">
                                    <DataTable data={filteredItems} persistTableHead columns={WithdrawalsMethodsTableColumn} highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
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


            <AddMethod
                addMethodModalOpen={addMethodModalOpen}
                setaddMethodModalOpen={setaddMethodModalOpen}
            />
        </Container>

    );
};

export default WithdrawalsMethodsContainer;
