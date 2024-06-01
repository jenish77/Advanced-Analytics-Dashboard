import { ImagePath, RowCreateCallBackSpan, SearchTableButton } from "@/Constant";
import { ProductListTableDataColumn } from "@/Data/Application/Ecommerce";
import { RowCreateCallData, RowCreateCallList, RowCreateCallColumn } from "@/Data/Form&Table/Table/DataTable/RowCreateCallbackData";
import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Card, CardBody, CardHeader, Col, Input, Label, ListGroup, ListGroupItem } from "reactstrap";
import { Container, Row } from "reactstrap";
import { DealerType } from "@/Types/UserListType";
import { VscEye } from "react-icons/vsc";
import { FaEdit, FaTrash } from "react-icons/fa";
import LargeModal from "@/Components/UiKits/Modal/SizesModal/LargeModal";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { FilterHeader } from "./FilterHeader";
import { FilterData } from "./FilterData";
import AddNotification from "./AddNotification";
import { ManageNotificationsType } from "@/Types/ManageNotificationsType";
import { ManageNotificationsTableData } from "@/Data/Application/ManageNotifications";


const ManageNotificationsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [addNotificationModalOpen, setaddNotificationModalOpen] = useState(false)

    const filteredItems = ManageNotificationsTableData.filter((item: ManageNotificationsType) => item.message_title && item.message_title.toLowerCase().includes(filterText.toLowerCase()));


    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);


    // export interface ManageNotificationsType {
    //     notification_id: string,
    //     recipient_type: string,
    //     recipient_ids: Array<string>,
    //     message_title:string,
    //     message_body:string,
    //     timestamp: string
    // }


    const NotificationFormatedRecipientId = ({ recipient_ids }: { recipient_ids: Array<string> }) => {
        if (recipient_ids?.length == 0) {
            return <span>N/A</span>
        } else
            return (
                <ul >
                    {recipient_ids?.map((id, index) => {
                        return <li key={index} className="mb-1">{id} </li>
                    })}
                </ul>
            )
    }


    const NotificationsActions = ({ data }: { data: any }) => {
        return (
            <ul className="action simple-list d-flex flex-row gap-2 gap-md-3 align-items-center">
                <li className="view text-success">
                    <VscEye id={`view${data.notification_id}`} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                    <CommonButtonsToolTip
                        id={`view${data.notification_id}`}
                        toolTipText="view"
                    />
                </li>
                <li className="edit text-primary">
                    <FaEdit id={`edit${data.notification_id}`} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <CommonButtonsToolTip
                        id={`edit${data.notification_id}`}
                        toolTipText="edit"
                    />
                </li>
                <li className="delete text-danger">
                    <FaTrash id={`delete${data.notification_id}`} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <CommonButtonsToolTip
                        id={`delete${data.notification_id}`}
                        toolTipText="Delete"
                    />
                </li>
            </ul>
        )
    }

    const ManageNotificationsTableColumn: TableColumn<ManageNotificationsType>[] = [
        {
            name: "ID",
            cell: (row: { notification_id: string; }) => `${row.notification_id}`,
        },
        {
            name: "Recipient Type",
            cell: (row: { recipient_type: string; }) => `${row.recipient_type}`,
        },
        {
            name: "Recipient Id",
            cell: (row: { recipient_ids: Array<string>; }) =>
                <NotificationFormatedRecipientId recipient_ids={row.recipient_ids} />,
        },
        {
            name: "No Of Recipient",
            cell: (row) => {
                if (row.recipient_type === "All Merchants") {
                    return <span>`all merchant count`</span>
                }
                else if (row.recipient_type === "All Dealer") {
                    return <span>`all delaer count`</span>
                }
                else if (row.recipient_ids?.length === 0) {
                    return <span>`all member count`</span>
                } else {
                    return <span>{row.recipient_ids?.length}</span>
                }
            },
        },
        {
            name: "Message Title",
            cell: (row: { message_title: string; }) => `${row.message_title}`,
            grow: 2
        },
        {
            name: "Descrition",
            cell: (row: { description: string; }) => `${row.description}`,
            grow: 3
        },
        {
            name: "Date Time",
            cell: (row: { timestamp: string; }) => `${row.timestamp}`,
            grow: 2
        },
        // {
        //     name: "Actions",
        //     cell: (row) => <NotificationsActions data={row} />,
        // },
    ];


    return (

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
                                <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                    <FilterHeader />
                                    <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddNotificationModalOpen(true)}>
                                        <i className="fa fa-plus" />
                                        Create Notification
                                    </div>
                                </div>
                            </div>
                            <FilterData />
                            <div className="list-product">
                                <div className="table-responsive">
                                    <DataTable data={filteredItems} persistTableHead columns={ManageNotificationsTableColumn} highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
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

            <AddNotification
                addNotificationModalOpen={addNotificationModalOpen}
                setaddNotificationModalOpen={setaddNotificationModalOpen}
            />
        </Container>

    );
};

export default ManageNotificationsContainer;
