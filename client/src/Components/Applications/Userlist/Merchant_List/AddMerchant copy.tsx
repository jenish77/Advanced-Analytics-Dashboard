import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, LastName, MobileNo, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, BussinessTypeList, Countries, StateOfUsa, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { Typeahead } from 'react-bootstrap-typeahead';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import { addMerchantValidationSchema } from '@/Components/validation/validation';
import useAxiosPrivate from '@/security/useAxiosPrivate';
import { toast } from 'react-toastify';
import { DEALER_API_URL, MERCHANT_API_URL, PAYMENT_API_URL } from '@/security/axios';
import { PhoneInput } from 'react-international-phone';
import SweetAlert from "sweetalert2";

type Props = {
    addMerchantModalOpen: boolean,
    refetch: any,
    setAddMerchantModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const AddMerchant: FC<Props> = ({ addMerchantModalOpen, refetch, setAddMerchantModalOpen }) => {

    // ------------------------------- VARIABLES ------------------------------- //

    const axiosPrivate = useAxiosPrivate();
    const [phone, setPhone] = useState('');
    const [dealerSelectedOption, setDealerSelectedOption] = useState([]);
    const [businessSelectedOption, setBusinessSelectedOption] = useState([]);
    const [countrySelectedOption, setCountrySelectedOption] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [businessTypeList, setBusinessTypeList] = useState([]);
    const [countryOpen, setCountryOpen] = useState(false);
    const [dealerOpen, setDealerOpen] = useState(false);
    const [businessOpen, setBusinessOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [depositArray, setDepositArray] = useState([]);
    const [withdrawArray, setWithdrawArray] = useState([]);
    const [depositAr, setDepositAr] = useState<any>([]);
    const [withdrawAr, setWithdrawAr] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currency, setCurrency] = useState<any[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<any[]>([]);

    const initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        business_name: "",
        location: "",
        dealer: "",
        deposit: [],
        withdraw: [],
        business_type: "",
        allow_currency: []
    }

    // ------------------------------- COMMON FUNCTIONS ------------------------------- //

    const modalToggle = () => setAddMerchantModalOpen(!addMerchantModalOpen);

    const handleDealerToggleMenu = () => setDealerOpen(!dealerOpen);
    const handleCountryToggleMenu = () => setCountryOpen(!countryOpen);
    const handleBusinessToggleMenu = () => setBusinessOpen(!businessOpen);
    const handleCurrencyToggleMenu = () => setCurrencyOpen(!currencyOpen);

    const handleCountrySelectionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("location", "Location Field is required")
        } else {
            setFieldError("location", "")
        }
        setCountrySelectedOption(selected);
        values.location = selected[0]
    };

    const handleDealerSelectionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("dealer", "Dealer Field is required")
        } else {
            setFieldError("dealer", "")
        }
        setDealerSelectedOption(selected);
        values.dealer = selected[0]
    };

    const handleBusinessSelectionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("businessType", "Location Field is required")
        } else {
            setFieldError("businessType", "")
        }
        setBusinessSelectedOption(selected);
        values.business_type = selected[0]
    };

    const handleCurrencySelectionChange = (selected: string | any) => {
        if (selected && selected.length == 0) {
            setFieldError("Currency", "Currency Field is required")
        } else {
            setFieldError("currency", "")
        }
        setSelectedCurrency(selected);
        values.allow_currency = selected[0]
    };

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Add Merchant
        </div>
    )

    const getCurrencyData: any = useMemo(() => ["getAllCurrencies"], []);
    const { data: getAllCurrency, isLoading: currencyLoading } = useQuery(
        getCurrencyData,
        async () => {
            const response = await axiosPrivate.get(MERCHANT_API_URL.getActiveCurrency);
            let currencyArray: any = []
            if (response.data) {
                response.data.allCurrencies.map((currency: any) => currencyArray.push(currency.currency_name))
            }
            setCurrency(currencyArray)
            return response.data
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );            

    const getDealersData: any = useMemo(() => ["getAllDealers"], []);
    const { data: getAllDealers, isFetching: isLoadingProfile } = useQuery(
        getDealersData,
        async () => {
            const response = await axiosPrivate.get(DEALER_API_URL.getDealersNames);
            let dealersArray: any = []
            let businessTypeArray: any = []
            if (response.data) {
                response.data.allDealers.map((dealer: any) => dealersArray.push(dealer.name))
                response.data.allBusinessTypes.map((type: any) => businessTypeArray.push(type.business_type))
            }
            setDealers(dealersArray)
            setBusinessTypeList(businessTypeArray)
            return response.data
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    const getMethodsName: any = useMemo(() => ["getAllMethodsName"], []);
    const { data: getAllMethodsName, isFetching: isLoadingMethod } = useQuery(
        getMethodsName,
        async () => {
            const response = await axiosPrivate.get(PAYMENT_API_URL.getAllMethodsName);
            let depositArr: any = []
            let withdrawArr: any = []
            let d: any = []
            let w: any = []
            response.data.map((method: any) => {
                if (method.deposit) {
                    d.push(method._id)
                    depositArr.push(method)
                }
                if (method.withdraw) {
                    w.push(method._id)
                    withdrawArr.push(method)
                }
            })
            values.deposit = d
            values.withdraw = w
            setDepositAr(d)
            setWithdrawAr(w)
            setDepositArray(depositArr)
            setWithdrawArray(withdrawArr)
            return response.data
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    const updateUserPermission = async (methodId: string, type: string) => {
        if (type == "withdraw") {
            // Withdraw Section -------------------------- //
            if (withdrawAr.includes(methodId)) {
                    // Remove withdraw  -------------------------- //
                const updatedArray = withdrawAr.filter((id: any) => id !== methodId);
                values.withdraw = updatedArray
                if (values.withdraw.length !== 0) {
                    setFieldError("withdraw","")
                }
                if (values.withdraw.length == 0) {
                    setFieldError("withdraw","At least one withdraw option must be selected")
                }
                setWithdrawAr(updatedArray);
            } else {
                    // Add withdraw  -------------------------- //
                const newArray:any = [...withdrawAr,methodId]
                values.withdraw = newArray
                if (values.withdraw.length !== 0) {
                    setFieldError("withdraw","")
                }
                setWithdrawAr((prevArray: any) => [...prevArray, methodId]);
            }
        } else {
            // Deposit Section -------------------------- //
            if (depositAr.includes(methodId)) {
                    // Remove Deposit  -------------------------- //
                const updatedArray = depositAr.filter((id: any) => id !== methodId);
                values.deposit = updatedArray
                if (values.deposit.length !== 0) {
                    setFieldError("deposit","")
                }
                if (values.deposit.length == 0) {
                    setFieldError("deposit","At least one deposit option must be selected")
                }
                setDepositAr(updatedArray);
            } else {
                    // Add Deposit  -------------------------- //
                const newArray:any = [...depositAr,methodId]
                values.deposit = newArray
                if (values.deposit.length !== 0) {
                    setFieldError("deposit","")
                }
                setDepositAr((prevArray: any) => [...prevArray, methodId]);
            }
        }
    }

    // ------------------------------- FORMIK FUNCTIONS ------------------------------- //

    const formik = useFormik({
        initialValues,
        validationSchema: addMerchantValidationSchema,
        onSubmit: async (values) => {
            if (!phone || phone.length < 8) setFieldError("mobile", "Mobile is Required.")

            const allDealers = getAllDealers.allDealers
            const dealer = allDealers.find((dealer: any) => dealer.name === values.dealer);
            const allCurrency = getAllCurrency.allCurrencies
            const currency = allCurrency.find((currency: any) => currency.currency_name === values.allow_currency);
            const allBusinessTypes:any = getAllDealers.allBusinessTypes
            const businessType = allBusinessTypes.find((methodType: any) => methodType.business_type === businessSelectedOption[0]);
            const dataObject = {
                email: values.email,
                contact_number: phone,
                first_name: values.first_name,
                last_name: values.last_name,
                location: values.location,
                business_type: businessType._id,
                business_name: values.business_name,
                dealer_id: dealer._id,
                deposit_payment_gateway: depositAr,
                withdraw_payment_gateway: withdrawAr,
                allow_currency: currency._id
            }
            await addMerchantApi(dataObject)
        },
    });

    const { mutateAsync: addMerchantApi } = useMutation(
        async (data: any) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.post(MERCHANT_API_URL.addMerchant, data);
                if (response.status == 200 || response.status == 201) {
                    toast.success("Merchant added successfully");
                    refetch()
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
            } finally {
                setIsLoading(false)
            }
        }
    );

    const {
        handleSubmit,
        getFieldProps,
        values,
        errors,
        touched,
        resetForm,
        setErrors,
        setFieldError,
    } = formik;

    return (
        <CommonModal size="lg" isOpen={addMerchantModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <FormikProvider value={formik}>
                <Form className="g-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="selectDealer">Select Dealer</Label>
                                <Typeahead
                                    id='dealers-type'
                                    options={dealers}
                                    placeholder="Select Dealer"
                                    open={dealerOpen}
                                    onFocus={handleDealerToggleMenu}
                                    onBlur={handleDealerToggleMenu}
                                    onChange={handleDealerSelectionChange}
                                    selected={dealerSelectedOption}
                                    clearButton
                                />
                                {touched.dealer && errors.dealer && <ErrorMessage name="dealer" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="first-name">{FirstName}</Label>
                                <Input type="text" {...getFieldProps("first_name")} />
                                <ErrorMessage name="first_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="last-name">{LastName}</Label>
                                <Input type="text" {...getFieldProps("last_name")} />
                                <ErrorMessage name="last_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="selectCurrency">Select Currency</Label>
                                <Typeahead
                                    id='currencies'
                                    options={currency}
                                    placeholder="Select Currency"
                                    multiple
                                    open={currencyOpen}
                                    onFocus={handleCurrencyToggleMenu}
                                    onBlur={handleCurrencyToggleMenu}
                                    onChange={handleCurrencySelectionChange}
                                    selected={selectedCurrency}
                                    clearButton
                                />
                                {touched.allow_currency && errors.allow_currency && <ErrorMessage name="currency" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Business Type</Label>
                                <Typeahead
                                    options={businessTypeList}
                                    placeholder="Choose Location"
                                    id="business_type"
                                    open={businessOpen}
                                    onFocus={handleBusinessToggleMenu}
                                    onBlur={handleBusinessToggleMenu}
                                    onChange={handleBusinessSelectionChange}
                                    selected={businessSelectedOption}
                                    clearButton
                                />
                                {touched.business_type && errors.business_type && <ErrorMessage name="business_type" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label htmlFor="business-name">Business Name</Label>
                                <Input type="text" {...getFieldProps("business_name")} />
                                <ErrorMessage name="business_name" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>{"Mobile"}</Label>
                                <PhoneInput
                                    className='phone-dropdown'
                                    forceDialCode
                                    defaultCountry="ua"
                                    value={phone}
                                    onChange={(phone) => {
                                        if (phone.length < 8 || phone.length > 18) {
                                            setFieldError("mobile", "Mobile is required.")
                                        } else {
                                            setFieldError("mobile", "")
                                            setPhone(phone)
                                        }
                                    }
                                    }
                                />
                                <ErrorMessage name="mobile" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>{EmailAddress}</Label>
                                <Input type="email" {...getFieldProps("email")} />
                                <ErrorMessage name="email" component="span" className="pt-1 text-danger" />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Location</Label>
                                <Typeahead
                                    options={Countries}
                                    placeholder="Choose Location"
                                    id="Country_type"
                                    open={countryOpen}
                                    onFocus={handleCountryToggleMenu}
                                    onBlur={handleCountryToggleMenu}
                                    onChange={handleCountrySelectionChange}
                                    selected={countrySelectedOption}
                                    clearButton
                                />
                                {touched.location && errors.location && <ErrorMessage name="location" component="span" className="pt-1 text-danger" />}
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Payment Gateway</Label>
                                <hr />
                            </FormGroup>
                        </Col>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Deposit</Label>
                                <Row className='gap-y-2 mt-2'>
                                    {depositArray.map(({ _id, gateway_name }, index) => (
                                        <Col md="3" key={index} className='d-flex justify-content-center align-items-center gap-2'>
                                            <Label htmlFor={`gateway${_id}`} className='' style={{ cursor: "pointer" }}>{gateway_name}</Label>
                                            <CommonSwitch defaultChecked={depositAr.includes(_id)} style={{ width: '32px', height: '18px' }} onChange={() => updateUserPermission(_id, "deposit")} />

                                        </Col>
                                    ))}
                                    <Col sm="12">
                                        <FormGroup>
                                            {touched.deposit && errors.deposit && <ErrorMessage name="deposit" component="span" className="pt-1 text-danger" />}
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                        <hr />
                        <Col sm="12">
                            <FormGroup>
                                <Label>Withdraw</Label>
                                <Row className='gap-y-2 mt-2'>
                                    {withdrawArray.map(({ _id, gateway_name }, index) => (
                                        <Col md="3" key={index} className='d-flex justify-content-center align-items-center gap-2'>
                                            <Label htmlFor={`gateway${_id}`} className='' style={{ cursor: "pointer" }}>{gateway_name}</Label>
                                            <CommonSwitch defaultChecked={withdrawAr.includes(_id)} style={{ width: '32px', height: '18px' }} onChange={() => updateUserPermission(_id, "withdraw")} />
                                        </Col>
                                    ))}
                                    <Col sm="12">
                                        <FormGroup>
                                            {touched.withdraw && errors.withdraw && <ErrorMessage name="withdraw" component="span" className="pt-1 text-danger" />}
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                        <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                            <Button color="primary pt-2 pb-2" type='submit' disabled={isLoading}>{isLoading ? "Loading..." : "Add Merchant"}</Button>
                        </div>
                    </Row>
                </Form>
            </FormikProvider>

        </CommonModal>
    )
}

export default AddMerchant