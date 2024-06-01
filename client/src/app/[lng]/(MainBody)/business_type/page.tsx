"use client";

import { SearchTableButton } from "@/Constant";
import { useMemo, useState, useEffect, useLayoutEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
} from "reactstrap";
import { Container, Row } from "reactstrap";
import { FaBan, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import CommonButtonsToolTip from "@/Components/Buttons/CommonButtons/CommonButtonsToolTip";
import SweetAlert from "sweetalert2";
import { FilterHeader } from "@/Components/Applications/Transaction/FilterHeader";
import { FilterData } from "@/Components/Applications/Transaction/FilterData";
import CreateBusiness from "./CreateBusiness";
import EditBusiness from "./EditBusiness";
import { useRouter } from "next/navigation";
import { ROLE_PERMISSION_API_URL } from "@/security/axios";
import { useQuery } from "react-query";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { MdDone } from "react-icons/md";
import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import { toast } from "react-toastify";
import { BUSINESS_TYPE_URL } from "@/security/axios";
import { BusinesstypeListType } from "@/Types/UserListType";
import SVG from "@/CommonComponent/SVG";
import { authStore } from "@/context/AuthProvider";
import Error403Container from "@/Components/Other/Error/Error403";

import Loader from "../../../../app/loading"
const BusinessType = () => {
  const [filterText, setFilterText] = useState("");
  const [editBusiness, seteditBusiness] = useState<BusinesstypeListType>();
  const [editBusinessModalOpen, seteditBusinessModalOpen] = useState(false);
  const [createBusinessModalOpen, setCreateBusinessModalOpen] = useState(false);
  const [businessValue, setBusinessValue] = useState([]);
  const [filteredItems, setFilteredItems] = useState<[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const [statusFilter, setStatusFilter] = useState(""); // Add this line
  const [searchedText, setSearchedText] = useState("");
  const { permission } = authStore();
  const [showError, setShowError] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [disableError, setDisableError] = useState(false);
  const [Loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const handleStorageChange = () => {

      const permissionsMap = {
        'business_list': setShowError,
        'business_status': setDisableError,
        'business_delete': setDeleteError,
        'business_create': setCreateError,
      };

      if (permission) {
        for (const [perm, setError] of Object.entries(permissionsMap)) {
          setError(!permission.includes(perm));
        }
      }
    }
    handleStorageChange()
  }, [permission]);

  const queryKeys: [string] = useMemo(() => ["businesstype"], []);
  const { data: businesstypeData, isFetching: isLoadingbusinesstype, refetch } = useQuery(queryKeys,
    async () => {
      setLoading(true);
      const response = await axiosPrivate.get(BUSINESS_TYPE_URL.getbusinesstype);
      setBusinessValue(response.data.result);
      setLoading(false);
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const handleDelete = (id: any) => {
    SweetAlert.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Type !",
      confirmButtonColor: "#7A70BA",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPrivate.put(
            `${BUSINESS_TYPE_URL.changeBussinessTypePermission
            }?_id=${id}&delete_status=${true}`
          );

          if (response.status == 200) {
            SweetAlert.fire({
              icon: "success",
              text: "Business type delete successfully",
              confirmButtonColor: "#7A70BA",
            });

            refetch();
          }
        } catch (error) {
          if (error?.response.status == 403) {
            toast.error("Permission Denied");
          } else {
            toast.error(error.response.data.message);
          }
        }
      }
    });
  };

  const handleStatus = async (row: any) => {
    SweetAlert.fire({
      icon: "warning",
      title: "Are you sure?",
      //   text: `You want to ${row.status ? "In active" : "Active"}!`,
      text: `You want to change the status!`,
      confirmButtonColor: "#7A70BA",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPrivate.put(
            `${BUSINESS_TYPE_URL.changeBussinessTypePermission}?_id=${row._id
            }&active_status=${true}`
          );

          if (response.status == 200) {
            SweetAlert.fire({
              icon: "success",
              text: !response.data.result.active_status ? "Business type Inactive successfully" : "Business type active successfully",
              confirmButtonColor: "#7A70BA",
            });

            const updatedRoleValue: any = businessValue.map((user: any) => {
              if (user._id === row._id) {
                user.active_status = !user.active_status;
              }
              return user;
            });
            setBusinessValue(updatedRoleValue);
          }
        } catch (error) {
          if (error?.response.status == 403) {
            toast.error("Permission Denied");
          } else {
            toast.error(error.response.data.message);
          }
        }
      }
    });
  };

  const handleEdit = (editBusiness: BusinesstypeListType) => {
    seteditBusiness(editBusiness);
    seteditBusinessModalOpen(true);
  }

  const CreatedApiListActions = ({ id, row, data }: { id: any; row: any; data: BusinesstypeListType }) => {
    return (
      <div className="action_btn_list">
        <Button color="secondary" id={`edit${data.id}`} onClick={() => handleEdit(data)}>
          <FaEdit size={17} />
          <CommonButtonsToolTip
            id={`edit${data.id}`}
            toolTipText="edit"
          />
        </Button>
        {!deleteError &&
          <Button
            color="danger"
            id={`delete${id}`}
            onClick={() => handleDelete(id)}
          >
            <FaTrash size={17} />
            <CommonButtonsToolTip id={`delete${id}`} toolTipText="Delete" />
          </Button>}
      </div>
    );
  };

  const CreatedApiListsTableColumn: TableColumn<any>[] = [
    {
      name: "Business Type",
      cell: (row: { business_type: string }) => `${row.business_type}`,
    },
    !disableError ? {
      name: "Status",
      cell: (row: { active_status: boolean; _id: string }) => (
        <CommonSwitch
          defaultChecked={row.active_status}
          style={{ width: "32px", height: "18px" }}
          onChange={(checked: boolean) => handleStatus(row)}
        />
      ),
    } : {},
    !deleteError ? {
      name: "Actions",
      cell: (row) => <CreatedApiListActions id={row._id} row={row} data={row} />
    } : {}
  ];

  const handleSearch = () => {
    // Filter the items based on the search text and active status filter
    const newFilteredItems: any = businessValue?.filter((item: BusinesstypeListType) => {
      // Filter by business type
      const businessTypeMatch = item.business_type && item.business_type.toLowerCase().includes(filterText.toLowerCase());

      // Filter by selected active status
      if (statusFilter !== "") {
        return (
          businessTypeMatch && item.active_status.toString() === statusFilter
        );
      }

      // If no active status filter is selected, only apply the business type filter
      return businessTypeMatch;
    });

    // Set the filtered items state
    setFilteredItems(newFilteredItems);
  };

  useEffect(() => {
    handleSearch()
  }, [businessValue, statusFilter])

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
                  <CardHeader className="pb-0 card-no-border"></CardHeader>
                  <CardBody>
                    <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                      <div className="d-flex gap-4 w-100">
                        <div className="custom-search" style={{ minWidth: "260px" }}>
                          <Input
                            placeholder={SearchTableButton}
                            onKeyDown={(ev: any) => {
                              if (ev.keyCode == 13) {
                                handleSearch()
                              }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setFilterText(e.target.value)
                            }
                            type="search"
                            value={filterText}
                            className="rounded-end-0"
                          />
                          <div
                            className="search-icon"
                            style={{ cursor: "pointer" }}
                            onClick={handleSearch}
                          >
                            <SVG className="search-bg svg-color" iconId="search" />
                          </div>
                        </div>

                        {/* Input for selecting active status */}
                        <Input
                          className="form-control"
                          type="select"
                          style={{ maxWidth: "200px" }}
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="true">Active</option>
                          <option value="false">Deactive</option>
                        </Input>
                      </div>

                      {!createError && <div className="list-product-header flex-shrink-0 d-flex gap-2">
                        <div
                          className="btn btn-primary pt-2 pb-2"
                          onClick={() =>
                            setCreateBusinessModalOpen(!createBusinessModalOpen)
                          }
                        >
                          <i className="fa fa-plus" />
                          Create Business Type
                        </div>
                      </div>}
                    </div>
                    <div className="list-product">
                      <div className="table-responsive">
                        {Loading ?
                          <Loader /> :
                          <DataTable
                            data={filteredItems}
                            columns={CreatedApiListsTableColumn}
                            highlightOnHover
                            striped
                            pagination
                            persistTableHead
                            className="display dataTable theme-scrollbar"
                            customStyles={{
                              rows: {
                                style: {
                                  paddingTop: "15px",
                                  paddingBottom: "15px",
                                },
                              },
                            }}
                          />
                        }
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <CreateBusiness
              createBusinessModalOpen={createBusinessModalOpen}
              refetch={refetch}
              setCreateBusinessModalOpen={setCreateBusinessModalOpen}
            />
            <EditBusiness
              editBusiness={editBusiness}
              editBusinessModalOpen={editBusinessModalOpen}
              seteditBusinessModalOpen={seteditBusinessModalOpen}
            />
          </Container>
      }
    </>
  );
};

export default BusinessType;
