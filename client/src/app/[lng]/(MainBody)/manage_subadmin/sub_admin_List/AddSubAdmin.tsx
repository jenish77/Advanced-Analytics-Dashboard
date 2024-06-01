import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useState } from 'react'
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { ConfirmPassword, EmailAddress, FirstName, FullName, Password } from "@/Constant";
import { Typeahead } from 'react-bootstrap-typeahead';
import { FormikProvider, useFormik, Form, ErrorMessage } from "formik";
import { subAdminValidationSchema } from '@/Components/validation/validation';
import { axiosPrivate, SUB_ADMIN_API_URL } from '@/security/axios';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query'

type Props = {
    addSubAdminModalOpen: boolean,
    roleValue: any,
    setAddSubAdminModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddSubAdmin: FC<Props> = ({ addSubAdminModalOpen, setAddSubAdminModalOpen, roleValue }) => {
    const modalToggle = () => setAddSubAdminModalOpen(!addSubAdminModalOpen);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState([]);
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const queryClient = useQueryClient();

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Add Sub Admin
        </div>
    )


    const Footer = () => (
        <Button color="primary pt-2 pb-2" type='submit' disabled={isLoading}>{isLoading ? 'Loading...' : "Submit"}</Button>
    )

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            fullName: "",
            roleId: "",
            confirmPassword: "",
        },
        validationSchema: subAdminValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            createSubAdminApi(values)
        },
    })

    const {
        handleSubmit,
        getFieldProps,
        setFieldError,
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

    const { mutateAsync: createSubAdminApi } = useMutation(
        async (data: any) => {
            setIsLoading(true)
            try {
                const response = await axiosPrivate.post(SUB_ADMIN_API_URL.subAdminCreate, data);
                if (response.status == 201) {
                    queryClient.invalidateQueries(["subAdminApi"]);
                    resetForm()
                    modalToggle();
                    setIsLoading(false)
                    toast.success(response.data.message);
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
        <CommonModal size="lg" isOpen={addSubAdminModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form onSubmit={handleSubmit} className="g-3" autoComplete="off">
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label>{FullName}</Label>
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
                                <Label>{Password}</Label>
                                <div className="position-relative">
                                    <Input placeholder='Enter password' type={showPassword ? "text" : "password"} autoComplete={showPassword ? 'off' : 'new-password'} {...getFieldProps("password")} />
                                    {!showPassword ? <FaEyeSlash className='view-icon' onClick={() => setShowPassword(!showPassword)} /> : <FaEye className='view-icon' onClick={() => setShowPassword(!showPassword)} />}
                                </div>
                                <ErrorMessage name="password" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>{ConfirmPassword}</Label>
                                <div className="position-relative">

                                    <Input placeholder='Enter confirm password' type={showConfirmPassword ? "text" : "password"} autoComplete={showConfirmPassword ? 'off' : 'new-password'} {...getFieldProps("confirmPassword")} />
                                    {!showConfirmPassword ? <FaEyeSlash className='view-icon' onClick={() => setShowConfirmPassword(!showConfirmPassword)} /> : <FaEye className='view-icon' onClick={() => setShowConfirmPassword(!showConfirmPassword)} />}
                                </div>
                                <ErrorMessage name="confirmPassword" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Roles</Label>
                                <Typeahead
                                    options={roleValue}
                                    placeholder="Select Role"
                                    id="Basic TypeAhead"
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

export default AddSubAdmin