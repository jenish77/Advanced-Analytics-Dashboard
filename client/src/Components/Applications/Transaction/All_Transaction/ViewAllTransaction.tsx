import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState, } from 'react'
import { Badge, Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { TRANSACTION_API_URL, axiosPrivate } from '@/security/axios';
import { AllTransactionType } from '@/Types/EcommerceType';


type Props = {
    viewAllTransaction: AllTransactionType | undefined | any,
    viewAllTransactionModalOpen: boolean,
    setviewAllTransactionModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditAllTransaction: FC<Props> = ({ viewAllTransaction, viewAllTransactionModalOpen, setviewAllTransactionModalOpen }) => {
    const [fetchData, setFetchData] = useState<any>(null);
   
    
    useEffect(() => {
        if (viewAllTransactionModalOpen && viewAllTransaction) {
            fetchTransactionData();
        }
    }, [viewAllTransactionModalOpen, viewAllTransaction]);

    const modalToggle = () => {
        setviewAllTransactionModalOpen(!viewAllTransactionModalOpen);
    }

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-eye" />
            View All Transaction
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Bank</Button> */}
        </>
    )

    if (!viewAllTransaction || !viewAllTransaction.tran_json_response) {
        return null;
    }

    // const data = viewAllTransaction? JSON.parse(viewAllTransaction?.tran_json_response) : null;
    const fetchTransactionData = async () => {
        try {
            const response = await axiosPrivate.get(TRANSACTION_API_URL.viewTransaction, {
                params: {
                    id: viewAllTransaction._id
                }
            });
            setFetchData(response.data[0]); 
        } catch (error) {
            console.error('Error fetching transaction data:', error);
        }
    };


    return (
        <CommonModal size="lg" isOpen={viewAllTransactionModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3">
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">First Name</Label>
                            <Input type="text" readOnly value={fetchData?.first_name || '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Last Name</Label>
                            <Input type="text" readOnly value={fetchData?.last_name || '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Bank ID</Label>
                            <Input type="text" readOnly value={fetchData?.bank_id || '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Payment ID</Label>
                            <Input type="text" readOnly value={fetchData?.payment_id || '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Main Amount</Label>
                            <Input type="text" readOnly value={fetchData?.main_amount || '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Final Amount</Label>
                            <Input type="text" readOnly value={fetchData?.final_amount || '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Dealer Commission</Label>
                            <Input type="text" readOnly value={fetchData?.dealer_commission} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Dealer Commission Rate</Label>
                            <Input type="text" readOnly value={fetchData?.dealer_commission_rate} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Admin Commission</Label>
                            <Input type="text" readOnly value={fetchData?.admin_commission} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Admin Commission Rate</Label>
                            <Input type="text" readOnly value={fetchData?.admin_commission_rate} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Transaction Unique ID</Label>
                            <Input type="text" readOnly value={fetchData?.trans_unique_id || '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Status Description</Label>
                            <Input type="text" readOnly value={fetchData?.status_description || '-'} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Is Commission Pay : </Label>&nbsp;&nbsp;&nbsp;
                            <Badge>{fetchData?.is_commission_pay ? 'Yes' : 'No'}</Badge>
                        </FormGroup>
                    </Col>
                </Row>
                <label className='fw-bold'>Transaction Response</label>
                <hr />
                <p>{fetchData?.tran_json_response || '-'}</p>
                <div className="d-flex justify-content-end mt-4">
                    <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
                </div>
            </Form>
        </CommonModal>
    )
}

export default EditAllTransaction