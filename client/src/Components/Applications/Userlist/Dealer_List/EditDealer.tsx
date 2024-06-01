import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Countries } from "@/Data/Form&Table/Form";
import { Typeahead } from 'react-bootstrap-typeahead';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import { PhoneInput } from 'react-international-phone';
import { MethodSettingsType } from '@/Types/SystemSettings';
import { COMMISSION_API_URL, DEALER_API_URL, axiosPrivate } from '@/security/axios';
import { toast } from 'react-toastify';
import { updateDealerValidationSchema } from '@/Components/validation/validation';

type Props = {
    dealerData: MethodSettingsType | undefined | any,
    refetch: any,
    dealerModalOpen: boolean,
    setDealerModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditDealer: FC<Props> = ({ dealerData, refetch, dealerModalOpen, setDealerModalOpen }) => {

    const [selectedOption, setSelectedOption] = useState<string[]>([dealerData.location]);
    const [selectedOptionCommission, setSelectedOptionCommission] = useState<{ label: string; id: string }[]>([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState(dealerData.contact_number);
    const [initialValues, setInitialValues] = useState({});
    const [commissionList, setCommissionList] = useState<{ label: string; id: string }[]>([]);

    const { data: commissionData } = useQuery('commission', async () => {
        const response = await axiosPrivate.get(COMMISSION_API_URL.getCommission);
        setCommissionList(response.data.map((user: any) => ({
            id: user._id,
            label: String(user.percentage)
        })));
        return response.data;
    }, {
        retry: false,
    });

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-pencil" />
            Edit Dealer
        </div>
    )

    const modalToggle = () => {
        resetForm()
        setErrors({})
        setSelectedOption([])
        setSelectedOptionCommission([])
        setDealerModalOpen(!dealerModalOpen);
    }

    const handleToggleMenu = () => setOpen(!open);

    const handleSelectionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("location", "Location Field is required")
        } else {
            setFieldError("location", "")
        }
        setSelectedOption(selected);
        values.location = selected
    };

    const handleSelectionCommissionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("commission", "Commission Field is required")
        } else {
            setFieldError("commission", "")
        }
        setSelectedOptionCommission(selected);
        values.commission = selected[0]?.id;
    };

    // ------------------------------- FORMIK FUNCTIONS ------------------------------- //

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: updateDealerValidationSchema,
        onSubmit: async (values: any) => {

            const dataObject = {
                _id: dealerData._id.toString(),
                email: values.email,
                contact_number: phone,
                first_name: values.first_name,
                last_name: values.last_name,
                company_name: values.company_name,
                location: values.location[0],
                commission: values.commission,
                manual_commission: values.manual_commission
            }

            if (dataObject.contact_number && dataObject.contact_number.length <= 8) {
                setFieldError("mobile", "Mobile Number is required.")
            } else {
                await updateDealerApi(dataObject)
            }
        },
    })

    const { mutateAsync: updateDealerApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.put(DEALER_API_URL.updateDealer, data);
                if (response.status == 200 || response.status == 201) {
                    toast.success("Dealer updated successfully");
                    refetch()
                    modalToggle()
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
        resetForm,
        setErrors,
        setFieldError,
        touched,
        errors
    } = formik;

    useEffect(() => {
        if (dealerData) {

            setSelectedOption([dealerData.location]);
            if (dealerData.commission) {
                setSelectedOptionCommission([{ label: String(dealerData.commission?.percentage), id: dealerData.commission._id }]);
            }
            setPhone(dealerData.contact_number)
            setInitialValues({
                first_name: dealerData?.first_name,
                last_name: dealerData?.last_name,
                email: dealerData?.email,
                company_name: dealerData?.company_name,
                mobile: dealerData.contact_number,
                location: [dealerData.location],
                commission: dealerData.commission?._id,
                manual_commission: dealerData.manual_commission
            })
        }
    }, [dealerData, dealerModalOpen]);

    return (
        <CommonModal size="lg" isOpen={dealerModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">{"First Name"}</Label>
                                <Input type="text" {...getFieldProps("first_name")} />
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
                        {
                            dealerData && dealerData.contact_number &&
                            <Col sm="12">
                                <FormGroup>
                                    <Label>{"Mobile"}</Label>
                                    <PhoneInput
                                        className='phone-dropdown'
                                        forceDialCode
                                        value={phone}
                                        onChange={(phone) => setPhone(phone)}
                                    />
                                    <ErrorMessage name="mobile" component="span" className="pt-1 text-danger" />
                                </FormGroup>
                            </Col>}
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
                                />
                                <ErrorMessage name="location" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12" md="6">
                            <FormGroup>
                                <Label>Select Commission</Label>
                                <Typeahead
                                    options={commissionList}
                                    placeholder="Choose Commission"
                                    id="Basic TypeAhead"
                                    onChange={handleSelectionCommissionChange}
                                    selected={selectedOptionCommission}
                                    clearButton
                                />
                                <ErrorMessage name="commission" component="span" className="pt-1 text-danger" />
                            </FormGroup>

                        </Col>
                        <Col sm="12" md="6">
                            <FormGroup>
                                <Label htmlFor="first-name">Manual Commission</Label>
                                <Input type="text" {...getFieldProps('manual_commission')} />
                                <ErrorMessage name="manual_commission" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                            <Button color="primary pt-2 pb-2" type='submit' disabled={isLoading} > {isLoading ? "Loading..." : "Update"}</Button>
                        </div>
                    </Row>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default EditDealer