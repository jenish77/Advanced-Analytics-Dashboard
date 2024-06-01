import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, SubAdminRoles, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { MdOutlineCreditCardOff } from "react-icons/md";
import { Typeahead } from 'react-bootstrap-typeahead';


type Props = {
    addSubAdminModalOpen: boolean,
    setaddSubAdminModalOpen: React.Dispatch<SetStateAction<boolean>>
}




const AddSubAdmin: FC<Props> = ({ addSubAdminModalOpen, setaddSubAdminModalOpen }) => {
    const modalToggle = () => setaddSubAdminModalOpen(!addSubAdminModalOpen);




    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Add SubAdmin
        </div>
    )


    const Footer = () => (
        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Add SubAdmin</Button>
    )




    return (
        <CommonModal size="lg" isOpen={addSubAdminModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3" onSubmit={(e) => e.preventDefault()}>
                <Row>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor='username'>User Name</Label>
                            <Input id='username' name='username' type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Email</Label>
                            <Input type="email" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Role</Label>
                            <Typeahead options={SubAdminRoles} placeholder="Choose Role" id="Basic TypeAhead" />
                        </FormGroup>
                    </Col>

                </Row>
            </Form>
        </CommonModal>
    )
}

export default AddSubAdmin