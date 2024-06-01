import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { ManageCurrencyType } from '@/Types/SystemSettings';

type Props = {
    viewCurrency: ManageCurrencyType | undefined | any,
    viewCurrencyModalOpen: boolean,
    setviewCurrencyModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditCurrency: FC<Props> = ({ viewCurrency, viewCurrencyModalOpen, setviewCurrencyModalOpen }) => {
    const modalToggle = () => {
        setviewCurrencyModalOpen(!viewCurrencyModalOpen);
    }

    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-eye" />
            View Currency
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Bank</Button> */}
        </>
    )

    return (
        <CommonModal size="lg" isOpen={viewCurrencyModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3">
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Currency ID</Label>
                            <Input type="text" readOnly value={viewCurrency?.currency_id} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Currency Code</Label>
                            <Input type="text" readOnly value={viewCurrency?.currency_code} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Currency Name</Label>
                            <Input type="text" readOnly value={viewCurrency?.currency_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Symbol</Label>
                            <Input type="text" readOnly value={viewCurrency?.symbol} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Country</Label>
                            <Input type="text" readOnly value={viewCurrency?.country} className="no-hover" disabled />
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

export default EditCurrency