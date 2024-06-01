import { SearchTableButton } from "@/Constant";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { DomainListType, SystemLogListType } from "@/Types/SystemSettings";
import { useQuery, useQueryClient } from "react-query";
import { SUB_ADMIN_API_URL, axiosPrivate } from "@/security/axios";
import moment from "moment";
import Error403Container from "@/Components/Other/Error/Error403";
import Loader from "../../../app/loading"
import { useRouter } from "next/navigation";

const DomainListsContainer = (id: any) => {
    const [currentPage, setCurrentPage]: any = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const router = useRouter();

    const handlePageSizeChange = (newPageSize: any) => {
        setPageSize(newPageSize);
    };
    const [showError, setShowError] = useState(false);
    const [Loading, setLoading] = useState(false);

    const getSystemLogList: any = useMemo(() => ["getSystemLogApi", currentPage, pageSize, id], [currentPage, pageSize, id]);
    const { data: getSystemLogApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getSystemLogList,
        async () => {
            setLoading(true);
            const response = await axiosPrivate.get(
                SUB_ADMIN_API_URL.getActivityLog,
                {
                    params: {
                        page: currentPage,
                        limit: pageSize,
                        userId: id
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

    const SystemLogListsTableColumn: TableColumn<SystemLogListType>[] = [
        {
            name: "ID",
            selector: (row, index: any) => `${index + 1}`,
            sortable: false,
        },
        {
            name: "User Name",
            cell: (row: { adminData: { fullName: string }; }) => `${row?.adminData?.fullName}`,
        },
        {
            name: "Date time",
            cell: (row: { createdAt: string; }) => `${moment(row.createdAt).format("DD-MM-YYYY hh:mm A")}`,
        },
    ];

    const handleGoBack = () => {
        router.back();
    };

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
                                    <CardHeader className="d-flex justify-content-between align-items-end">
                                        <h2></h2>
                                        <div className="btn btn-primary pt-2 pb-2"
                                            onClick={handleGoBack}
                                        >
                                            Back
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                {Loading ? (
                                                    <Loader />
                                                ) : (
                                                    getSystemLogApi && (
                                                        <DataTable
                                                            data={(getSystemLogApi?.result)}
                                                            columns={SystemLogListsTableColumn}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
                                                            paginationPerPage={pageSize}
                                                            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                            paginationTotalRows={getSystemLogApi?.totalCount}
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
                    </Container>
            }
        </>
    );
};

export default DomainListsContainer;
