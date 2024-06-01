import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import { SearchTableButton } from "@/Constant";
import { DealerType } from "@/Types/UserListType";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Button, Card, CardBody, CardHeader, Col, Container, Input, Label, Row } from "reactstrap";
import SweetAlert from "sweetalert2";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { useQuery } from "react-query";
import { DEALER_API_URL } from "@/security/axios";
import EditDealer from "./EditDealer";
import SVG from "@/CommonComponent/SVG";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import Loader from "../../../../app/loading"
import { toast } from "react-toastify";
import moment, { min } from "moment-timezone";
import ViewDealer from "./ViewDealer";
// import axios from "axios";
import axios from "@/security/axios";


const DealerListContainer = () => {

    useEffect(() => {
        const handleKeyDown = (event:any) => {
          if (
            (event.ctrlKey && (event.key === 'a' || event.key === 'c')) ||
            (event.metaKey && (event.key === 'a' || event.key === 'c'))
          ) {
            event.preventDefault();
          }
        };
    
        const disableContextMenu = (event:any) => {
          event.preventDefault();
        };
    
        const disableDragStart = (event:any) => {
          event.preventDefault();
        };
    
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', disableContextMenu);
        document.addEventListener('dragstart', disableDragStart);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('contextmenu', disableContextMenu);
          document.removeEventListener('dragstart', disableDragStart);
        };
      }, []);
    

    const [showError, setShowError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [editError, setEditError] = useState(false);
    const [viewDealer, setviewDealer] = useState<DealerType>()
    const [viewDealerModalOpen, setviewDealerModalOpen] = useState(false)

    // ------------------------------- VARIABLES ------------------------------- //

    const axiosPrivate = useAxiosPrivate();
    const [filterText, setFilterText] = useState("");
    const [dealerListTableData, setDealerListTableData] = useState([])

    const [editData, setEditData] = useState({})
    const [editDealerModalOpen, setEditDealerModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState<number | any>(1)
    const [Loading, setLoading] = useState(false);

    // ------------------------------- COMMON FUNCTIONS ------------------------------- //
    const { data: getAllUsersApi, refetch } = useQuery(
        '',
        async () => {
            const response: any = await axios.get('user/get-user');
            console.log("response", response);
            
            setDealerListTableData(response && response.data)
            setLoading(false);
            return response.data
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    //  Responsible for Delete event //
    const handleDelete = (dealerId: string) => {
        SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: "Once deleted, you will not be able to recover this Dealer!", confirmButtonColor: "#7A70BA", showCancelButton: true }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response: any = await axiosPrivate.put(`${DEALER_API_URL.changeUserPermission}?user_id=${dealerId}&delete_status=${true}`);

                    if (response.status == 200) {
                        refetch()
                        SweetAlert.fire({ icon: "success", text: "Dealer has been deleted!", confirmButtonColor: "#7A70BA" });
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
        setEditDealerModalOpen(true)
    };

    const handleView = (viewDealerData: DealerType) => {
        setviewDealer(viewDealerData);
        setviewDealerModalOpen(true);
    }

    // Action Tab //
    const DealerListTableAction = ({ data }: { data: DealerType }) => {
        return (
            <div className="action_btn_list">
                <Button className="btn_gray" id={`view${data.id}`} onClick={() => handleView(data)}>
                    <FaEye size={17} />
                    <CommonButtonsToolTip
                        id={`view${data.id}`}
                        toolTipText="view"
                    />
                </Button>
                
                {!deleteError && <Button color="danger" id={`delete${data.id}`} onClick={() => handleDelete(data._id)}>
                    <FaTrash size={17} />
                    <CommonButtonsToolTip
                        id={`delete${data.id}`}
                        toolTipText="Delete"
                    />
                </Button>}
            </div >
        )
    }
   
    const DealerListTableColumn: any = [
        {
            name: "Sr",
            cell: (row: { id: string; }, index: number) => `${index + 1}`,
            grow: 0
        },
        {
            name: "Name",
            selector: (row: { username: string; }) => `${row.username}`,
            sortable: true,
            grow: 1
        },
        {
            name: "Email",
            cell: (row: { email: any; }) => row.email,
            minWidth: '250px',
        },
        {
            name: "Location",
            cell: (row: { city: any }) => `${row.city}`,
            minWidth: '100px',
        },
        {
            name: "Joined Date",
            selector: (row: { createdAt: any; }) => moment(row.createdAt).format("DD-MM-YYYY"),
            sortable: true,
        },
        // !editError || !deleteError ? {
        //     name: "Actions",
        //     minWidth: '100px',
        //     cell: (row: any) => <DealerListTableAction data={row} />,
        // } : {}
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
                                            <div id="row_create_filter" className="dataTables_filter  d-flex align-items-center mb-3 mb-lg-0 gap-4">
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
                                        <div className="list-product">
                                            <div className="table-responsive">
                                                {Loading ? (
                                                    <Loader />
                                                ) : (
                                                    dealerListTableData && (
                                                        <DataTable
                                                            data={dealerListTableData}
                                                            columns={DealerListTableColumn}
                                                            highlightOnHover
                                                            striped
                                                            pagination
                                                            persistTableHead
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

                        {editDealerModalOpen &&
                            <EditDealer
                                dealerData={editData}
                                refetch={refetch}
                                dealerModalOpen={editDealerModalOpen}
                                setDealerModalOpen={setEditDealerModalOpen}
                            />}
                        <ViewDealer
                            viewDealer={viewDealer}
                            viewDealerModalOpen={viewDealerModalOpen}
                            setviewDealerModalOpen={setviewDealerModalOpen}
                        />
                    </Container>
            }
        </>
    );
};

export default DealerListContainer;
