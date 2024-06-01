import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState, } from 'react'
import { Badge, Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { DEALER_API_URL, PAYMENT_API_URL, axiosPrivate } from '@/security/axios';
import { MerchantType } from '@/Types/UserListType';
import { MethodSettingsType } from '@/Types/SystemSettings';

type Props = {
    viewMethod: MethodSettingsType | undefined | any,
    viewMethodModalOpen: boolean,
    setviewMethodModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditMethod: FC<Props> = ({ viewMethod, viewMethodModalOpen, setviewMethodModalOpen }) => {
    const [methodData, setMethodData]: any = useState();
    const modalToggle = () => {
        setviewMethodModalOpen(!viewMethodModalOpen);
    }

    useEffect(() => {
        if (viewMethodModalOpen && viewMethod?._id) {
            axiosPrivate.get(`${PAYMENT_API_URL.getOneMethod}?method_id=${viewMethod._id}`)
                .then(response => {
                    setMethodData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching dealer details:', error);
                });
        }
    }, [viewMethodModalOpen, viewMethod?._id]);


    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-eye" />
            View Method
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Bank</Button> */}
        </>
    )

    return (
        <CommonModal size="lg" isOpen={viewMethodModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3">
                <Row>
                    <Col sm="12" className='d-flex justify-content-center mb-3'>
                        <div className="avatar-container text-center custom_avtar" >
                            <img
                                className="avatar-img"
                                src={`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE}/methodImg/${methodData?.result?.image}`}
                                alt={methodData?.result?.image}
                                height={'50px'}
                                width={'50px'}
                                onError={(e: any) => {
                                    e.target.src = '/assets/images/logo.png';
                                }} />
                        </div>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Method ID</Label>
                            <Input type="text" readOnly value={methodData?.result?.method_id} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Gateway Name</Label>
                            <Input type="text" readOnly value={methodData?.result?.gateway_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Deposit</Label>
                            <Input type="text" readOnly value={methodData?.result?.deposit} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Withdraw</Label>
                            <Input type="text" readOnly value={methodData?.result?.withdraw} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">API Access</Label>
                            <Input type="text" readOnly value={methodData?.result?.iFrame_access} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Min Transaction</Label>
                            <Input type="text" readOnly value={methodData?.result?.min_transaction} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Max Transaction</Label>
                            <Input type="text" readOnly value={methodData?.result?.max_transaction} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold mb-2">Allow Currency</Label>
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                {methodData?.result?.allow_currency && methodData.result.allow_currency.length > 0 ? (
                                    methodData.result.allow_currency.map((currency: any, index: any) => (
                                        <Badge key={index} style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>
                                            {currency?.currency_code ? currency.currency_code : 'No Currency'}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge color="danger" style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>
                                        No Currency
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

export default EditMethod