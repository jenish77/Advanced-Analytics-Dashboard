import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation } from "@/Constant";
import { BrowserRadioList, BrowserStateList, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { MdOutlineCreditCardOff } from "react-icons/md";


type Props = {
    addBannedNameModalOpen: boolean,
    setaddBannedNameModalOpen: React.Dispatch<SetStateAction<boolean>>
}



const AddBannedName: FC<Props> = ({ addBannedNameModalOpen, setaddBannedNameModalOpen }) => {
    const modalToggle = () => setaddBannedNameModalOpen(!addBannedNameModalOpen);




    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <MdOutlineCreditCardOff />
            Add Banned Name
        </div>
    )


    const Footer = () => (
        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Add Name</Button>
    )




    return (
        <CommonModal size="lg" isOpen={addBannedNameModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3" onSubmit={(e) => e.preventDefault()}>
                <Row>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor='name'>Name</Label>
                            <Input id='name' name='name' type="text"  required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor='reason'>Reason for Banning</Label>
                            <Input type="textarea" name="reason" id='reason' rows={5}  />
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </CommonModal>
    )
}

export default AddBannedName