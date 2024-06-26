"use client"
import React, { FC, useState, useMemo, useLayoutEffect } from 'react'
import { Container, Row, Col, Button, Card, Form, CardHeader, CardBody, Input, Label, FormFeedback, Spinner } from 'reactstrap';
import { useRouter } from 'next/navigation';
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { ROLE_PERMISSION_API_URL } from '@/security/axios';
import { useQuery } from "react-query";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { authStore } from '@/context/AuthProvider';
import Error403Container from '@/Components/Other/Error/Error403';

type Props = {
    params: {
        id: string;
    };
}
interface FormData {
    name: string;
    permissions: string[];
}

const page: FC<Props> = ({ params }) => {
    const [selectAll, setSelectAll] = useState(false)
    const [permissionList, setPermissionList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [createError, setCreateError] = useState(false);
    const { permission } = authStore();
    const [isLoading, setIsLoading] = useState(false);

    useLayoutEffect(() => {
        const handleStorageChange = () => {

            const permissionsMap = {
                'role_permission_create': setCreateError,
            };

            if (permission) {
                for (const [perm, setError] of Object.entries(permissionsMap)) {
                    setError(!permission.includes(perm));
                }
            }
        }
        handleStorageChange()
    }, [permission]);
    const router = useRouter();
    const axiosPrivate = useAxiosPrivate();

    let [formData, setFormData] = useState<FormData>({
        name: "",
        permissions: [],
    });

    const handleGoBack = () => {
        router.back();
    };

    const queryKey: [string] = useMemo(() => ["permissionApi"], []);

    const { data: permissionData, isFetching: isLoadingPermission } = useQuery(
        queryKey,
        async () => {
            const response = await axiosPrivate.get(ROLE_PERMISSION_API_URL.permissionList);
            setPermissionList(response.data)
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    const resetForm = () => {
        setFormData({
            name: "",
            permissions: [],
        });
        setValidated(false);
    };

    const handleInputChange = (e: any) => {
        const { name, checked, value } = e.target;
        if (name === "permissions") {
            let updatedPermissions;
            if (checked) {
                updatedPermissions = [...formData.permissions, value];
            } else {
                updatedPermissions = formData.permissions.filter(permissionId => permissionId !== value);
            }

            setFormData((prevState: any) => ({
                ...prevState,
                permissions: updatedPermissions
            }));

            const allPermissionsSelected = Object.values(permissionList).flatMap((module: any) =>
                module.map((permission: any) => permission._id)
            ).every(permissionId => updatedPermissions.includes(permissionId));

            setSelectAll(allPermissionsSelected);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    }

    const { mutateAsync: rolaHasPermissionCreate } = useMutation(
        async (data: any) => {
            try {
                const response: any = await axiosPrivate.post(ROLE_PERMISSION_API_URL.rolaHasPermissionCreate, data);
                if (response.status === 201) {
                    toast.success("You have successfully given the permission.");
                    resetForm();
                }
            } catch (error) {
                setIsLoading(false)
                const errorData = error?.response?.data?.message;
                if (errorData) {
                    toast.error(errorData);
                }
                if (error?.response.status == 403) {
                    handleGoBack()
                    toast.error("Permission Denied");
                }
            }
        },

    );

    const handleSelectAll = (e: any) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            const allPermissionIds: any = Object.values(permissionList).flatMap((module: any) =>
                module.map((permission: any) => permission._id)
            );
            setFormData({
                ...formData,
                permissions: allPermissionIds,
            });
        } else {
            setFormData({
                ...formData,
                permissions: [],
            });
        }
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;

        // Perform validation checks
        const isNameInvalid = formData.name.trim().length === 0;
        const isPermissionsInvalid = formData.permissions.length === 0;

        if (isNameInvalid) {
            setValidated(true);
        } else if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
        } else if (isPermissionsInvalid) {
            toast.error("Please select at least one permission.");
        } else {
            setValidated(false);
            const trimmedFormData = {
                ...formData,
                name: formData.name.trim()
            };
            setIsLoading(true)
            rolaHasPermissionCreate(trimmedFormData)
                .then((res: any) => {
                    setIsLoading(false)
                    // Handle success response
                })
                .catch((errors) => {
                    setIsLoading(false)
                    console.log({ errors });
                });
        }
    };


    return (
        <>
            {
                createError ?
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
                                                <Input type="text" required placeholder='Enter role name'
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    name="name"
                                                    className={
                                                        (validated && !formData.name.trim()) ||
                                                            (validated && formData.name.trim().length < 2) ||
                                                            (validated && formData.name.trim().length > 30)
                                                            ? "is-invalid"
                                                            : ""
                                                    }
                                                />
                                                <FormFeedback type="invalid">
                                                    {validated && !formData.name.trim() && "Please enter role name."}
                                                    {validated && formData.name.trim() && formData.name.trim().length < 2 && "Role name should be at least 2 characters."}
                                                    {validated && formData.name.trim() && formData.name.trim().length > 30 && "Role name Max length should be 30 characters."}
                                                </FormFeedback>

                                            </div>

                                            <div className="border-top border-bottom border-2 border-muted py-3">
                                                <Row>
                                                    <div>
                                                        <Label className="d-block" check></Label>
                                                        <Input className="checkbox_animated" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
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
                                                                            value={permission._id}
                                                                            id={permission._id}
                                                                            checked={formData.permissions?.includes(permission?._id)}
                                                                            onChange={handleInputChange}
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
                                                    <Button color="primary" className="mt-0" type="submit">Submit</Button>
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