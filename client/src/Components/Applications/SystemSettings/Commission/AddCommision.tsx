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
import { COMMISSION_API_URL, DEALER_API_URL, IP_ADDRESS_API_URL, MERCHANT_API_URL, axiosPrivate } from '@/security/axios';
import { toast } from 'react-toastify';
import { addCommissionValidationSchema, addIpAddressValidationSchema } from '@/Components/validation/validation';

type Props = {
    addCommissionModalOpen: boolean,
    setaddCommissionModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddCommission: FC<Props> = ({ addCommissionModalOpen, setaddCommissionModalOpen }) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (addCommissionModalOpen) {
            resetForm();
        }
    }, [addCommissionModalOpen]);

    const modalToggle = () => {
        resetForm();
        setaddCommissionModalOpen(!addCommissionModalOpen)
    }

    const handleClose = () => {
        resetForm();
        modalToggle();
    }

    const formik = useFormik({
        initialValues: {
            percentage: "",
        },
        validationSchema: addCommissionValidationSchema,
        onSubmit: async (values: any, { resetForm }) => {
            await addCommissionApi(values);
        },
    })

    const { mutateAsync: addCommissionApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.post(COMMISSION_API_URL.addEditCommission, data);
                setIsLoading(false);
                if (response.status == 201) {
                    toast.success("Commission added successfully");
                    queryClient.invalidateQueries('getCommissionApi')
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
            Add Commission
        </div>
    )

    return (
        <CommonModal size="lg" isOpen={addCommissionModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">Percentage</Label>
                                <Input type="text" {...getFieldProps('percentage')} />
                                {touched.percentage && errors.percentage && <ErrorMessage name="percentage" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={handleClose}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" name="submit" disabled={isLoading}>{isLoading ? "Loading.." : "Add Commission"} </Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default AddCommission