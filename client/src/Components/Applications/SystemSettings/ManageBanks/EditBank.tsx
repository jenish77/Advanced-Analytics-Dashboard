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
import { addBankValidationSchema } from '@/Components/validation/validation';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';

type Props = {
    editBank: ManageBanksType | undefined | any,
    editBankModalOpen: boolean,
    seteditBankModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditBank: FC<Props> = ({ editBank, editBankModalOpen, seteditBankModalOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedUserName, setSelectedUserName] = useState<any[]>([]);
    const [selectedApprovalType, setSelectedApprovalType] = useState<string>(editBank?.approval_type || "");
    const [editData, setEditData] = useState<any>(
        {
            company_name: editBank?.company_name,
            user_name: editBank?.user_name._id,
            approval_type: editBank?.approval_type,
            bank_name: editBank?.bank_name,
            account_owner: editBank?.account_owner,
            account_IBAN: editBank?.account_IBAN,
            limit: editBank?.limit,
            api: editBank?.api
        }
    );
    const queryClient = useQueryClient();

    // const { data: usersData } = useQuery('users', async () => {
    //     const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
    //     return response.data.result;
    // }, {
    //     retry: false,
    // });

    useEffect(() => {
        setEditData({
            company_name: editBank?.company_name,
            user_name: editBank?.user_name._id,
            approval_type: editBank?.approval_type,
            bank_name: editBank?.bank_name,
            account_owner: editBank?.account_owner,
            account_IBAN: editBank?.account_IBAN,
            limit: editBank?.limit,
            api: editBank?.api
        })
        // if (usersData) {
        //     setUserList(usersData.map((user: any) => ({
        //         id: user._id,
        //         first_name: user.first_name,
        //         user_name: user._id
        //     })));
        // }
        if (editBank) {
            setSelectedUser([editBank?.user_name?._id]);
            setSelectedUserName([editBank?.user_name?.first_name]);
        }
    }, [editBank]);

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
        if (editBankModalOpen) {
            fetchMerchantList();
        }
    }, [editBankModalOpen]);
    
    const modalToggle = () => {
        resetForm();
        seteditBankModalOpen(!editBankModalOpen);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { company_name: "", user_name: "", approval_type: "", bank_name: "", account_owner: "", account_IBAN: "", limit: "", api: "" },
        validationSchema: addBankValidationSchema,
        onSubmit: async (values) => {
            await editBankApi({ ...values, user_name: selectedUser })
        },
    })

    const { mutateAsync: editBankApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const userName = data.user_name[0];
                const requestData = { ...data, user_name: userName, _id: editBank._id };
                const response = await axiosPrivate.put(BANK_API_URL.editBankDetails, requestData);
                if (response.status == 200) {
                    toast.success("Bank updated successfully");
                    queryClient.invalidateQueries('getBankApi')
                    modalToggle()
                }
                setIsLoading(false);
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



    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-pencil" />
            Edit Bank
        </div>
    )

    const handleSelectionChange = (selected: any[]) => {
        const selectedUserIds = selected.map((user_name) => user_name.id);
        const selectedUserNames = selected.map((user_name) => user_name.first_name);
        formik.setValues({
            ...values,
            user_name: selected.length > 0 ? selected[0].id : ""
        });
        setSelectedUser(selectedUserIds);
        setSelectedUserName(selectedUserNames);
    };

    const handleApprovalTypeChange = (selected: any[]) => {
        formik.setValues({
            ...values,
            approval_type: selected[0] || "",
        });
        setSelectedApprovalType(selected.length > 0 ? selected[0] : "");
    };



    return (
        <CommonModal size="lg" isOpen={editBankModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Select User</Label>
                                <Typeahead
                                    options={userList}
                                    placeholder="Choose User"
                                    id="Basic TypeAhead"
                                    labelKey="first_name"
                                    onChange={handleSelectionChange}
                                    selected={selectedUserName}
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
                                    id="Basic TypeAhead"
                                    onChange={handleApprovalTypeChange}
                                    defaultInputValue={editBank?.approval_type}
                                    clearButton
                                />
                                {touched.approval_type && errors.approval_type && <ErrorMessage name="approval_type" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" name="submit">{isLoading ? "Loading.." : "Update"} </Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default EditBank