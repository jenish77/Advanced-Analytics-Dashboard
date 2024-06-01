"use client"

import { SwitchSizingDataList } from '@/Data/Form&Table/Form';
import React, { FC, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Container, Row, Col, Card, CardHeader, Form, CardBody, Input, Label, Button, FormFeedback, Spinner } from 'reactstrap';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'react-query';
import { axiosPrivate, ROLE_PERMISSION_API_URL } from '@/security/axios';
import { toast } from 'react-toastify';
import { SocketContext } from '@/context/socketProvide';
import { authStore } from '@/context/AuthProvider';
import Error403Container from '@/Components/Other/Error/Error403';

type Props = {
    params: {
        id: string;
    };
}
interface Permission {
    permissionIds: any[];
}

const page: FC<Props> = ({ params }) => {
    const [selectAll, setSelectAll] = useState(false)
    const [rolePermissionData, setRolePermissionData] = useState<Permission | null>(null)
    const [permissionList, setPermissionList] = useState([]);
    const [checkedPermissions, setCheckedPermissions] = useState<any>([]);
    const [editedRoleName, setEditedRoleName] = useState("");
    const [validated, setValidated] = useState(false);
    const router = useRouter();
    const { id } = params
    const { hanldeRolePermission } = useContext(SocketContext);
    const { permission } = authStore();
    const [editError, setEditError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'role_permission_edit': setEditError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);
    const queryKey: [string] = useMemo(() => ["roleEditApi"], []);

    const { data: roleData, isFetching: isLoadingRole } = useQuery(
        queryKey,
        async () => {
            const response = await axiosPrivate.post(ROLE_PERMISSION_API_URL.roleEdit, { id: id });
            if (response.data) {
                setEditedRoleName(response.data.roleName)
                setRolePermissionData(response.data);
            }
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    useEffect(() => {
        if (rolePermissionData) {
            getPermission()
        }
    }, [rolePermissionData])

    const getPermission = async () => {
        try {

            const response = await axiosPrivate.get(ROLE_PERMISSION_API_URL.permissionList);
            const perIds: any = rolePermissionData?.permissionIds;
            setCheckedPermissions(perIds.map((rp: any) => rp));
            setPermissionList(response.data)
        } catch (e) {
            console.log(e);

        }
    }

    useEffect(() => {

            const allPermissionsChecked = Object.values(permissionList)
                .flatMap((module: any) => module.map((permission: any) => permission._id))
                .every(permissionId => checkedPermissions.includes(permissionId));

            setSelectAll(allPermissionsChecked);
    }, [permissionList, checkedPermissions]);

    const handlePermissionChange = (permissionId: any, isChecked: any) => {
        if (isChecked) {
            setCheckedPermissions((prevPermissions: any) => [
                ...prevPermissions,
                permissionId,
            ]);
        } else {
            setCheckedPermissions((prevPermissions: any) =>
                prevPermissions.filter((id: any) => id !== permissionId)
            );
        }
    };

    const handleSelectAllChange = (e: any) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            const allPermissions = Object.values(permissionList).flatMap((module: any) => module.map((permission: any) => permission._id));
            setCheckedPermissions(allPermissions);
        } else {
            setCheckedPermissions([]);
        }
    };


    const handleRoleNameChange = (e: any) => {
        setEditedRoleName(e.target.value);
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!editedRoleName.trim()) {
            setValidated(true);
            return false
        }
        if (checkedPermissions.length === 0) {
            toast.error("Please select at least one permission.")
            return false
        }


        const updatedRole: any = {
            roleId: id,
            name: editedRoleName,
            permissionIds: checkedPermissions,
        };
        setIsLoading(true)
        updateRolePermission(updatedRole)
    };
    const { mutateAsync: updateRolePermission } = useMutation(
        async (data) => {
            return await axiosPrivate.post(ROLE_PERMISSION_API_URL.roleUpdate, data);
        },
        {
            onSuccess: (res) => {
                hanldeRolePermission(id)
                toast.success("Role Permission Update Successfully.");
                // handleGoBack()
                setIsLoading(false)

            },
            onError: (error: any) => {
                setIsLoading(false)

                const errorData = error?.response?.data?.message;
                if (errorData) {
                    toast.error(errorData);
                }
                if (error?.response.status == 403) {
                    handleGoBack()
                    toast.error("Permission Denied");
                }
            },
        }
    );

    return (
        <>
            {
                editError ?
                    <Error403Container />
                    :
                    <Container fluid>
                        <Row>
                            <Col sm="12">
                                <Card>
                                    <CardHeader className="d-flex justify-content-between align-items-end">
                                        <h2>Role & Permission</h2>
                                        <div className="btn btn-primary pt-2 pb-2"
                                            onClick={handleGoBack}
                                        >
                                            Back
                                        </div>
                                    </CardHeader>
                                    <Form noValidate onSubmit={handleSubmit}>

                                        <CardBody>
                                            <div className='pb-4'>
                                                <h5 className='mb-2 f-18'>Role Name</h5>
                                                <Input type="text" name="name" required placeholder='Enter role name'
                                                    value={editedRoleName}
                                                    onChange={handleRoleNameChange}
                                                    className={
                                                        (validated && !editedRoleName.trim()) ||
                                                            (validated && editedRoleName.trim().length < 2) ||
                                                            (validated && editedRoleName.trim().length > 30)
                                                            ? "is-invalid"
                                                            : ""
                                                    }
                                                />
                                                <FormFeedback type="invalid">
                                                    {validated && !editedRoleName.trim() && "Please enter role name."}
                                                    {validated && editedRoleName.trim() && editedRoleName.trim().length < 2 && "Role name should be at least 2 characters."}
                                                    {validated && editedRoleName.trim() && editedRoleName.trim().length > 30 && "Role name Max length should be 30 characters."}
                                                </FormFeedback>
                                            </div>

                                            <div className="border-top border-bottom border-2 border-muted py-3">
                                                <Row>
                                                    <div>
                                                        <Label className="d-block" htmlFor={id} check></Label>
                                                        <Input className="checkbox_animated" id={id} type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                                                        Select All Permissions
                                                    </div>
                                                </Row>
                                            </div>


                                            {Object.entries(permissionList).map(([module_name, permissions]: any, index: number) => (
                                                <ul className='d-flex flex-column gap-4 py-4' key={index}>
                                                    <li className='w-100'>
                                                        <h5 className='text-secondary mb-1 f-18'> {module_name.charAt(0).toUpperCase() +
                                                            module_name.slice(1).replace(/_/g, " ")}</h5>
                                                        <Row>
                                                            {permissions?.map((permission: any, index: number) => (
                                                                <Col sm={6} md={4} lg={3} className='mb-1' key={index}>
                                                                    <div>
                                                                        <Label className="d-block" check></Label>
                                                                        <Input
                                                                            className="checkbox_animated"
                                                                            name="permissions"
                                                                            type="checkbox"
                                                                            id={permission._id}
                                                                            value={permission._id}
                                                                            checked={checkedPermissions.includes(
                                                                                permission._id
                                                                            )}
                                                                            onChange={(e) =>
                                                                                handlePermissionChange(
                                                                                    permission._id,
                                                                                    e.target.checked
                                                                                )
                                                                            }
                                                                        />
                                                                        {permission.show_name}
                                                                    </div>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </li>
                                                </ul>
                                            ))}
                                            <div className="list-product-header flex-shrink-0 d-flex gap-2">
                                                {isLoading ? (
                                                    <Button color="primary" className="mt-0" disabled>
                                                        <Spinner size="sm" color="light" />
                                                    </Button>
                                                ) : (
                                                    <Button color="primary" className="mt-0" type="submit">Update</Button>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Form>

                                </Card>
                            </Col>
                        </Row>

                    </Container >
            }
        </>
    )
}

export default page