import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { Href } from "@/Constant";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { MethodSettingsType } from '@/Types/SystemSettings';
import SVG from "@/CommonComponent/SVG";
import Link from "next/link";
import { useDropzone } from 'react-dropzone';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify';
import { PAYMENT_API_URL, axiosPrivate, CURRENCY_API_URL, MERCHANT_API_URL } from '@/security/axios';
import { addMethodValidationSchema } from '@/Components/validation/validation';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { Typeahead } from 'react-bootstrap-typeahead';

type Props = {
    editMethod: MethodSettingsType | undefined,
    editMethodModalOpen: boolean,
    seteditMethodModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditMethod: FC<Props> = ({ editMethod, editMethodModalOpen, seteditMethodModalOpen }) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const [currency, setCurrency] = useState<any[]>([]);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const handleCurrencyToggleMenu = () => setCurrencyOpen(!currencyOpen);
    const [businessSelectedOption, setBusinessSelectedOption] = useState([]);
    const [countrySelectedOption, setCountrySelectedOption] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState<any[]>([]);

    const handleCurrencySelectionChange = (selected: any[]) => {
        setSelectedCurrency(selected);
        const selectedCurrencyValues = selected.map((option: any) => option.id);
        formik.setValues((values: any) => ({
            ...values,
            allow_currency: selectedCurrencyValues,
        }));
    };

    useEffect(() => {
        if (editMethod && editMethod.image) {
            setPreview(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE}/methodImg/${editMethod?.image}`);
        } else {
            setPreview(null);
        }
    }, [editMethod]);


    useEffect(() => {
        setFormData(editMethod);
    }, [editMethod]);

    const modalToggle = () => {
        setUploadedFile(null)
        resetForm();
        seteditMethodModalOpen(!editMethodModalOpen);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: formData,
        validationSchema: addMethodValidationSchema,
        onSubmit: async (values) => {
            await editMethodApi(values)
            resetForm();
        },
    })

    const { mutateAsync: editMethodApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.put(PAYMENT_API_URL.editMethod, data);
                setIsLoading(false);
                if (response.status == 200) {
                    toast.success("Method update successfully");
                    setFormData(data);
                    queryClient.invalidateQueries('getAllMethodsApi')
                    modalToggle()
                }
            } catch (error) {
                const errorData = error?.response.data;
                if (errorData?.error && errorData.statusCode == 400) {
                    Object.keys(errorData?.error).forEach((key) => {
                        setFieldError(key, errorData?.error[key]);
                    });
                } else if (errorData?.message) {
                    toast.error(errorData?.message);
                }
                else if (errorData.statusCode == 403) {
                    toast.error("Permission Denied");
                    modalToggle()
                    resetForm()
                }
                setIsLoading(false);
            }
        }
    );

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-pencil" />
            Edit Payment Gateway
        </div>
    )

    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Method</Button> */}
        </>
    )

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        setPreview(URL.createObjectURL(file));
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosPrivate.post(PAYMENT_API_URL.uploadImage, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                }
            });
            if (response.status === 201) {
                formik.setValues({ ...formik.values, image: response.data.result });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        }
    }, [formik]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: {
            'image/png': [],
            'image/jpeg': [],
            'image/svg': [],
            'image/webp': [],
            'image/gif': [],
            'image/jpg': [],
        }
    });

    const {
        handleSubmit,
        getFieldProps,
        setFieldError,
        errors,
        touched,
        values,
        resetForm
    } = formik;

    const currencyDataApi = async () => {
        const response = await axiosPrivate.get(CURRENCY_API_URL.getCurrencyDetail);

        let currencyArray: any = []
        let selectedCurrencyArray: any = []
        if (response.data) {
            response.data.allCurrencies?.map((currency: any) => {
                const currencyObject = {
                    name: currency?.currency_name,
                    id: currency?._id
                }
                currencyArray.push(currencyObject)
            })
            setCurrency(currencyArray)
            if (editMethod) {
                response.data.allCurrencies?.map((currency: any) => {
                    if (editMethod && currency) {
                        const allowCurrencyIds = Array.isArray(editMethod?.allow_currency) ? editMethod?.allow_currency.map((currencyId: any) => currencyId._id) : [];

                        if (allowCurrencyIds.includes(currency._id)) {
                            const object = {
                                name: currency.currency_name,
                                id: currency._id
                            };
                            selectedCurrencyArray.push(object);
                        }
                    }
                })
                setSelectedCurrency(selectedCurrencyArray);
            }
        }
        return response.data
    }

    useEffect(() => {
        if (editMethodModalOpen) {
            currencyDataApi();
        }
    }, [editMethodModalOpen])

    return (
        <CommonModal size="lg" isOpen={editMethodModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <Row className='d-flex g-3'>
                                <Col md="12" lg="8" className='col1 h-100'>
                                    <Col sm="12">
                                        <FormGroup>
                                            <Label htmlFor="first-name">Gateway Name</Label>
                                            <Input type="text" {...getFieldProps("gateway_name")} />
                                            <ErrorMessage name="gateway_name" component="span" className="pt-1 text-danger" />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12">
                                        <FormGroup>
                                            <Label>Auto Reject Minimum</Label>
                                            <Input type="number" {...getFieldProps("auto_reject")} />
                                            <ErrorMessage name="auto_reject" component="span" className="pt-1 text-danger" />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12">
                                        <FormGroup>
                                            <Label>Select Currency</Label>
                                            <Typeahead
                                                id='currency-type'
                                                options={currency}
                                                labelKey="name"
                                                placeholder="Select Currency"
                                                open={currencyOpen}
                                                onFocus={handleCurrencyToggleMenu}
                                                onBlur={handleCurrencyToggleMenu}
                                                onChange={handleCurrencySelectionChange}
                                                selected={selectedCurrency}
                                                clearButton
                                                multiple
                                            />
                                            {touched.allow_currency && errors.allow_currency && <ErrorMessage name="allow_currency" component="span" className="pt-1 text-danger" />}
                                        </FormGroup>
                                    </Col>
                                    {/* <Col sm="12">
                                        <FormGroup>
                                            <Label>API key</Label>
                                            <Input type="text" {...getFieldProps("api_key")} />
                                            <ErrorMessage name="api_key" component="span" className="pt-1 text-danger" />
                                        </FormGroup>
                                    </Col> */}
                                </Col>
                                <Col md="12" lg="4" className='col2'>
                                    <Label>Gateway Image</Label>
                                    <div className='w-full'>
                                        <div {...getRootProps()} className={`dropzon_container ${(isDragActive) && "dropzon_container_active"}`}>
                                            <input {...getInputProps()} />
                                            {
                                                (preview && !isDragActive) ?
                                                    <img
                                                        src={preview}
                                                        alt={formData?.image}
                                                        onError={(e: any) => {
                                                            e.target.src = '/assets/images/dummy.webp';
                                                        }}
                                                    />
                                                    :
                                                    <div className='d-flex flex-column justify-content-center align-items-center h-100 w-full gap-2'>
                                                        <SVG iconId="file-upload" />
                                                        <p>Drag your image here, or
                                                            <Link className="txt-primary" href={Href}>&nbsp;browser</Link>
                                                        </p>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>

                        {/* <Col sm="12">
                            <FormGroup>
                                <Label>Secret key</Label>
                                <Input type="text" {...getFieldProps("secret_key")} />
                                <ErrorMessage name="secret_key" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col> */}
                        <Col sm="12">
                            <FormGroup>
                                <Label>Payment Gatway Can Use In</Label>
                                <Row className='gap-y-2 mt-2'>

                                    <Col sm="4" className='d-flex justify-content-center align-items-center gap-2'>
                                        <Label htmlFor={`Deposit`} className='' style={{ cursor: "pointer" }}>Deposit</Label>
                                        <CommonSwitch
                                            defaultChecked={formik?.values?.deposit}
                                            onChange={(value: any) => formik.setFieldValue('deposit', value)}
                                            style={{ width: '32px', height: '18px' }}
                                        />
                                    </Col>
                                    <Col sm="4" className='d-flex justify-content-center align-items-center gap-2'>
                                        <Label htmlFor={`Withdrawls`} className='' style={{ cursor: "pointer" }}>Withdrawls</Label>
                                        <CommonSwitch
                                            defaultChecked={formik?.values?.withdraw}
                                            onChange={(value: any) => formik.setFieldValue('withdraw', value)}
                                            style={{ width: '32px', height: '18px' }}
                                        />
                                    </Col>
                                    <Col sm="4" className='d-flex justify-content-center align-items-center gap-2'>
                                        <Label htmlFor={`ApiAccess`} className='' style={{ cursor: "pointer" }}>API Access</Label>
                                        <CommonSwitch
                                            defaultChecked={formik?.values?.iFrame_access}
                                            onChange={(value: any) => formik.setFieldValue('iFrame_access', value)}
                                            style={{ width: '32px', height: '18px' }}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Row>
                                    <Col sm="12" md="6">
                                        <Label>Minimum Transaction</Label>
                                        <Input
                                            {...getFieldProps("min_transaction")}
                                            type="number"
                                            min="0"
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        <ErrorMessage name="min_transaction" component="span" className="pt-1 text-danger" />
                                    </Col>
                                    <Col sm="12" md="6">
                                        <Label>Maximum Transaction</Label>
                                        <Input
                                            {...getFieldProps("max_transaction")}
                                            type="number"
                                            min="0"
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        <ErrorMessage name="max_transaction" component="span" className="pt-1 text-danger" />
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Update"}</Button>
                    </div>
                </Form>
            </FormikProvider>
        </CommonModal>
    )
}

export default EditMethod