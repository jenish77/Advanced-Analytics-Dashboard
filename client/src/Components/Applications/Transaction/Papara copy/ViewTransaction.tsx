import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState, } from 'react'
import { Badge, Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { DEALER_API_URL, PAYMENT_API_URL, axiosPrivate } from '@/security/axios';
import { MerchantType } from '@/Types/UserListType';
import { MethodSettingsType } from '@/Types/SystemSettings';
import { TransactionType } from '@/Types/EcommerceType';

type Props = {
    viewTransaction: TransactionType | undefined | any,
    viewTransactionModalOpen: boolean,
    setviewTransactionModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditTransaction: FC<Props> = ({ viewTransaction, viewTransactionModalOpen, setviewTransactionModalOpen }) => {
    const modalToggle = () => {
        setviewTransactionModalOpen(!viewTransactionModalOpen);
    }

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-eye" />
            View Transaction
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Bank</Button> */}
        </>
    )
    
    if (!viewTransaction || !viewTransaction.tran_json_response) {
        return null;
    }

    const data = viewTransaction? JSON.parse(viewTransaction?.tran_json_response) : null;
    
    return (
        <CommonModal size="lg" isOpen={viewTransactionModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3">
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Transaction ID</Label>
                            <Input type="text" readOnly value={data ? data.transactionId : '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Amount</Label>
                            <Input type="text" readOnly value={data ? data.amount : '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Bank Account ID</Label>
                            <Input type="text" readOnly value={data ? data.bankAccountId : '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Full Name</Label>
                            <Input type="text" readOnly value={data ? data.fullName : '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">IBAN</Label>
                            <Input type="text" readOnly value={data ? data.iban : '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    {/* <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Provider ID</Label>
                            <Input type="text" readOnly value={data ? data.providerId : '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col> */}
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold mb-2">Status</Label>
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                <Badge color="primary" style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>
                                    {data ? data.status : '-'}
                                </Badge>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold mb-2">Transfer Type</Label>
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                <Badge style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>
                                    {data ? data.transferType : '-'}
                                </Badge>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold mb-2">Type</Label>
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                <Badge color="warning" style={{ padding: '8px 10px', fontSize: '12px', marginLeft: '0px' }}>
                                    {data ? data.type : '-'}
                                </Badge>
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

export default EditTransaction