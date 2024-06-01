import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { DomainListType } from '@/Types/SystemSettings';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addDomainValidationSchema, addIframeValidationSchema } from '@/Components/validation/validation';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { DEALER_API_URL, DOMAIN_API_URL, IFRAME_API_URL, MERCHANT_API_URL, PAYMENT_API_URL, axiosPrivate } from '@/security/axios';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';
import { CreatedIFrameListsType } from '@/Types/ManageApiType';

type Props = {
    editIframe: CreatedIFrameListsType | undefined | any,
    editIframeModalOpen: boolean,
    seteditIframeModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditIframe: FC<Props> = ({ editIframe, editIframeModalOpen, seteditIframeModalOpen }) => {
    const [formData, setFormData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [methodList, setMethodList] = useState<any[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<any[]>([]);
    const [selectedMethodName, setSelectedMethodName] = useState<any[]>([]);
    const [editData, setEditData] = useState<any>({
        user_id: editIframe?.user_id,
        user_name: editIframe?.user_name,
        iframe_name: editIframe?.iframe_name,
        url: editIframe?.url,
        method_id: editIframe?.method.method_id
    });
    const queryClient = useQueryClient();

    const { data: methodsData } = useQuery('methods', async () => {
        const response = await axiosPrivate.get(PAYMENT_API_URL.getAllMethods);
        return response.data.result;
    }, {
        retry: false,
    });

    useEffect(() => {
        setEditData({
            user_id: editIframe?.user_id,
            user_name: editIframe?.user_name,
            iframe_name: editIframe?.iframe_name,
            url: editIframe?.url,
            method_id: editIframe?.method.method_id
        })
        if (methodsData) {
            setMethodList(methodsData.map((method: any) => ({
                id: method._id,
                name: method.gateway_name,
                method_id: method._id
            })));
        }
        if (editIframe) {
            setSelectedMethod([editIframe?.method?.method_id]);
            setSelectedMethodName([editIframe?.method?.name]);
        }
    }, [methodsData, editIframe]);

    const modalToggle = () => {
        resetForm();
        seteditIframeModalOpen(!editIframeModalOpen);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { user_id: "", user_name: "", iframe_name: "", url: "", method_id: "" },
        validationSchema: addIframeValidationSchema,
        onSubmit: async (values) => {
            await editIframeApi({ ...values, method_id: selectedMethod })
        },
    })

    const { mutateAsync: editIframeApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const methodId = data.method_id[0];
                const requestData = { ...data, method_id: methodId, _id: editIframe._id };
                const response = await axiosPrivate.put(IFRAME_API_URL.editIframe, requestData);
                setIsLoading(false);
                if (response.status == 200) {
                    toast.success("Iframe updated successfully");
                    setFormData(data);
                    resetForm();
                    queryClient.invalidateQueries('getIframeApi')
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
            Edit IFrame
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Domain</Button> */}
        </>
    )

    const handleSelectionChange = (selected: any[]) => {
        setSelectedMethodName(selected.map((method) => method.name));
        setSelectedMethod(selected.map((method) => method.id));
        formik.setValues({
            ...values,
            method_id: selected.length > 0 ? selected[0].id : ""
        });
    };
    
    return (
        <CommonModal size="lg" isOpen={editIframeModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="username">User ID</Label>
                                <Input type="text" {...getFieldProps('user_id')} />
                                <ErrorMessage name="user_id" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="username">User Name</Label>
                                <Input type="text" {...getFieldProps('user_name')} />
                                <ErrorMessage name="user_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>IFrame Name</Label>
                                <Input type="text" {...getFieldProps('iframe_name')} />
                                <ErrorMessage name="iframe_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>URL</Label>
                                <Input type="text" {...getFieldProps('url')} />
                                <ErrorMessage name="url" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Method</Label>
                                <Typeahead
                                    options={methodList}
                                    placeholder="Choose Method"
                                    id="Basic TypeAhead"
                                    labelKey="name"
                                    onChange={handleSelectionChange}
                                    selected={selectedMethodName}
                                    clearButton
                                />
                                {touched.method_id && errors.method_id && <ErrorMessage name="method_id" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit">{isLoading ? "Loading..." : "Submit"}</Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default EditIframe