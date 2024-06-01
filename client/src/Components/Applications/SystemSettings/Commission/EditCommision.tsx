import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, Countries, StateOfUsa, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { CommissionType, IpListsType } from '@/Types/SystemSettings';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { COMMISSION_API_URL, DEALER_API_URL, IP_ADDRESS_API_URL, MERCHANT_API_URL, axiosPrivate } from '@/security/axios';
import { toast } from 'react-toastify';
import { addCommissionValidationSchema, addIpAddressValidationSchema } from '@/Components/validation/validation';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';

type Props = {
    editCommission: CommissionType | undefined | any,
    editCommissionModalOpen: boolean,
    seteditCommissionModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditCommission: FC<Props> = ({ editCommission, editCommissionModalOpen, seteditCommissionModalOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState<any>({ percentage: editCommission?.percentage });
    const queryClient = useQueryClient();

    useEffect(() => {
        setEditData({ percentage: editCommission?.percentage })
    }, [editCommission]);

    const modalToggle = () => {
        resetForm();
        seteditCommissionModalOpen(!editCommissionModalOpen);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { percentage: "" },
        validationSchema: addCommissionValidationSchema,
        onSubmit: async (values) => {
            await editCommissionApi(values)
            resetForm();
        },
    })

    const { mutateAsync: editCommissionApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const requestData = { ...data, _id: editCommission._id };
                const response = await axiosPrivate.post(COMMISSION_API_URL.addEditCommission, requestData);
                setIsLoading(false);
                if (response.status == 201) {
                    toast.success("Commission updated successfully");
                    queryClient.invalidateQueries('getCommissionApi')
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
        setFieldValue,
        errors,
        touched,
        resetForm,
        values
    } = formik;

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-pencil" />
            Edit Commission
        </div>
    )

    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit IP</Button> */}
        </>
    )

    return (
        <CommonModal size="lg" isOpen={editCommissionModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">Commission</Label>
                                <Input type="text" {...getFieldProps("percentage")} />
                                {touched.percentage && errors.percentage && <ErrorMessage name="percentage" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Edit Commission"}</Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default EditCommission