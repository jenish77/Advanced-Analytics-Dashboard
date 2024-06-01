"use client"

import { SearchTableButton } from "@/Constant";
import { useContext, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaEdit } from "react-icons/fa";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import CreateRole from "./CreateRole";
import { useRouter } from "next/navigation";
import { ROLE_PERMISSION_API_URL } from "@/security/axios";
import { useQuery } from "react-query";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import { toast } from "react-toastify";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import { SocketContext } from "@/context/socketProvide";
import SVG from "@/CommonComponent/SVG";


const RolesAndPermission = () => {
    const [filterText, setFilterText] = useState("");
    const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
    const [roleValue, setRoleValue] = useState([]);
    const router = useRouter()
    const axiosPrivate = useAxiosPrivate();
    const { hanldeRoleStatusUpdate } = useContext(SocketContext);

    const filteredItems = roleValue?.filter((item: any) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()));
    const { permission } = authStore();
    const [showError, setShowError] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [editError, setEditError] = useState(false);
    const [statusError, setStatusError] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'role_permission_list': setShowError,
                'role_permission_create': setCreateError,
                'role_permission_edit': setEditError,
                'role_permission_status': setStatusError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    const navigateToEditPage = (id: any) => {
        router.push(`/en/manage_subadmin/roles_permission/edit/${id}`);
    };

    const navigateToCreatePage = () => {
        router.push(`/en/manage_subadmin/roles_permission/create`);
    };

    const handleStatus = async (row: any) => {
        SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: `You want to ${row.status ? 'Inactive' : 'Active'} the role!`, confirmButtonColor: "#7A70BA", showCancelButton: true }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const requestData = {
                        id: row._id,
                    };

                    const response = await axiosPrivate.post(ROLE_PERMISSION_API_URL.rolestatus, requestData);
                    if (response.data.status) {
                        SweetAlert.fire({ icon: "success", text: response.data.message, confirmButtonColor: "#7A70BA" });

                        const updatedRoleValue: any = roleValue.map((user: any) => {
                            if (user._id === row._id) {
                                user.status = !user.status;
                            }
                            return user;
                        })

                        setRoleValue(updatedRoleValue)
                        hanldeRoleStatusUpdate(row._id)
                    }

                } catch (error) {
                    toast.error(error.response.data.message);

                }
            }
        });
    };

    const queryKey: [string] = useMemo(() => ["roleApi"], []);

    const { data: roleData, isFetching: isLoadingrole, refetch } = useQuery(
        queryKey,
        async () => {
            const response = await axiosPrivate.get(ROLE_PERMISSION_API_URL.roleList);
            setRoleValue(response.data.data)
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    const CreatedApiListActions = ({ id, row }: { id: any, row: any }) => {
        return (
            <div className="action_btn_list">
                {!editError && <Button color="secondary" id={`edit${id}`} onClick={() => navigateToEditPage(id)}>
                    <FaEdit size={17} />
                    <CommonButtonsToolTip
                        id={`edit${id}`}
                        toolTipText="edit"
                    />
                </Button>}
            </div >
        )
    }


    const CreatedApiListsTableColumn: TableColumn<any>[] = [
        {
            name: "Role Name",
            cell: (row: { name: string; }) => `${row.name}`
        },
        !statusError ? {
            name: "Status",
            cell: (row: { status: boolean; _id: string }) =>
                <CommonSwitch defaultChecked={row.status} style={{ width: '32px', height: '18px' }}
                    onChange={(checked: boolean) => handleStatus(row)}
                />
        } : {},
        !statusError || !editError ? {

            name: "Actions",
            cell: (row) =>
                <CreatedApiListActions id={row._id} row={row} />
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
                                            <div className="d-flex gap-4 w-100">
                                                <div className="custom-search" style={{ minWidth: "260px" }}>
                                                    <Input placeholder={SearchTableButton} onKeyDown={(ev: any) => {
                                                        if (ev.keyCode == 13) {
                                                            refetch()
                                                        }
                                                    }}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                                                        type="search" value={filterText} className="rounded-end-0" />
                                                    <div className="search-icon" style={{ cursor: "pointer" }} onClick={() => refetch()} >
                                                        <SVG className="search-bg svg-color" iconId="search" />
                                                    </div>
                                                </div>
                                            </div>
                                            {!createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                <div className="btn btn-primary pt-2 pb-2"
                                                    onClick={() => navigateToCreatePage()}
                                                >
                                                    <i className="fa fa-plus" />
                                                    Create Role
                                                </div>
                                            </div>}
                                        </div>
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
                        <CreateRole
                            createRoleModalOpen={createRoleModalOpen}
                            setCreateRoleModalOpen={setCreateRoleModalOpen}
                        />
                    </Container>
            }
        </>
    );
};

export default RolesAndPermission;
