import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, StateOfUsa, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { Typeahead } from 'react-bootstrap-typeahead';

type Props = {
    createAPIModalOpen: boolean,
    setcreateAPIModalOpen: React.Dispatch<SetStateAction<boolean>>
}


const CreateAPI: FC<Props> = ({ createAPIModalOpen, setcreateAPIModalOpen }) => {
    const modalToggle = () => setcreateAPIModalOpen(!createAPIModalOpen);



    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Create API
        </div>
    )
    const Footer = () => (
        <>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Create API</Button>
        </>
    )

    return (
        <CommonModal size="lg" isOpen={createAPIModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3" onSubmit={(e) => e.preventDefault()}>
                <Row>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor="username">User ID</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor="username">User Name</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>IFrame Name</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>API Key</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Secret Key</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Method</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>

                </Row>
            </Form>
        </CommonModal>
    )
}

export default CreateAPI