import { SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import AddBannedCard from "./AddBannedCard";
import { BannedCardListTableData } from "@/Data/Application/RiskManagement";
import { BannedCardType } from "@/Types/RiskManagementType";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";


const BannedCardsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [addBannedCardModalOpen, setaddBannedCardModalOpen] = useState(false)
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [actionError, setActionError] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'banned_card_list': setShowError,
                'banned_card_create': setCreateError,
                'banned_card_action': setActionError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    const filteredItems = BannedCardListTableData.filter((item: BannedCardType) => item.cardHolderName && item.cardHolderName.toLowerCase().includes(filterText.toLowerCase()));


    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);


    const BannedCardsListActions = ({ id }: { id: any }) => {
        return (
            <ul className="action simple-list d-flex flex-row gap-2 gap-md-3 align-items-center">
                <li className="edit text-primary">
                    <FaEdit style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </li>
                <li className="delete text-danger">
                    <FaTrash style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                </li>
            </ul>
        )
    }

    const BannedCardsListTableColumn: TableColumn<BannedCardType>[] = [
        {
            name: "ID",
            cell: (row: { id: string; }) => `${row.id}`,
            grow: 2
        },
        {
            name: "Card Number",
            cell: (row: { cardNumber: string; }) => `${row.cardNumber}`,
            grow: 2
        },
        {
            name: "Cardholder Name",
            cell: (row: { cardHolderName: string; }) => `${row.cardHolderName}`,
            grow: 2
        },
        {
            name: "Expiry Date",
            cell: (row: { expiryDate: string; }) => `${row.expiryDate}`,
        },
        {
            name: "Reason",
            cell: (row: { reason: string; }) => `${row.reason}`,
            grow: 2
        },
        {
            name: "Banned By",
            cell: (row: { bannedBy: string; }) => `${row.bannedBy}`,
        },
        {
            name: "Banned Date",
            selector: (row: { bannedDate: string; }) => `${row.bannedDate}`,
            sortable: true,
        },
        !actionError ? {
            name: "Actions",
            cell: (row) =>
                <CommonSwitch defaultChecked={true} style={{ width: '32px', height: '18px' }} />
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
                                            <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center mb-3 mb-lg-0">
                                                <Label className="me-2">{SearchTableButton}:</Label>
                                                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText}
                                                />
                                            </div>
                                            {!createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                <FilterHeader />
                                                <div className="btn btn-primary pt-2 pb-2" onClick={() => setaddBannedCardModalOpen(true)}>
                                                    <i className="fa fa-plus" />
                                                    Add Banned Card
                                                </div>
                                            </div>}
                                        </div>
                                        <FilterData />
                                        {/* <div className="list-product-header">
                                <FilterHeader />
                                <FilterData />
                            </div> */}
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                <DataTable data={filteredItems} persistTableHead columns={BannedCardsListTableColumn} highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
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

                        <AddBannedCard
                            addBannedCardModalOpen={addBannedCardModalOpen}
                            setaddBannedCardModalOpen={setaddBannedCardModalOpen}
                        />
                    </Container>
            }
        </>
    );
};

export default BannedCardsContainer;
