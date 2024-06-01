import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, Countries, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { ManageBanksType, ManageCurrencyType } from '@/Types/SystemSettings';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { CURRENCY_API_URL, axiosPrivate } from '@/security/axios';
import { toast } from 'react-toastify';
import { addCurrencyValidationSchema } from '@/Components/validation/validation';

type Props = {
    addCurrencyModalOpen: boolean,
    setaddCurrencyModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddCurrency: FC<Props> = ({ addCurrencyModalOpen, setaddCurrencyModalOpen }) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<any>(null);

    useEffect(() => {
        if (addCurrencyModalOpen) {
            resetForm();
        }
    }, [addCurrencyModalOpen]);

    const modalToggle = () => {
        resetForm();
        setaddCurrencyModalOpen(!addCurrencyModalOpen)
    }

    const handleClose = () => {
        resetForm();
        modalToggle();
    }

    const formik = useFormik({
        initialValues: {
            currency_code: "",
            currency_name: "",
            symbol: "",
            country: "",
        },
        validationSchema: addCurrencyValidationSchema,
        onSubmit: async (values: any, { resetForm }) => {
            values.country = selectedCountry
            await addCurrencyApi({
                ...values,
            });
        },
    })

    const { mutateAsync: addCurrencyApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.post(CURRENCY_API_URL.addCurrency, data);
                setIsLoading(false);
                if (response.status == 201) {
                    toast.success("Currency created successfully");
                    queryClient.invalidateQueries('getCurrencyApi')
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
            }
        }
    );

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
        resetForm,
    } = formik;

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-plus" />
            Add Currency
        </div>
    )

    return (
        <CommonModal size="lg" isOpen={addCurrencyModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">Currency Code</Label>
                                <Input type="text" {...getFieldProps('currency_code')} />
                                {touched.currency_code && errors.currency_code && <ErrorMessage name="currency_code" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Currency Name</Label>
                                <Input type="text" {...getFieldProps('currency_name')} />
                                {touched.currency_name && errors.currency_name && <ErrorMessage name="currency_name" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Currency Symbol</Label>
                                <Input type="text" {...getFieldProps('symbol')} />
                                {touched.symbol && errors.symbol && <ErrorMessage name="symbol" component="span" className="pt-1 text-danger" />}
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

export default AddCurrency