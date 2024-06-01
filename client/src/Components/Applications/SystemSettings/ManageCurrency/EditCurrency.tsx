import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, Countries, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { ManageBanksType, ManageCurrencyType } from '@/Types/SystemSettings';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { CURRENCY_API_URL, axiosPrivate } from '@/security/axios';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { addCurrencyValidationSchema } from '@/Components/validation/validation';

type Props = {
    editCurrency: ManageCurrencyType | undefined | any,
    editCurrencyModalOpen: boolean,
    seteditCurrencyModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditCurrency: FC<Props> = ({ editCurrency, editCurrencyModalOpen, seteditCurrencyModalOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState<any>({ currency_code: editCurrency?.currency_code, currency_name: editCurrency?.currency_name, symbol: editCurrency?.symbol, country: editCurrency?.country });
    const [selectedCountry, setSelectedCountry] = useState<string>(editCurrency?.country || "");
    const queryClient = useQueryClient();

    const modalToggle = () => {
        resetForm();
        seteditCurrencyModalOpen(!editCurrencyModalOpen);
    }

    useEffect(() => {
        setEditData({
            currency_code: editCurrency?.currency_code || '',
            currency_name: editCurrency?.currency_name || '',
            symbol: editCurrency?.symbol || '',
            country: editCurrency?.country || ''
        });
    }, [editCurrency]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { currency_code: "", currency_name: "", symbol: "", country: "" },
        validationSchema: addCurrencyValidationSchema,
        onSubmit: async (values) => {
            await editCurrencyApi(values)
            resetForm();
        },
    })

    const { mutateAsync: editCurrencyApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const requestData = { ...data, _id: editCurrency._id };
                const response = await axiosPrivate.put(CURRENCY_API_URL.editCurrencyDetails, requestData);
                setIsLoading(false);
                if (response.status == 200) {
                    toast.success("Currency updated successfully");
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

    const {
        handleSubmit,
        getFieldProps,
        setFieldError,
        errors,
        touched,
        resetForm,
        values
    } = formik;

    const handleCountryChange = (selected: any[]) => {
        formik.setValues({
            ...values,
            country: selected[0] || "",
        });
        setSelectedCountry(selected.length > 0 ? selected[0] : "");
    };

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-pencil" />
            Edit Currency
        </div>
    )

    return (
        <CommonModal size="lg" isOpen={editCurrencyModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
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
                                    id="Basic TypeAhead"
                                    onChange={handleCountryChange}
                                    defaultInputValue={editCurrency?.country}
                                    clearButton
                                />
                                {touched.country && errors.country && <ErrorMessage name="country" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" disabled={isLoading} >{isLoading ? "Loading..." : "Update"}</Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default EditCurrency