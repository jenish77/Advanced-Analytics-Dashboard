import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { ConfirmPassword, EmailAddress, FirstName, Password } from "@/Constant";
import { Roles } from "@/Data/Form&Table/Form";
import { Typeahead } from 'react-bootstrap-typeahead';
import { FormikProvider, useFormik, Form, ErrorMessage } from "formik";
import { loginValidationSchema, subAdminUpdateValidationSchema, subAdminValidationSchema } from '@/Components/validation/validation';
import { AUTH_API_URL, axiosPrivate, ROLE_PERMISSION_API_URL, SUB_ADMIN_API_URL } from '@/security/axios';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query'
import { SocketContext } from '@/context/socketProvide';

type Props = {
    editSubAdminModalOpen: boolean,
    adminEdit: any,
    roleValue: any,
    setEditSubAdminModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditSubAdmin: FC<Props> = ({ editSubAdminModalOpen, setEditSubAdminModalOpen, adminEdit, roleValue }) => {
    const modalToggle = () => setEditSubAdminModalOpen(!editSubAdminModalOpen);
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ label: string; id: string }[]>([]);
    const [open, setOpen] = useState(false);
    const { hanldeAdminStatusUpdate } = useContext(SocketContext);


    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Edit Sub Admin
        </div>
    )

    const Footer = () => (
        <Button color="primary pt-2 pb-2" type='submit' disabled={isLoading}>{isLoading ? 'Loading...' : "Update"}</Button>
    )

    useEffect(() => {
        if (adminEdit) {
            values.roleId = adminEdit.roleId
            setSelectedOption([{ label: adminEdit.roleName, id: adminEdit.roleId }]);
        }
    }, [adminEdit]);

    const formik = useFormik({
        initialValues: {
            id: adminEdit._id,
            email: adminEdit.email,
            fullName: adminEdit.fullName,
            roleId: selectedOption[0]?.id,
        },
        validationSchema: subAdminUpdateValidationSchema,
        onSubmit: async (values) => {

            updateSubAdminApi(values)
        },
    })

    const {
        handleSubmit,
        getFieldProps,
        setFieldError,
        setFieldValue,
        values,
        resetForm
    } = formik;

    const handleToggleMenu = () => setOpen(!open);

    const handleSelectionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("location", "Location Field is required")
        } else {
            setFieldError("location", "")
        }
        setSelectedOption(selected);
        values.roleId = selected[0]?.id
    };

    const { mutateAsync: updateSubAdminApi } = useMutation(
        async (data: any) => {
            setIsLoading(true)
            try {
                const response = await axiosPrivate.post(SUB_ADMIN_API_URL.subAdminUpdate, data);
                if (response.status == 201) {
                    queryClient.invalidateQueries(["subAdminApi"]);
                    resetForm()
                    modalToggle();
                    setIsLoading(false)
                    toast.success(response.data.message);
                    if (response.data.result) {
                        hanldeAdminStatusUpdate(selectedOption[0]?.id)
                    }
                }
            } catch (error) {
                const errorData = error?.response.data;
                if (Object.keys(errorData?.error).length) {
                    Object.keys(errorData?.error).forEach((key) => {
                        setFieldError(key, errorData?.error[key]);
                    });
                }
                if (errorData?.error) {
                    toast.error(errorData?.message);
                }
                if (errorData.statusCode == 403) {
                    toast.error("Permission Denied");
                    modalToggle()
                    resetForm()
                }
                setIsLoading(false);
            }
        }
    );

    return (
        <CommonModal size="lg" isOpen={editSubAdminModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form onSubmit={handleSubmit} className="g-3" autoComplete="off">
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label>{FirstName}</Label>
                                <Input type="text" {...getFieldProps("fullName")} placeholder='Enter full name'/>
                                <ErrorMessage name="fullName" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>{EmailAddress}</Label>
                                <Input type="email" autoComplete='off' {...getFieldProps("email")} placeholder='Enter email'/>
                                <ErrorMessage name="email" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Roles</Label>
                                <Typeahead
                                    options={roleValue}
                                    placeholder="Select Role"
                                    id="async-example"
                                    open={open}
                                    onFocus={handleToggleMenu}
                                    onBlur={handleToggleMenu}
                                    onChange={handleSelectionChange}
                                    selected={selectedOption}
                                    clearButton
                                />
                                <ErrorMessage name="roleId" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                            <Footer />
                        </div>
                    </Row>
                </Form>
            </FormikProvider>
        </CommonModal >
    )
}

export default EditSubAdmin