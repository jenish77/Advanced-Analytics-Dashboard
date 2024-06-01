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
    viewDomain: DomainListType | undefined | any,
    viewDomainModalOpen: boolean,
    setviewDomainModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const ViewDomain: FC<Props> = ({ viewDomain, viewDomainModalOpen, setviewDomainModalOpen }) => {
    const [formData, setFormData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [merchantList, setMerchantList] = useState<any[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<any[]>([]);
    const [selectedMerchantName, setSelectedMerchantName] = useState<any[]>([]);
    const [editData, setEditData] = useState<any>({ domain_name: viewDomain?.domain_name, merchant_id: viewDomain?.merchant.merchant_id });
    const queryClient = useQueryClient();

    const { data: usersData } = useQuery('users', async () => {
        const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
        return response.data.result;
    }, {
        retry: false,
    });

    useEffect(() => {
        setEditData({ domain_name: viewDomain?.domain_name, merchant_id: viewDomain?.merchant.merchant_id })
        if (usersData) {
            setMerchantList(usersData.map((user: any) => ({
                id: user._id,
                first_name: user.first_name,
                merchant_id: user._id
            })));
        }
        if (viewDomain) {
            setSelectedMerchant([viewDomain?.merchant?.merchant_id]);
            setSelectedMerchantName([viewDomain?.merchant?.name]);
        }
    }, [usersData, viewDomain]);

    const modalToggle = () => {
        resetForm();
        setviewDomainModalOpen(!viewDomainModalOpen);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { domain_name: "", merchant_id: "" },
        validationSchema: addDomainValidationSchema,
        onSubmit: async (values) => {
            // await editDomainApi({ ...values, merchant_id: selectedMerchant })
        },
    })

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
            <i className="fa  fa-eye" />
            View Domain
        </div>
    )
   
    return (
        <CommonModal size="lg" isOpen={viewDomainModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">Domain Name</Label>
                                <Input type="text" {...getFieldProps("domain_name")} disabled/>
                                
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Merchant</Label>
                                <Typeahead
                                    options={merchantList}
                                    placeholder="Choose Merchant"
                                    id="Basic TypeAhead"
                                    labelKey="first_name"
                                    // onChange={handleSelectionChange}
                                    selected={selectedMerchantName}
                                    clearButton
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default ViewDomain