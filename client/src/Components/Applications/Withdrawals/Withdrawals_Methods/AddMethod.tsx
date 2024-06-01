import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';

type Props = {
    addMethodModalOpen: boolean,
    setaddMethodModalOpen: React.Dispatch<SetStateAction<boolean>>
}




const AddMethod: FC<Props> = ({ addMethodModalOpen, setaddMethodModalOpen }) => {
    const modalToggle = () => setaddMethodModalOpen(!addMethodModalOpen);



    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Add New Withdrawal Method
        </div>
    )


    const Footer = () => (
        <>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Add Method</Button>
        </>
    )




    return (
        <CommonModal size="lg" isOpen={addMethodModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3" onSubmit={(e) => e.preventDefault()}>
                <Row>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor="first-name">Method Name</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Fees</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Processsing Time</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Row>
                                <Col sm="12" md="6">
                                    <Label>Minimum Amount</Label>
                                    <Input type="number" required />
                                </Col>
                                <Col sm="12" md="6">
                                    <Label>Maximum Amount</Label>
                                    <Input type="number" required />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Restrictions</Label>
                            <Input type="textarea" name="restrictions" id='restrictions' rows={3} />
                        </FormGroup>
                    </Col>


                </Row>
            </Form>
        </CommonModal>
    )
}

export default AddMethod