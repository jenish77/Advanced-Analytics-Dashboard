import { SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FilterHeader } from "../FilterHeader";
import { FilterData } from "../FilterData";
import { TransferSettingsType } from "@/Types/SystemSettings";
import { TransferSettingData } from "@/Data/Application/SystemSettings";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";


const TransferSettingsContainer = () => {
    const [filterText, setFilterText] = useState("");
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [depositError, setDepositError] = useState(false);
    const [withdrawError, setWithdrawError] = useState(false);
    const [apiError, setApiError] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'transfer_setting_list': setShowError,
                'transfer_setting_deposit': setDepositError,
                'transfer_setting_withdraw': setWithdrawError,
                'transfer_setting_api': setApiError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    const filteredItems: TransferSettingsType[] = TransferSettingData.filter((item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()));
    // const filteredItems = TransferSettingsListData


    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
                <Label className="me-1">{SearchTableButton}:</Label>
                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
            </div>
        );
    }, [filterText]);

    const TransferSettingsListTableColumn = [
        {
            name: "User Name",
            cell: (row: { name: string; }) => `${row.name}`,
            grow: 1
        },
        {
            name: "Gateway",
            cell: (row: { gateWay: string; }) => `${row.gateWay}`,
            grow: 1
        },
        !depositError ? {
            name: "Deposit",
            cell: (row: { deposit: boolean; }) =>
                <div className="d-flex gap-4">
                    <div>
                        <Label className="text-center w-100">Min</Label>
                        <Input style={{ width: "100%", padding: "4px", lineHeight: "1", fontSize: "12px" }} />
                    </div>
                    <div>
                        <Label className="text-center w-100">Max</Label>
                        <Input style={{ width: "100%", padding: "4px", lineHeight: "1", fontSize: "12px" }} />
                    </div>
                </div>
        } : {},
        !withdrawError ? {
            name: "Withdraw",
            cell: (row: { withdraw: boolean; }) =>
                <div className="d-flex gap-4">
                    <div>
                        <Label className="text-center w-100">Min</Label>
                        <Input style={{ width: "100%", padding: "4px", lineHeight: "1", fontSize: "12px" }} />
                    </div>
                    <div>
                        <Label className="text-center w-100">Max</Label>
                        <Input style={{ width: "100%", padding: "4px", lineHeight: "1", fontSize: "12px" }} />
                    </div>
                </div>
        } : {},
        !apiError ? {
            name: "Api",
            cell: (row: { apiAccess: boolean; }) =>
                <div className="d-flex gap-4">
                    <div>
                        <Label className="text-center w-100">Min</Label>
                        <Input style={{ width: "100%", padding: "4px", lineHeight: "1", fontSize: "12px" }} />
                    </div>
                    <div>
                        <Label className="text-center w-100">Max</Label>
                        <Input style={{ width: "100%", padding: "4px", lineHeight: "1", fontSize: "12px" }} />
                    </div>
                </div>
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
                                                <Label className="me-2">{SearchTableButton}:</Label>
                                                <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText}
                                                />
                                            </div>
                                            <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                <FilterHeader />
                                            </div>
                                        </div>
                                        <FilterData />
                                        <div className="list-product transfer-setting-table">
                                            <div className="table-responsive">
                                                <DataTable data={filteredItems as TransferSettingsType[]} columns={TransferSettingsListTableColumn as any} persistTableHead highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
                                                    rows: {
                                                        style: {
                                                            paddingTop: '5px',
                                                            paddingBottom: '10px',
                                                        }
                                                    }
                                                }} />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    );
};

export default TransferSettingsContainer;
