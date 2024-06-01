import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { Button, CardBody, Col, Form, FormGroup, Input, Label, ModalFooter, Row } from "reactstrap";
import { AgreeToThePolicies, ChooseFile, Description, EmailAddress, EmailPlaceholder, FirstName, FirstNamePlaceholder, PasswordBrowserDefault, SelectYourPaymentMethod, State, StateChoose, SubmitButton, SureInformation, ValueOfClass } from "@/Constant";
import { BrowserRadioList, BrowserStateList, CustomRadioList, MultiWithHeaderData, NotificationAddRecipientReadioList, NotificationSendRecipientData, UserAddPaymentGatewayList } from "@/Data/Form&Table/Form";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';
import { Typeahead } from 'react-bootstrap-typeahead';

type Props = {
    addNotificationModalOpen: boolean,
    setaddNotificationModalOpen: React.Dispatch<SetStateAction<boolean>>
}




const AddNotification: FC<Props> = ({ addNotificationModalOpen, setaddNotificationModalOpen }) => {
    const [selectedValues, setSelectedValues] = useState<any>([]);
    const [selectedType, setselectedType] = useState<any>("All");
    const modalToggle = () => {
        setSelectedValues([])
        setselectedType("All")
        setaddNotificationModalOpen(false)
    }


    useEffect(() => {
        setSelectedValues([])
    }, [selectedType])


    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Create New Notification
        </div>
    )


    const Footer = () => (
        <Button color="primary pt-2 pb-2" onClick={modalToggle}>Send Notification</Button>
    )


    const handleSelectedValuesChange = (selected: any) => {
        setSelectedValues(selected);
    };



    console.log("selected  Recipient >>> ", selectedValues)
    console.log("selected type >>>", selectedType);

    return (
        <CommonModal size="lg" isOpen={addNotificationModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3" onSubmit={(e) => e.preventDefault()}>
                <Row>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor="title">Message Title</Label>
                            <Input type="text" id='title' required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup>
                            <Label>Select Recipient Type</Label>
                            <ul className="radio-wrapper">
                                {NotificationAddRecipientReadioList.map(({ icon, id, text, defaultChecked }, index) => (
                                    <li className="p-1 pt-2 pb-2" key={index} >
                                        <Input className="checkbox-shadow d-block" id={`radio-${id}`} value={text} type="radio" defaultChecked={defaultChecked} name="RecipientType" onChange={(e) => setselectedType(e.target.value)} />
                                        <Label htmlFor={`radio-${id}`} check className='d-flex gap-2 align-items-center justify-items-center'>
                                            {/* <i className={`fa fa-${icon}`}></i> */}
                                            <div style={{ width: '14px', height: '14px' }}>{icon}</div>
                                            <h5>{text}</h5>
                                        </Label>
                                    </li>
                                ))}
                            </ul>
                        </FormGroup>
                    </Col>
                    {
                        (selectedType === "Dealer" || selectedType === "Merchant") &&
                        < Col sm="12">
                            <FormGroup>
                                <Label>Choose Recipient Whome You want to Send Notification</Label>
                                <Typeahead
                                    id="multiple-typeahead"
                                    labelKey={"name"}
                                    multiple options={NotificationSendRecipientData}
                                    placeholder="Choose a Recipient..."
                                    className="shadow-none w-100"
                                    onChange={handleSelectedValuesChange}
                                    selected={selectedValues}
                                />
                            </FormGroup>
                        </Col>
                    }

                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor='description '>Message Description </Label>
                            <Input type="textarea" name="description " id='description ' rows={5} />
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </CommonModal >
    )
}

export default AddNotification