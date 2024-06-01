import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal';
import { addDomainValidationSchema } from '@/Components/validation/validation';
import { DOMAIN_API_URL, MERCHANT_API_URL, axiosPrivate } from '@/security/axios';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import React, { FC, SetStateAction, useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

type Props = {
    addDomainModalOpen: boolean,
    setaddDomainModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddDomain: FC<Props> = ({ addDomainModalOpen, setaddDomainModalOpen }) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [merchantList, setMerchantList] = useState<any[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<any>(null);

    const modalToggle = () => {
        resetForm();
        setaddDomainModalOpen(!addDomainModalOpen)
    }

    const handleClose = () => {
        resetForm();
        modalToggle();
    }

    const { data: usersData } = useQuery('users', async () => {
        const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
        return response.data.result;
    }, {
        retry: false,
    });

    useEffect(() => {
        if (usersData) {
            setMerchantList(usersData.map((user: any) => ({
                id: user._id,
                first_name: user.first_name
            })));
        }
    }, [usersData]);

    const formik = useFormik({
        initialValues: {
            domain_name: "",
            merchant_id: "",
        },
        validationSchema: addDomainValidationSchema,
        onSubmit: async (_, { resetForm }) => {
            values.merchant_id = selectedMerchant.id;
            await addDomainApi({
                ...formik.values,
            });
        },
    })

    const { mutateAsync: addDomainApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.post(DOMAIN_API_URL.addDomain, data);
                setIsLoading(false);
                if (response.status == 201) {
                    toast.success("Domain created successfully");
                    queryClient.invalidateQueries('getDomainApi')
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

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-plus" />
            Add Domain
        </div>
    )

    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Domain</Button> */}
        </>
    )

    const handleMerchantSelection = (selected: any) => {
        setSelectedMerchant(selected[0]);
        setFieldValue('merchant_id', selected[0]?.id);
    };

    return (
        <CommonModal size="lg" isOpen={addDomainModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">Domain Name</Label>
                                <Input type="text" {...getFieldProps('domain_name')} />
                                <ErrorMessage name="domain_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Select Merchant</Label>
                                <Typeahead
                                    options={merchantList}
                                    placeholder="Choose Merchant"
                                    id="merchant_id"
                                    labelKey="first_name"
                                    onChange={handleMerchantSelection}
                                    clearButton
                                />
                                {touched.merchant_id && errors.merchant_id && <ErrorMessage name="merchant_id" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={handleClose}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" name="submit" disabled={isLoading} >{isLoading ? "Loading.." : "Submit"} </Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default AddDomain