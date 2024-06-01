import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useMemo, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Countries } from "@/Data/Form&Table/Form";
import { Typeahead } from 'react-bootstrap-typeahead';
import useAxiosPrivate from '@/security/useAxiosPrivate';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { addDealerValidationSchema } from '@/Components/validation/validation';
import { DEALER_API_URL } from '@/security/axios';
import { PhoneInput } from 'react-international-phone';

type Props = {
    addDealerModalOpen: boolean,
    refetch: any,
    setaddDealerModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddDealer: FC<Props> = ({ addDealerModalOpen, refetch, setaddDealerModalOpen }) => {

    // ------------------------------- VARIABLES ------------------------------- //

    const axiosPrivate = useAxiosPrivate();
    const [phone, setPhone] = useState('');
    const [selectedOption, setSelectedOption] = useState([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        company_name: "",
        contact_number: "",
        location: ""
    }

    // ------------------------------- COMMON FUNCTIONS ------------------------------- //

    const handleToggleMenu = () => setOpen(!open);

    const modalToggle = () => {
        resetForm()
        setErrors({})
        setSelectedOption([])
        setPhone('')
        setaddDealerModalOpen(!addDealerModalOpen);
    }

    const handleSelectionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("location", "Location Field is required")
        } else {
            setFieldError("location", "")
        }
        setSelectedOption(selected);
        values.location = selected[0]
    };

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Add Dealer
        </div>
    )

    // ------------------------------- FORMIK FUNCTIONS ------------------------------- //

    const formik = useFormik({
        initialValues,
        validationSchema: addDealerValidationSchema,
        onSubmit: async (values) => {
            if (!phone || phone.length < 4) setFieldError("mobile", "Mobile is Required.")
            const dataObject = {
                email: values.email,
                contact_number: phone,
                first_name: values.first_name,
                last_name: values.last_name,
                company_name: values.company_name,
                location: values.location
            }
            setIsLoading(true)
            await addDealerApi(dataObject)
        },
    })

    const { mutateAsync: addDealerApi } = useMutation(
        async (data: any) => {
            try {
                const response = await axiosPrivate.post(DEALER_API_URL.addDealer, data);
                if (response.status == 200 || response.status == 201) {
                    toast.success("Dealer added successfully");
                    refetch()
                    modalToggle()
                    resetForm()
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
            } finally {
                setIsLoading(false)
            }
        }
    );

    const {
        handleSubmit,
        getFieldProps,
        values,
        errors,
        resetForm,
        setErrors,
        setFieldError,
    } = formik;

    return (
        <CommonModal size="lg" isOpen={addDealerModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">{"First Name"}</Label>
                                <Input autoComplete='off' type="text" {...getFieldProps("first_name")} />
                                <ErrorMessage name="first_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>

                        <Col sm="12">
                            <FormGroup>
                                <Label>{"Last Name"}</Label>
                                <Input type="text" {...getFieldProps("last_name")} />
                                <ErrorMessage name="last_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>

                        <Col sm="12">
                            <FormGroup>
                                <Label>{"Email Address"}</Label>
                                <Input type="text" {...getFieldProps("email")} />
                                <ErrorMessage name="email" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>

                        <Col sm="12">
                            <FormGroup>
                                <Label>{"Company"}</Label>
                                <Input type="text" {...getFieldProps("company_name")} />
                                <ErrorMessage name="company_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>

                        <Col sm="12">
                            <FormGroup>
                                <Label>{"Mobile"}</Label>
                                <PhoneInput
                                    className='phone-dropdown'
                                    forceDialCode
                                    defaultCountry="ua"
                                    value={phone}
                                    onChange={(phone) => {
                                        if (phone.length < 8 || phone.length > 18) {
                                            setFieldError("mobile", "Mobile is required.")
                                        } else {
                                            setFieldError("mobile", "")
                                            setPhone(phone)
                                        }
                                    }
                                    }
                                />
                                <ErrorMessage name="mobile" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>

                        <Col sm="12">
                            <FormGroup>
                                <Label>Location</Label>
                                <Typeahead
                                    options={Countries}
                                    placeholder="Choose Location"
                                    id="Basic TypeAhead"
                                    open={open}
                                    onFocus={handleToggleMenu}
                                    onBlur={handleToggleMenu}
                                    onChange={handleSelectionChange}
                                    selected={selectedOption}
                                    clearButton
                                />
                                <ErrorMessage name="location" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                            <Button color="primary pt-2 pb-2" type='submit' disabled={isLoading}>{isLoading ? "Loading..." : "Submit"}</Button>
                        </div>
                    </Row>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default AddDealer