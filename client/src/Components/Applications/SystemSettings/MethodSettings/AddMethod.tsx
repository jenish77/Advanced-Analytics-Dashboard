import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useCallback, useState, useEffect, useMemo } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { addMethodValidationSchema } from '@/Components/validation/validation';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { PAYMENT_API_URL, CURRENCY_API_URL} from "@/security/axios";
import { useAppDispatch } from "@/Redux/Hooks";
import { useDropzone } from 'react-dropzone';
import { Href } from '@/Constant';
import SVG from '@/CommonComponent/SVG';
import Link from 'next/link';
import { Typeahead } from 'react-bootstrap-typeahead';

type Props = {
    addMethodModalOpen: boolean,
    setaddMethodModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddMethod: FC<Props> = ({ addMethodModalOpen, setaddMethodModalOpen }) => {

    // Reset selectedCurrency when modal is closed
    useEffect(() => {
        if (!addMethodModalOpen) {
            setSelectedCurrency([]);
        }
    }, [addMethodModalOpen]);
    // ------------------------------- VARIABLES ------------------------------- //

    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [withdrawToggle, setWithdrawToggle] = useState(true);
    const [depositeToggle, setDepositeToggle] = useState(true);
    const [countrySelectedOption, setCountrySelectedOption] = useState([]);
    const [apiAccessToggle, setApiAccessToggle] = useState(true);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const [currency, setCurrency] = useState<any[]>([]);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<any[]>([]);

    // Selected Currency
    const handleCurrencyToggleMenu = () => setCurrencyOpen(!currencyOpen);

    const handleCurrencySelectionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("name", "Currency Field is required")
        } else {
            setFieldError("name", "")
        }
        setSelectedCurrency(selected);
        const selectedCurrencyValues = selected.map((option: any) => option.id);
        values.allow_currency = selectedCurrencyValues;
    };

    const modalToggle = () => {
        resetForm();
        setUploadedFile(null)
        setPreview(null)
        setaddMethodModalOpen(!addMethodModalOpen)
    }

    const handleClose = () => {
        resetForm();
        modalToggle();
    }

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Add New Payment Gateway
        </div>
    )

    const Footer = () => (
        <>
            <Button color="primary pt-2 pb-2" type="submit" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" type="submit" name="submit">{isLoading ? "Loading.." : "Add Method"} </Button>
        </>
    )

    const withdrawToggleFun = (newValue: boolean) => {
        setWithdrawToggle(newValue);
        formik.setFieldValue("withdraw", newValue);
    }

    const depositeToggleFun = (newValue: boolean) => {
        setDepositeToggle(newValue);
        formik.setFieldValue("deposit", newValue);
    }

    const apiAccessToggleFun = (newValue: boolean) => {
        setApiAccessToggle(newValue);
        formik.setFieldValue("iFrame_access", newValue);
    }

    const dispatch = useAppDispatch()

    // ------------------------------- FORMIK FUNCTIONS ------------------------------- //
    const formik = useFormik({
        initialValues: {
            gateway_name: "",
            // api_key: "",
            // secret_key: "",
            min_transaction: "",
            max_transaction: "",
            allow_currency: [],
            auto_reject: "",
            deposit: false,
            withdraw: false,
            iFrame_access: false,
            image: image,
        },
        validationSchema: addMethodValidationSchema,
        onSubmit: async (_, { resetForm }) => {

            await addMethodApi({
                ...formik.values,
                deposit: depositeToggle,
                withdraw: withdrawToggle,
                iFrame_access: apiAccessToggle,
                image: image
            });
        },
    })

    const { mutateAsync: addMethodApi } = useMutation(
        async (data: any) => {

            try {
                setIsLoading(true)
                const response = await axiosPrivate.post(PAYMENT_API_URL.addMethod, data);

                setIsLoading(false);
                if (response.status == 201) {
                    toast.success("Method created successfully");
                    queryClient.invalidateQueries('getAllMethodsApi')
                    modalToggle()
                    resetForm()

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
            setImage(response.data.result);

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
            'image/avif': []
        }
    });

    const { handleSubmit, getFieldProps, setFieldError, touched, errors, values, resetForm, setTouched } = formik;

    const currencyDataApi = async () => {
        const response = await axiosPrivate.get(CURRENCY_API_URL.getCurrencyDetail);
        let currencyArray: any = []
        if (response.data) {
            currencyArray = response.data.allCurrencies.map((currency: any) => ({
                _id: currency._id,
                currency_name: currency.currency_name
            }));
            setCurrency(currencyArray.map((currency: any) => {
                return {
                    name: currency.currency_name,
                    id: currency._id
                }
            }));
        }
        return response.data
    }

    useEffect(() => {
        if (addMethodModalOpen) {
            currencyDataApi();
        }
    }, [addMethodModalOpen])
    
    return (
        <CommonModal size="lg" isOpen={addMethodModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
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
                                    </Col>
                                    <Col sm="12">
                                        <FormGroup>
                                            <Label>Secret key</Label>
                                            <Input type="text" {...getFieldProps("secret_key")} />
                                            <ErrorMessage name="secret_key" component="span" className="pt-1 text-danger" />
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
                                                        alt={uploadedFile?.name}
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
                                        <ErrorMessage name="image" component="span" className="pt-1 text-danger" />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <br />
                                <Label>Payment Gatway Can Use In</Label>
                                <Row className='gap-y-2 mt-2'>
                                    <Col sm="4" className='d-flex justify-content-center align-items-center gap-2'>
                                        <Label htmlFor={`Deposit`} className='' style={{ cursor: "pointer" }}>Deposit</Label>
                                        <CommonSwitch defaultChecked={depositeToggle} onChange={depositeToggleFun} style={{ width: '32px', height: '18px' }} />
                                    </Col>
                                    <Col sm="4" className='d-flex justify-content-center align-items-center gap-2'>
                                        <Label htmlFor={`Withdrawls`} className='' style={{ cursor: "pointer" }}>Withdrawls</Label>
                                        <CommonSwitch defaultChecked={withdrawToggle} onChange={withdrawToggleFun} style={{ width: '32px', height: '18px' }} />
                                    </Col>
                                    <Col sm="4" className='d-flex justify-content-center align-items-center gap-2'>
                                        <Label htmlFor={`ApiAccess`} className='' style={{ cursor: "pointer" }}>API Access</Label>
                                        <CommonSwitch defaultChecked={apiAccessToggle} onChange={apiAccessToggleFun} style={{ width: '32px', height: '18px' }} />
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
                        {/* <Footer /> */}
                        <Button color="primary pt-2 pb-2" onClick={handleClose}>Close</Button>
                        <Button color="primary pt-2 pb-2" type="submit" name="submit" disabled={isLoading}>{isLoading ? "Loading.." : "Submit"}</Button>
                    </div>
                </Form>
            </FormikProvider >
        </CommonModal>
    )
}

export default AddMethod