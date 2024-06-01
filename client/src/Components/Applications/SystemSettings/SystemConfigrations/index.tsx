import CommonSwitch from "@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch";
import Error403Container from "@/Components/Other/Error/Error403";
import { authStore } from "@/context/AuthProvider";
import { SYS_CONFIGRATION_URL, axiosPrivate } from "@/security/axios";
import {  useLayoutEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Col, Card, CardBody, Row,  Container } from "reactstrap";
import SweetAlert from "sweetalert2";

const SystemConfigrationsContainer = () => {

    const { permission } = authStore();
    const queryClient = useQueryClient();

    const { data: getSysConfirgration, isFetching: isLoadingProfile } = useQuery(
        ['getSysConfirgration'],
        async () => {
            const response = await axiosPrivate.get(
                SYS_CONFIGRATION_URL.getSysConfirgration
            );
            return response?.data
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );
    const [showError, setShowError] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'system_configuration': setShowError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);

    const updateSysConfigrationStatus = async (configID: string, active_status: boolean) => {
        SweetAlert.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Want to change this permission?",
            confirmButtonColor: "#7A70BA",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {

                    const response: any = await axiosPrivate.put(`${SYS_CONFIGRATION_URL.changeSysConfirgrationStatus}?_id=${configID}&active_status=${true}`);

                    if (response.status == 200) {
                        SweetAlert.fire({
                            icon: "success",
                            text: "Permission has been updated!",
                            confirmButtonColor: "#7A70BA"
                        });
                    }
                    queryClient.invalidateQueries('getSysConfirgration')
                } catch (error) {
                    const errorData = error?.response.data;
                    if (errorData?.message) {
                        toast.error(errorData?.message);
                    } else if (errorData.statusCode == 403) {
                        toast.error("Permission Denied");
                    }
                }
            }
        });
    }

    return (
        <>
            {
                showError ?
                    <Error403Container />
                    :
                    <Container fluid className="dashboard-4">
                        <Row>

                            {
                                getSysConfirgration?.slice(0,2).map((data: any, index: number) => (
                                    <Col xxl="4" xl="6" key={index} className="mb-4">
                                        <Card className="h-100">
                                            <CardBody >
                                                <div className="d-flex gap-2 align-items-start">
                                                    <div className="flex-grow-1">
                                                        <h2 className="mb-3">{data.title}</h2>
                                                        <p className="text-secondary">
                                                            {data.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0 switch-lg">
                                                        <CommonSwitch defaultChecked={data.active_status} style={{ width: '32px', height: '18px' }} onChange={() => updateSysConfigrationStatus(data._id, data.active_status)} />
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Row>
                    </Container>
            }
        </>
    );
};

export default SystemConfigrationsContainer;
