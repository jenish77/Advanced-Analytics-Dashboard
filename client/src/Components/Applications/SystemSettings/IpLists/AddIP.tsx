import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, Countries, StateOfUsa, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { IpListsType } from '@/Types/SystemSettings';
import { Typeahead } from 'react-bootstrap-typeahead';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DEALER_API_URL, IP_ADDRESS_API_URL, MERCHANT_API_URL, axiosPrivate } from '@/security/axios';
import { toast } from 'react-toastify';
import { addIpAddressValidationSchema } from '@/Components/validation/validation';

type Props = {
    addIPModalOpen: boolean,
    setaddIPModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddIP: FC<Props> = ({ addIPModalOpen, setaddIPModalOpen }) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [merchantList, setMerchantList] = useState<any[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
    const [selectedCountry, setSelectedCountry] = useState<any>(null);

    useEffect(() => {
        if (addIPModalOpen) {
            resetForm();
        }
    }, [addIPModalOpen]);

    const modalToggle = () => {
        resetForm();
        setaddIPModalOpen(!addIPModalOpen)
    }

    const handleClose = () => {
        resetForm();
        modalToggle();
    }

    const { data: usersData } = useQuery('users', async () => {
        const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
        return response.data.result;
    }, {
        retry: false,
    });

    useEffect(() => {
        if (usersData) {
            setMerchantList(usersData.map((user: any) => ({
                id: user._id,
                first_name: user.first_name
            })));
        }
    }, [usersData]);

    const formik = useFormik({
        initialValues: {
            ip_address: "",
            merchant_id: "",
            country: "",
        },
        validationSchema: addIpAddressValidationSchema,
        onSubmit: async (values: any, { resetForm }) => {
            values.merchant_id = selectedMerchant.id;
            values.country = selectedCountry
            await addIpAddressApi({
                ...values,
            });
        },
    })

    const { mutateAsync: addIpAddressApi } = useMutation(
        async (data: any) => {
            try {
                
                const response = await axiosPrivate.post(IP_ADDRESS_API_URL.addIpAddress, data);
                setIsLoading(false);
                if (response.status == 201) {
                    toast.success("Ip address created successfully");
                    queryClient.invalidateQueries('getIpAddressApi')
                    modalToggle()
                    resetForm();

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

    const handleMerchantSelection = (selected: any) => {
        setSelectedMerchant(selected[0]);
        setFieldValue('merchant_id', selected[0]?.id);
    };

    const handleCountrySelection = (selected: any) => {
        setSelectedCountry(selected[0]);
        setFieldValue('country', selected[0]);
    };

    const {
        handleSubmit,
        getFieldProps,
        setFieldError,
        setFieldValue,
        touched,
        errors,
        values,
        resetForm,
        setTouched
    } = formik;

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-plus" />
            Add IP
        </div>
    )

    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Add IP</Button> */}
        </>
    )

    return (
        <CommonModal size="lg" isOpen={addIPModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">IP Address</Label>
                                <Input type="text" {...getFieldProps('ip_address')} />
                                {touched.ip_address && errors.ip_address && <ErrorMessage name="ip_address" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Select Merchant</Label>
                                <Typeahead
                                    options={merchantList}
                                    placeholder="Choose Merchant"
                                    id="merchant_id"
                                    labelKey="first_name"
                                    onChange={handleMerchantSelection}
                                    clearButton
                                />
                                {touched.merchant_id && errors.merchant_id && <ErrorMessage name="merchant_id" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Country</Label>
                                <Typeahead
                                    options={Countries}
                                    placeholder="Choose Country"
                                    id="country"
                                    onChange={handleCountrySelection}
                                    clearButton
                                />
                                {touched.country && errors.country && <ErrorMessage name="country" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={handleClose}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" name="submit" disabled={isLoading} >{isLoading ? "Loading.." : "Submit"} </Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default AddIP