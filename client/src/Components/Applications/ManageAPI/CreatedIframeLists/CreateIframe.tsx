import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, StateOfUsa, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IFRAME_API_URL, PAYMENT_API_URL, axiosPrivate } from '@/security/axios';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { addIframeValidationSchema } from '@/Components/validation/validation';
import { toast } from 'react-toastify';

type Props = {
    createIframeModalOpen: boolean,
    setcreateIframeModalOpen: React.Dispatch<SetStateAction<boolean>>
}


const CreateIframe: FC<Props> = ({ createIframeModalOpen, setcreateIframeModalOpen }) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [methodList, setMethodList] = useState<any[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<any>(null);

    const modalToggle = () => {
        resetForm();
        setcreateIframeModalOpen(!createIframeModalOpen);
    }

    const handleClose = () => {
        resetForm();
        modalToggle();
    }

    const { data: methodsData } = useQuery('methods', async () => {
        const response = await axiosPrivate.get(PAYMENT_API_URL.getAllMethods);
        return response.data.result;
    }, {
        retry: false,
    });

    useEffect(() => {
        if (methodsData) {
            setMethodList(methodsData.map((method: any) => ({
                id: method._id,
                gateway_name: method.gateway_name
            })));
        }
    }, [methodsData]);

    const formik = useFormik({
        initialValues: {
            user_id: "",
            user_name: "",
            iframe_name: "",
            url: "",
            method_id: "",
        },
        validationSchema: addIframeValidationSchema,
        onSubmit: async (_, { resetForm }) => {
            values.method_id = selectedMethod.id;
            await addIframeApi({
                ...formik.values,
            });
        },
    })


    const { mutateAsync: addIframeApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.post(IFRAME_API_URL.addIframe, data);
                setIsLoading(false);
                if (response.status == 201) {
                    toast.success("Iframe created successfully");
                    queryClient.invalidateQueries('getIframeApi')
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
            } finally {
                setIsLoading(false)
            }
        }
    );

    const {
        handleSubmit,
        getFieldProps,
        setFieldValue,
        setFieldError,
        touched,
        errors,
        values,
        resetForm,
    } = formik;

    const handleMethodSelection = (selected: any) => {
        setSelectedMethod(selected[0]);
        setFieldValue('method_id', selected[0]?.id);
    };

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Create IFrame
        </div>
    )
    const Footer = () => (
        <>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Create Iframe</Button>
        </>
    )

    return (
        <CommonModal size="lg" isOpen={createIframeModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
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
                                    id="method_id"
                                    labelKey="gateway_name"
                                    onChange={handleMethodSelection}
                                    clearButton
                                />
                                {touched.method_id && errors.method_id && <ErrorMessage name="method_id" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={handleClose}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" name="submit">{isLoading ? "Loading.." : "Add Domain"} </Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default CreateIframe