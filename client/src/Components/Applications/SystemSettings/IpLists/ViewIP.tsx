import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Countries } from "@/Data/Form&Table/Form";
import { IpListsType } from '@/Types/SystemSettings';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useQuery } from 'react-query';
import { MERCHANT_API_URL, axiosPrivate } from '@/security/axios';
import { addIpAddressValidationSchema } from '@/Components/validation/validation';
import { ErrorMessage, useFormik } from 'formik';

type Props = {
    viewIP: IpListsType | undefined | any,
    viewIPModalOpen: boolean,
    setviewIPModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const viewIP: FC<Props> = ({ viewIP, viewIPModalOpen, setviewIPModalOpen }) => {
    const [merchantList, setMerchantList] = useState<any[]>([]);
    // const [selectedMerchant, setSelectedMerchant] = useState<any[]>([]);
    const [selectedMerchantName, setSelectedMerchantName] = useState<any[]>([]);
    const [editData, setEditData] = useState<any>({ ip_address: viewIP?.ip_address, merchant_id: viewIP?.merchant.merchant_id, country: viewIP?.country });
    // const [selectedCountry, setSelectedCountry] = useState<string>(viewIP?.country || "");
    // const queryClient = useQueryClient();

    const { data: usersData } = useQuery('users', async () => {
        const response = await axiosPrivate.get(MERCHANT_API_URL.getMerchantList);
        return response.data.result;
    }, {
        retry: false,
    });

    useEffect(() => {
        setEditData({ ip_address: viewIP?.ip_address, merchant_id: viewIP?.merchant.merchant_id, country: viewIP?.country })
        if (usersData) {
            setMerchantList(usersData.map((user: any) => ({
                id: user._id,
                first_name: user.first_name,
                merchant_id: user._id
            })));
        }
        if (viewIP) {
            setSelectedMerchantName([viewIP?.merchant?.name]);
        }
    }, [usersData, viewIP]);

    const modalToggle = () => {
        resetForm();
        setviewIPModalOpen(!setviewIPModalOpen);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData || { ip_address: "", merchant_id: "", country: "" },
        validationSchema: addIpAddressValidationSchema,
        onSubmit: async (values) => {
            // await editIpAddressApi({ ...values, merchant_id: selectedMerchant })
            // resetForm();
        },
    })

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
            <i className="fa  fa-eye" />
            View IP
        </div>
    )

    const handleSelectionChange = (selected: any[]) => {
        const selectedMerchantIds = selected.map((merchant) => merchant.id);
        const selectedMerchantNames = selected.map((merchant) => merchant.first_name);
        formik.setValues({
            ...values,
            merchant_id: selected.length > 0 ? selected[0].id : ""
        });
        // setSelectedMerchant(selectedMerchantIds);
        setSelectedMerchantName(selectedMerchantNames);
    };

    const handleCountryChange = (selected: any[]) => {
        formik.setValues({
            ...values,
            country: selected[0] || "",
        });
        // setSelectedCountry(selected.length > 0 ? selected[0] : "");
    };

    return (
        <CommonModal size="lg" isOpen={viewIPModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <Form className="g-3" onSubmit={handleSubmit}>
                <Row>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor="first-name">IP Address</Label>
                            <Input type="text" {...getFieldProps("ip_address")} disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Merchant</Label>
                            <Typeahead
                                options={merchantList}
                                placeholder="Choose Merchant"
                                id="Basic TypeAhead"
                                labelKey="first_name"
                                onChange={handleSelectionChange}
                                selected={selectedMerchantName}
                                clearButton
                                disabled
                            />
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
                                defaultInputValue={viewIP?.country}
                                clearButton
                                disabled
                            />
                            {touched.country && errors.country && <ErrorMessage name="country" component="span" className="pt-1 text-danger" />}
                        </FormGroup>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                    <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                </div>
            </Form>
        </CommonModal>
    )
}

export default viewIP