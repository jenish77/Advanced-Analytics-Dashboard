import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction } from 'react'
import { Button,Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import CommonSwitch from '@/Components/Form&Table/Form/FormWidgets/Switches/Common/CommonSwitch';

type Props = {
    createRoleModalOpen: boolean,
    setCreateRoleModalOpen: React.Dispatch<SetStateAction<boolean>>
}


const CreateRole: FC<Props> = ({ createRoleModalOpen, setCreateRoleModalOpen }) => {
    const modalToggle = () => setCreateRoleModalOpen(!createRoleModalOpen);



    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa fa-plus" />
            Create Role
        </div>
    )
    const Footer = () => (
        <>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Create Role</Button>
        </>
    )

    return (
        <CommonModal size="lg" isOpen={createRoleModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            <Form className="g-3" onSubmit={(e) => e.preventDefault()}>
                <Row>
                    <Col sm="12">
                        <FormGroup>
                            <Label htmlFor="username">Role Name</Label>
                            <Input type="text" required />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup className='d-flex gap-2 align-items-center'>
                            <Label>All</Label>
                            <CommonSwitch defaultChecked={false} style={{ width: '32px', height: '18px' }} />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup className='d-flex gap-2 align-items-center'>
                            <Label>List</Label>
                            <CommonSwitch defaultChecked={false} style={{ width: '32px', height: '18px' }} />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup className='d-flex gap-2 align-items-center'>
                            <Label>Add</Label>
                            <CommonSwitch defaultChecked={false} style={{ width: '32px', height: '18px' }} />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup className='d-flex gap-2 align-items-center'>
                            <Label>Update</Label>
                            <CommonSwitch defaultChecked={false} style={{ width: '32px', height: '18px' }} />
                        </FormGroup>
                    </Col>
                    <Col sm="12">
                        <FormGroup className='d-flex gap-2 align-items-center'>
                            <Label>Delete</Label>
                            <CommonSwitch defaultChecked={false} style={{ width: '32px', height: '18px' }} />
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </CommonModal>
    )
}

export default CreateRole