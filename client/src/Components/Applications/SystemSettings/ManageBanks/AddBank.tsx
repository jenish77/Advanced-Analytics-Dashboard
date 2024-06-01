import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { ApprovalType, BrowserRadioList, BrowserStateList, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { ManageBanksType } from '@/Types/SystemSettings';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BANK_API_URL, DEALER_API_URL, MERCHANT_API_URL, axiosPrivate } from '@/security/axios';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';
import { addBankValidationSchema } from '@/Components/validation/validation';

type Props = {
    addBankModalOpen: boolean,
    setaddBankModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddBank: FC<Props> = ({ addBankModalOpen, setaddBankModalOpen }) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedApprovalType, setSelectedApprovalType] = useState<any>(null);

    const modalToggle = () => {
        resetForm();
        setaddBankModalOpen(!addBankModalOpen)
    }

    const handleClose = () => {
        resetForm();
        modalToggle();
    }

    // const { data: usersData } = useQuery('users', async () => {
    //     const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
    //     return response.data.result;
    // }, {
    //     retry: false,
    // });

    // useEffect(() => {
    //     if (usersData) {
    //         setUserList(usersData.map((user: any) => ({
    //             id: user._id,
    //             first_name: user.first_name
    //         })));
    //     }
    // }, [usersData]);

    useEffect(() => {
        const fetchMerchantList = async () => {
            try {
                const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
                setUserList(response.data.result.map((user: any) => ({
                    id: user._id,
                    first_name: user.first_name,
                    user_name: user._id
                })));
            } catch (error) {
                console.error("Error fetching merchant list:", error);
            }
        };
        if (addBankModalOpen) {
            fetchMerchantList();
        }
    }, [addBankModalOpen]);

    const formik = useFormik({
        initialValues: {
            user_name: "",
            balance: "",
            company_name: "",
            bank_name: "",
            account_owner: "",
            account_IBAN: "",
            limit: "",
            api: "",
            approval_type: "",
        },
        validationSchema: addBankValidationSchema,
        onSubmit: async (values: any, { resetForm }) => {
            values.user_name = selectedUser.id;
            values.approval_type = selectedApprovalType
            await addBankApi({
                ...values,
            });

        },
    })

    const { mutateAsync: addBankApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.post(BANK_API_URL.addBank, data);
                setIsLoading(false);
                if (response.status == 201) {
                    toast.success("Bank created successfully");
                    queryClient.invalidateQueries('getBankApi')
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

    const handleUserSelection = (selected: any) => {
        setSelectedUser(selected[0]);
        setFieldValue('user_name', selected[0]?.id);
    };

    const handleApprovalTypeSelection = (selected: any) => {
        setSelectedApprovalType(selected[0]);
        setFieldValue('approval_type', selected[0]);
    };

    const {
        handleSubmit,
        getFieldProps,
        setFieldValue,
        setFieldError,
        touched,
        errors,
        resetForm,
    } = formik;

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Add Bank
        </div>
    )

    return (
        <CommonModal size="lg" isOpen={addBankModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Select User</Label>
                                <Typeahead
                                    options={userList}
                                    placeholder="Choose Merchant"
                                    id="user_name"
                                    labelKey="first_name"
                                    onChange={handleUserSelection}
                                    clearButton
                                />
                                {touched.user_name && errors.user_name && <ErrorMessage name="user_name" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Company Name</Label>
                                <Input type="text" {...getFieldProps('company_name')} />
                                <ErrorMessage name="company_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="bankname">Bank Name</Label>
                                <Input type="text" {...getFieldProps('bank_name')} />
                                <ErrorMessage name="bank_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Account Owner</Label>
                                <Input type="text" {...getFieldProps('account_owner')} />
                                <ErrorMessage name="account_owner" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Account IBAN</Label>
                                <Input type="text" {...getFieldProps('account_IBAN')} />
                                <ErrorMessage name="account_IBAN" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Limit</Label>
                                <Input type="text" {...getFieldProps('limit')} />
                                <ErrorMessage name="limit" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>API</Label>
                                <Input type="text" {...getFieldProps('api')} />
                                <ErrorMessage name="api" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>

                        <Col sm="12">
                            <FormGroup>
                                <Label>Approval Type</Label>
                                <Typeahead
                                    options={ApprovalType}
                                    placeholder="Choose Approval Type"
                                    id="approval_type"
                                    onChange={handleApprovalTypeSelection}
                                    clearButton
                                />
                                {touched.approval_type && errors.approval_type && <ErrorMessage name="approval_type" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={handleClose}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" name="submit">{isLoading ? "Loading.." : "Submit"} </Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default AddBank