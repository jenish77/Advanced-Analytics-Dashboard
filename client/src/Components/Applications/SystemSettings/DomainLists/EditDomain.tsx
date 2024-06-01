import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { DomainListType } from '@/Types/SystemSettings';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addDomainValidationSchema } from '@/Components/validation/validation';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { DEALER_API_URL, DOMAIN_API_URL, MERCHANT_API_URL, axiosPrivate } from '@/security/axios';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';

type Props = {
    editDomain: DomainListType | undefined | any,
    editDomainModalOpen: boolean,
    seteditDomainModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditDomain: FC<Props> = ({ editDomain, editDomainModalOpen, seteditDomainModalOpen }) => {
    const [formData, setFormData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [merchantList, setMerchantList] = useState<any[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<any[]>([]);
    const [selectedMerchantName, setSelectedMerchantName] = useState<any[]>([]);
    const [editData, setEditData] = useState<any>({ domain_name: editDomain?.domain_name, merchant_id: editDomain?.merchant.merchant_id });
    const queryClient = useQueryClient();

    const { data: usersData } = useQuery('users', async () => {
        const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
        return response.data.result;
    }, {
        retry: false,
    });

    useEffect(() => {
        setEditData({ domain_name: editDomain?.domain_name, merchant_id: editDomain?.merchant.merchant_id })
        if (usersData) {
            setMerchantList(usersData.map((user: any) => ({
                id: user._id,
                first_name: user.first_name,
                merchant_id: user._id
            })));
        }
        if (editDomain) {
            setSelectedMerchant([editDomain?.merchant?.merchant_id]);
            setSelectedMerchantName([editDomain?.merchant?.name]);
        }
    }, [usersData, editDomain]);

    const modalToggle = () => {
        resetForm();
        seteditDomainModalOpen(!editDomainModalOpen);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { domain_name: "", merchant_id: "" },
        validationSchema: addDomainValidationSchema,
        onSubmit: async (values) => {
            await editDomainApi({ ...values, merchant_id: selectedMerchant })
        },
    })

    const { mutateAsync: editDomainApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const merchantId = data.merchant_id[0];
                const requestData = { ...data, merchant_id: merchantId, _id: editDomain._id };
                const response = await axiosPrivate.put(DOMAIN_API_URL.editDomain, requestData);
                setIsLoading(false);
                if (response.status == 200) {
                    toast.success("Domain updated successfully");
                    setFormData(data);
                    resetForm();
                    queryClient.invalidateQueries('getDomainApi')
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
                setIsLoading(false);
            }
        }
    );

    const {
        handleSubmit,
        getFieldProps,
        errors,
        setFieldError,
        resetForm,
        touched,
        values
    } = formik;

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-pencil" />
            Edit Domain
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Domain</Button> */}
        </>
    )

    const handleSelectionChange = (selected: any[]) => {
        setSelectedMerchantName(selected.map((merchant) => merchant.first_name));
        setSelectedMerchant(selected.map((merchant) => merchant.id));
        formik.setValues({
            ...values,
            merchant_id: selected.length > 0 ? selected[0].id : ""
        });
    };

    return (
        <CommonModal size="lg" isOpen={editDomainModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">Domain Name</Label>
                                <Input type="text" {...getFieldProps("domain_name")} />
                                <ErrorMessage name="domain_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Select Merchant</Label>
                                <Typeahead
                                    options={merchantList}
                                    placeholder="Choose Merchant"
                                    id="Basic TypeAhead"
                                    labelKey="first_name"
                                    onChange={handleSelectionChange}
                                    selected={selectedMerchantName}
                                    clearButton
                                />
                                {touched.merchant_id && errors.merchant_id && <ErrorMessage name="merchant_id" component="span" className="pt-1 text-danger" />}
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

export default EditDomain