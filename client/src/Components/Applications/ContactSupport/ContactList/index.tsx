import { SearchTableButton } from "@/Constant";
import React, { useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Card, CardBody, Col, Container, Input, Row, Tooltip } from "reactstrap";
import { ContactListType } from "@/Types/EcommerceType";
import { useAppSelector } from "@/Redux/Hooks";
// import { FilterData } from "../../Transaction/FilterData";
import { useQuery } from "react-query";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { TICKET_API_URL } from "@/security/axios";
import Loader from "../../../../app/loading"
import SVG from "@/CommonComponent/SVG";
import SweetAlert from "sweetalert2";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";

const ContactListContainer = () => {
    const [filterText, setFilterText] = useState("");
    const [currentPage, setCurrentPage] = useState<number | any>(1)
    const [Loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const axiosPrivate = useAxiosPrivate();
    const [ticketList, setTicketList] = useState([])
    const route = useRouter();
    const { setTicketData, permission } = authStore();
    const [showError, setShowError] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'support_ticket': setShowError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    const getUserData: any = useMemo(() => ["getAllUsers", currentPage, limit], [currentPage, limit]);
    const { data: getAllUsersApi, isFetching: isLoadingProfile, refetch } = useQuery(
        getUserData,
        async () => {
            setLoading(true);
            const response = await axiosPrivate.get(`${TICKET_API_URL.getTicket}?searchText=${filterText}&page=${currentPage}&limit=${limit}`);
            setTicketList(response && response.data && response.data.result)
            setLoading(false);
            return response.data
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    const handleTicketStatus = async (row: any) => {
        const confirmation = await SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Want to close ticket?",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true,
        });

        if (!confirmation.isConfirmed) return;

        try {
            const { data, status } = await axiosPrivate.post(TICKET_API_URL.updateTicket, { ticket_id: row._id });

            if (status === 201) {
                const updatedTicketList: any = ticketList.map((ticket: any) =>
                    ticket._id === row._id ? { ...ticket, is_open: data.is_open } : ticket
                );
                setTicketList(updatedTicketList);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage) toast.error(errorMessage);
            else if (error?.response?.status === 403) toast.error("Permission Denied");
        }
    };

    const handleStoreTicketId = (row: any, url: any) => {
        setTicketData({
            id: row._id,
            userId: row.userId,
            fullName: row.full_name,
            profile_image: row.profile_image,
            is_open: row.is_open,
            message: row.message,
        })
        route.push(url);

    }
    const [tooltipOpen, setTooltipOpen] = useState<any>({});

    const toggle = (id: any) => {
        setTooltipOpen((prevState: any) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const customSort = (field: any) => (a: any, b: any) => {
        const valueA = a[field];
        const valueB = b[field];

        // Handle different data types
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            // Case-insensitive string comparison
            return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        } else if (typeof valueA === 'number' && typeof valueB === 'number') {
            // Numeric comparison for numbers
            return valueA - valueB;
        } else {
            // Fallback to default comparison
            return String(valueA).localeCompare(String(valueB));
        }
    };

    const ProductListTableDataColumn: TableColumn<ContactListType>[] = [
        {
            name: "Full Name",
            selector: (row) => `${row.full_name}`,
            sortable: true,
            sortFunction: customSort("full_name"),
        },
        {
            name: "Subject",
            selector: (row) => `${row.subject}`,
            sortable: true,
            sortFunction: customSort("subject"),
        },
        {
            name: "Ticket No",
            selector: (row) => `${row.ticketNo}`,
            sortable: true,
            sortFunction: customSort("ticketNo"),
        },
        {
            name: "Message",
            selector: (row) => `${row.message}`,
        },
        {
            name: "Status",
            cell: (row) => {
                const statusClass = row.is_open == 1 ? 'badge badge-success' : row.is_open == 2 ? 'badge badge-cancel' : 'badge badge-danger';
                const statusText = row.is_open == 1 ? 'Open' : row.is_open == 2 ? 'Responded' : 'Closed';

                return (
                    <div style={{ cursor: "pointer" }} onClick={() => handleTicketStatus(row)}>
                        <span className={`font-size-12 p-2 ${statusClass}`}>
                            {statusText}
                        </span>
                    </div>
                );
            },
        },
        {
            name: "Action",
            cell: (row) => {
                const { i18LangStatus } = useAppSelector((state) => state.langSlice);

                const url = `/${i18LangStatus}/contact_support/contact_support_chat`
                return (
                    <>
                        <Tooltip
                            isOpen={tooltipOpen[row._id] || false}
                            target={`TooltipExample${row._id}`}
                            toggle={() => toggle(row._id)}
                        >
                            Chat
                        </Tooltip>
                        <div
                            id={`TooltipExample${row._id}`}
                            style={{ cursor: 'pointer', fontSize: '25px' }}
                            className="product-action"
                            onClick={() => handleStoreTicketId(row, url)}
                        >
                            <i className="fa fa-wechat"></i>
                        </div>
                    </>
                );
            },
        },
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
                                    <CardBody>
                                        <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                                            <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center mb-3 gap-4">
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
                                        </div>
                                        {/* <FilterData /> */}
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                {Loading ? (
                                                    <Loader />
                                                ) : (
                                                    ticketList && (
                                                        <DataTable
                                                            data={ticketList}
                                                            columns={ProductListTableDataColumn}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
                                                            paginationPerPage={limit}
                                                            paginationRowsPerPageOptions={[2, 10, 20, 30, 40, 50]}
                                                            paginationTotalRows={getAllUsersApi?.totalCount}
                                                            onChangePage={page => setCurrentPage(page)}
                                                            onChangeRowsPerPage={(currentRowsPerPage) => setLimit(currentRowsPerPage)}
                                                            paginationServer
                                                            paginationDefaultPage={currentPage}
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

export default ContactListContainer;
