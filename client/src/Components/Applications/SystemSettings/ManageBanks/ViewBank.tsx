import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { ManageBanksType } from '@/Types/SystemSettings';
import { BANK_API_URL, axiosPrivate } from '@/security/axios';

type Props = {
    viewBank: ManageBanksType | undefined | any,
    viewBankModalOpen: boolean,
    setviewBankModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditBank: FC<Props> = ({ viewBank, viewBankModalOpen, setviewBankModalOpen }) => {
    const modalToggle = () => {
        setviewBankModalOpen(!viewBankModalOpen);
    }

    useEffect(() => {
        if (viewBankModalOpen && viewBank?._id) {
            axiosPrivate.get(`${BANK_API_URL.getOneBankDetails}?_id=${viewBank._id}`)
                .then(response => {
                    console.log('response.data');
                })
                .catch(error => {
                    console.error('Error fetching bank details:', error);
                });
        }
    }, [viewBankModalOpen, viewBank?._id]);


    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-eye" />
            View Bank
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Bank</Button> */}
        </>
    )

    return (
        <CommonModal size="lg" isOpen={viewBankModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3">
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">User Name</Label>
                            <Input type="text" readOnly value={viewBank?.user_name?.first_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Company Name</Label>
                            <Input type="text" readOnly value={viewBank?.company_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Bank Name</Label>
                            <Input type="text" readOnly value={viewBank?.bank_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Account Owner</Label>
                            <Input type="text" readOnly value={viewBank?.account_owner} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Account IBAN</Label>
                            <Input type="text" readOnly value={viewBank?.account_IBAN} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Limit</Label>
                            <Input type="text" readOnly value={viewBank?.limit} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">API</Label>
                            <Input type="text" readOnly value={viewBank?.api} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Approval Type</Label>
                            <Input type="text" readOnly value={viewBank?.approval_type} className="no-hover" disabled />
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

export default EditBank