import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState, } from 'react'
import { Badge, Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { DEALER_API_URL, PAYMENT_API_URL, axiosPrivate } from '@/security/axios';
import { MerchantType } from '@/Types/UserListType';

type Props = {
    viewMerchant: MerchantType | undefined | any,
    viewMerchantModalOpen: boolean,
    setviewMerchantModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditMerchant: FC<Props> = ({ viewMerchant, viewMerchantModalOpen, setviewMerchantModalOpen }) => {
    const [merchantData, setMerchantData]: any = useState();
    const [methodData, setMethodData]: any = useState();

    const modalToggle = () => {
        setviewMerchantModalOpen(!viewMerchantModalOpen);
    }

    useEffect(() => {
        if (viewMerchantModalOpen && viewMerchant?._id) {
            axiosPrivate.get(`${DEALER_API_URL.getOneDealer}?user_id=${viewMerchant._id}`)
                .then(response => {
                    setMerchantData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching dealer details:', error);
                });
        }
    }, [viewMerchantModalOpen, viewMerchant?._id]);

    useEffect(() => {
        if (viewMerchantModalOpen && viewMerchant?._id) {
            // const requestData: any = {
            //     currency: viewMerchant.allow_currency
            // };
            axiosPrivate.post(PAYMENT_API_URL.getAllMethodsName)
                .then(response => {
                    setMethodData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching dealer details:', error);
                });
        }
    }, [viewMerchantModalOpen, viewMerchant?._id]);

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-eye" />
            View Merchant
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Bank</Button> */}
        </>
    )
        
    return (
        <CommonModal size="lg" isOpen={viewMerchantModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <Form className="g-3">
                <Row>
                    <Col sm="12" className='d-flex justify-content-center mb-3'>
                        <div className="avatar-container custom_avtar">
                            <img
                                className="avatar-img object-fit-cover"
                                src={`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE}/profile/${merchantData?.result?.image}`}
                                alt={merchantData?.result?.image}
                                // height={'50px'}
                                // width={'50px'}
                                onError={(e: any) => {
                                    e.target.src = '/assets/images/user/user.png';
                                }} />
                        </div>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">First Name</Label>
                            <Input type="text" readOnly value={merchantData?.result?.first_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Last Name</Label>
                            <Input type="text" readOnly value={merchantData?.result?.last_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Business Name</Label>
                            <Input type="text" readOnly value={merchantData?.result?.business_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Business Type</Label>
                            <Input type="text" readOnly value={merchantData?.result?.business_type?.business_type} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Email</Label>
                            <Input type="text" readOnly value={merchantData?.result?.email} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Mobile No.</Label>
                            <Input type="text" readOnly value={merchantData?.result?.contact_number} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Location</Label>
                            <Input type="text" readOnly value={merchantData?.result?.location} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Dealer</Label>
                            <Input type="text" readOnly value={merchantData?.result?.dealer_id?.first_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Withdraw Payment Gateway</Label><hr />
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                {merchantData && merchantData?.result?.withdraw_payment_gateway?.length > 0 ? (
                                    merchantData?.result?.withdraw_payment_gateway?.map((gateway: any, index: any) => (
                                        <Badge style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>{gateway.gateway_name}</Badge>
                                    ))
                                ) : (
                                    <Badge color="danger" style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>
                                        No Payment Gateway
                                    </Badge>
                                )}
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Deposit Payment Gateway</Label><hr />
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                {merchantData && merchantData?.result?.deposit_payment_gateway?.length > 0 ? (
                                    merchantData?.result?.deposit_payment_gateway?.map((gateway: any, index: any) => (
                                        <Badge style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>{gateway.gateway_name}</Badge>
                                    ))
                                ) : (
                                    <Badge color="danger" style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>
                                        No Payment Gateway
                                    </Badge>
                                )}
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end mt-4">
                    <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                </div>
            </Form>
        </CommonModal>
    )
}

export default EditMerchant