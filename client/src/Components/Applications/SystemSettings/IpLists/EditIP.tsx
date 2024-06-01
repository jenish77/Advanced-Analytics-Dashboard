import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, Countries, StateOfUsa, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { IpListsType } from '@/Types/SystemSettings';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DEALER_API_URL, IP_ADDRESS_API_URL, MERCHANT_API_URL, axiosPrivate } from '@/security/axios';
import { toast } from 'react-toastify';
import { addIpAddressValidationSchema } from '@/Components/validation/validation';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';

type Props = {
    editIP: IpListsType | undefined | any,
    editIPModalOpen: boolean,
    seteditIPModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditIP: FC<Props> = ({ editIP, editIPModalOpen, seteditIPModalOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [merchantList, setMerchantList] = useState<any[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<any[]>([]);
    const [selectedMerchantName, setSelectedMerchantName] = useState<any[]>([]);
    const [editData, setEditData] = useState<any>({ ip_address: editIP?.ip_address, merchant_id: editIP?.merchant.merchant_id, country: editIP?.country });
    const [selectedCountry, setSelectedCountry] = useState<string>(editIP?.country || "");
    const queryClient = useQueryClient();

    const { data: usersData } = useQuery('users', async () => {
        const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
        return response.data.result;
    }, {
        retry: false,
    });

    useEffect(() => {
        setEditData({ ip_address: editIP?.ip_address, merchant_id: editIP?.merchant.merchant_id, country: editIP?.country })
        if (usersData) {
            setMerchantList(usersData.map((user: any) => ({
                id: user._id,
                first_name: user.first_name,
                merchant_id: user._id
            })));
        }
        if (editIP) {
            setSelectedMerchant([editIP?.merchant?.merchant_id]);
            setSelectedMerchantName([editIP?.merchant?.name]);
        }
    }, [usersData, editIP]);

    const modalToggle = () => {
        resetForm();
        seteditIPModalOpen(!editIPModalOpen);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { ip_address: "", merchant_id: "", country: "" },
        validationSchema: addIpAddressValidationSchema,
        onSubmit: async (values) => {
            await editIpAddressApi({ ...values, merchant_id: selectedMerchant })
            resetForm();
        },
    })

    const { mutateAsync: editIpAddressApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const merchantId = data.merchant_id[0];
                const requestData = { ...data, merchant_id: merchantId, _id: editIP._id };
                const response = await axiosPrivate.put(IP_ADDRESS_API_URL.editIpAddress, requestData);
                setIsLoading(false);
                if (response.status == 200) {
                    toast.success("Ip address updated successfully");
                    queryClient.invalidateQueries('getIpAddressApi')
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
            Edit IP
        </div>
    )

    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit IP</Button> */}
        </>
    )

    const handleSelectionChange = (selected: any[]) => {
        const selectedMerchantIds = selected.map((merchant) => merchant.id);
        const selectedMerchantNames = selected.map((merchant) => merchant.first_name);
        formik.setValues({
            ...values,
            merchant_id: selected.length > 0 ? selected[0].id : ""
        });
        setSelectedMerchant(selectedMerchantIds);
        setSelectedMerchantName(selectedMerchantNames);
    };

    const handleCountryChange = (selected: any[]) => {
        formik.setValues({
            ...values,
            country: selected[0] || "",
        });
        setSelectedCountry(selected.length > 0 ? selected[0] : "");
    };

    return (
        <CommonModal size="lg" isOpen={editIPModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">IP Address</Label>
                                <Input type="text" {...getFieldProps("ip_address")} />
                                {touched.ip_address && errors.ip_address && <ErrorMessage name="ip_address" component="span" className="pt-1 text-danger" />}
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
                        <Col sm="12">
                            <FormGroup>
                                <Label>Country</Label>
                                <Typeahead
                                    options={Countries}
                                    placeholder="Choose Country"
                                    id="Basic TypeAhead"
                                    onChange={handleCountryChange}
                                    defaultInputValue={editIP?.country}
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

export default EditIP