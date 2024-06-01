"use client"

import { SearchTableButton } from "@/Constant";
import { useContext, useLayoutEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { SubAdminUserListType } from "@/Types/UserListType";
import { FaBan, FaEdit, FaEye } from "react-icons/fa";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import AddSubAdmin from "./AddSubAdmin";
import { useQuery } from "react-query";
import { axiosPrivate, ROLE_PERMISSION_API_URL, SUB_ADMIN_API_URL } from "@/security/axios";
import moment from 'moment';
import EditSubAdmin from "./EditSubAdmin";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import { toast } from "react-toastify";
import { MdDone } from "react-icons/md";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";
import { SocketContext } from "@/context/socketProvide";
import SVG from "@/CommonComponent/SVG";
import { useRouter, usePathname } from "next/navigation";


const SubAdminUserList = () => {
  const { adminData } = authStore();
  const hasSubAdmin = adminData?.hasSubAdmin == 0
  const router = useRouter()
  const [filterText, setFilterText] = useState("");
  const [adminEdit, setAdminEdit] = useState("");
  const [addSubAdminModalOpen, setAddSubAdminModalOpen] = useState(false)
  const [editSubAdminModalOpen, setEditSubAdminModalOpen] = useState(false)
  const [subAdminList, setSubAdminList] = useState([])
  const [roleValue, setRoleValue] = useState([]);
  const { permission } = authStore();
  const [showError, setShowError] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [editError, setEditError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const { hanldeAdminStatusUpdate } = useContext(SocketContext);

  const filteredItems = subAdminList.filter((item: SubAdminUserListType) => item.fullName && item.fullName.toLowerCase().includes(filterText.toLowerCase()));
  useLayoutEffect(() => {
    const handleStorageChange = () => {

      const permissionsMap = {
        'sub_admin_list': setShowError,
        'sub_admin_create': setCreateError,
        'sub_admin_edit': setEditError,
        'sub_admin_status': setStatusError,
      };

      if (permission) {
        for (const [perm, setError] of Object.entries(permissionsMap)) {
          setError(!permission.includes(perm));
        }
      }
    }
    handleStorageChange()
  }, [permission]);
  const queryKeys: [string] = useMemo(() => ["subAdminApi"], []);

  const { data: subAdminData, isFetching: isLoadinSubAdmin } = useQuery(
    queryKeys,
    async () => {
      const response = await axiosPrivate.get(SUB_ADMIN_API_URL.subAdminList);
      setSubAdminList(response.data)
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const handleEdit = (row: any) => {
    setEditSubAdminModalOpen(true)
    setAdminEdit(row)
  }

  const navigateToViewPage = (id: any) => {
    router.push(`/en/manage_subadmin/system_log_activity?id=${id}`);
  };

  const MerchantListTableAction = ({ id, row }: { id: any, row: any }) => {
    return (
      <div className="action_btn_list">
        {!editError && <Button color="secondary" id={`edit${id}`} onClick={() => handleEdit(row)}>
          <FaEdit size={17} />
          <CommonButtonsToolTip
            id={`edit${id}`}
            toolTipText="edit"
          />
        </Button>}
        {hasSubAdmin &&<Button color="primary" id={`system_log${id}`} onClick={() => navigateToViewPage(id)}>
          <FaEye size={17} />
          <CommonButtonsToolTip
            id={`system_log${id}`}
            toolTipText="system_log"
          />
        </Button>}
        {/* {!statusError && <Button color="primary" id={`disable${id}`}>
          {row.status ? <MdDone size={17} /> : <FaBan size={17} />}
          <CommonButtonsToolTip
            id={`disable${id}`}
            toolTipText={row.status ? 'Enable' : "Disable"}
          />
        </Button>} */}
      </div >
    )
  }

  const handleStatus = async (row: any) => {

    SweetAlert.fire({ icon: "warning", title: "Are you sure?", text: `You want to ${row.status ? 'In active' : 'Active'}!`, confirmButtonColor: "#7A70BA", showCancelButton: true }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const requestData = {
            id: row._id,
          };

          const response = await axiosPrivate.post(SUB_ADMIN_API_URL.subAdminStatus, requestData);
          if (response.data.status) {
            SweetAlert.fire({ icon: "success", text: response.data.message, confirmButtonColor: "#7A70BA" });

            const updatedRoleValue: any = subAdminList.map((user: any) => {
              if (user._id === row._id) {
                user.status = !user.status;
              }
              return user;
            })

            setSubAdminList(updatedRoleValue)
            hanldeAdminStatusUpdate(row.roleId)
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
  };

  const MerchantListTableColumn: TableColumn<SubAdminUserListType>[] = [
    {
      name: "User Name",
      selector: (row: { fullName: string; }) => `${row.fullName}`,
      sortable: true,
      grow: 2
    },
    {
      name: "Role Name",
      cell: (row: { roleName: string; }) => row.roleName,
      grow: 2
    },
    !statusError ? {
      name: "Status",
      cell: (row: { status: number; _id: string }) =>
        <CommonSwitch defaultChecked={row.status == 1 ? true : false} style={{ width: '32px', height: '18px' }}
          onChange={(checked: boolean) => handleStatus(row)}
        />
    } : {},
    {
      name: "Created On",
      selector: (row: { createdAt: any; }) => moment(row.createdAt).format('YYYY-MM-DD'),
      sortable: true,
    },
    !statusError || !editError ? {
      name: "Actions",
      cell: (row) =>
        <MerchantListTableAction id={row._id} row={row} />,
    } : {}

  ];



  const queryKey: [string] = useMemo(() => ["roleApi"], []);

  const { data: roleData, isFetching: isLoadingrole, refetch } = useQuery(
    queryKey,
    async () => {
      const response = await axiosPrivate.get(ROLE_PERMISSION_API_URL.roleStatusList);
      const { data } = response.data
      if (data.length) {
        setRoleValue(data.map((el: any) => {
          return { label: el.name, id: el._id }
        }))
      }
    }, {
    retry: false,
    refetchOnWindowFocus: false
  }
  );

  const handleSubAdmin = () => {
    setAdminEdit("")
    setAddSubAdminModalOpen(true)
  }

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
                        {/* <FilterHeader /> */}
                        <div className="btn btn-primary pt-2 pb-2" onClick={() => handleSubAdmin()}>
                          <i className="fa fa-plus" />
                          Add New
                        </div>
                      </div>}
                    </div>
                    <div className="list-product">
                      <div className="table-responsive">
                        <DataTable data={filteredItems} persistTableHead columns={MerchantListTableColumn} highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
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

            {addSubAdminModalOpen && <AddSubAdmin
              addSubAdminModalOpen={addSubAdminModalOpen}
              setAddSubAdminModalOpen={setAddSubAdminModalOpen}
              roleValue={roleValue}
            />}

            {editSubAdminModalOpen && <EditSubAdmin
              editSubAdminModalOpen={editSubAdminModalOpen}
              setEditSubAdminModalOpen={setEditSubAdminModalOpen}
              adminEdit={adminEdit}
              roleValue={roleValue}
            />}
          </Container>
      }
    </>
  );
};

export default SubAdminUserList;
