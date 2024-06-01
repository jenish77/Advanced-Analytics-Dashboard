import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { BUSINESS_TYPE_URL, CURRENCY_API_URL, axiosPrivate } from '@/security/axios';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { BusinessTypeValidationSchema, addCurrencyValidationSchema } from '@/Components/validation/validation';
import { BusinesstypeListType } from '@/Types/UserListType';

type Props = {
    editBusiness: BusinesstypeListType | undefined | any,
    editBusinessModalOpen: boolean,
    seteditBusinessModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditCurrency: FC<Props> = ({ editBusiness, editBusinessModalOpen, seteditBusinessModalOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState<any>({ business_type: editBusiness?.business_type });
    const queryClient = useQueryClient();

    const modalToggle = () => {
        resetForm();
        seteditBusinessModalOpen(!editBusinessModalOpen);
    }

    useEffect(() => {
        setEditData({
            business_type: editBusiness?.business_type || '',
        });
    }, [editBusiness]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { business_type: "" },
        validationSchema: BusinessTypeValidationSchema,
        onSubmit: async (values) => {
            await editBusinessApi(values)
            resetForm();
        },
    })

    const { mutateAsync: editBusinessApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const requestData = { ...data, _id: editBusiness._id };
                const response = await axiosPrivate.put(BUSINESS_TYPE_URL.editBusinessTypeDetails, requestData);
                setIsLoading(false);
                if (response.status == 200) {
                    toast.success("Business type updated successfully");
                    queryClient.invalidateQueries('businesstype')
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
            Edit Business Type
        </div>
    )


    return (
        <CommonModal  isOpen={editBusinessModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">Business Type</Label>
                                <Input type="text" {...getFieldProps('business_type')} />
                                {touched.business_type && errors.business_type && <ErrorMessage name="business_type" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2">
                        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Update"}</Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default EditCurrency