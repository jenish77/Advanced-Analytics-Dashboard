import CommonModal from '@/Components/UiKits/Modal/Common/CommonModal'
import React, { FC, SetStateAction, useEffect, useState, } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { ManageBanksType } from '@/Types/SystemSettings';
import { BANK_API_URL, DEALER_API_URL, axiosPrivate } from '@/security/axios';
import { DealerType } from '@/Types/UserListType';
import { ImagePath } from '@/Constant';

type Props = {
    viewDealer: DealerType | undefined | any,
    viewDealerModalOpen: boolean,
    setviewDealerModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const EditDealer: FC<Props> = ({ viewDealer, viewDealerModalOpen, setviewDealerModalOpen }) => {
    const [dealerData, setDealerData]: any = useState();
    const modalToggle = () => {
        setviewDealerModalOpen(!viewDealerModalOpen);
    }

    useEffect(() => {
        if (viewDealerModalOpen && viewDealer?._id) {
            axiosPrivate.get(`${DEALER_API_URL.getOneDealer}?user_id=${viewDealer._id}`)
                .then(response => {
                    setDealerData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching dealer details:', error);
                });
        }
    }, [viewDealerModalOpen, viewDealer?._id]);


    const Title = () => (
        <div className='d-flex justify-center align-items-center gap-2'>
            <i className="fa  fa-eye" />
            View Dealer
        </div>
    )


    const Footer = () => (
        <>
            {/* <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>Edit Bank</Button> */}
        </>
    )

    return (
        <CommonModal size="lg" isOpen={viewDealerModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
            <Form className="g-3">
                <Row>
                    <Col sm="12" className='d-flex justify-content-center mb-3'>
                        <div className="avatar-container text-center custom_avtar" >
                            <img
                                className="avatar-img object-fit-cover"
                                src={`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE}/profile/${dealerData?.result?.image}`}
                                alt={dealerData?.result?.image}
                                // height={'100px'}
                                // width={'100px'}
                                onError={(e: any) => {
                                    e.target.src = '/assets/images/user/user.png';
                                }} />
                        </div>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">First Name</Label>
                            <Input type="text" readOnly value={dealerData?.result?.first_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Last Name</Label>
                            <Input type="text" readOnly value={dealerData?.result?.last_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Company Name</Label>
                            <Input type="text" readOnly value={dealerData?.result?.company_name} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Email</Label>
                            <Input type="text" readOnly value={dealerData?.result?.email} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Mobile No.</Label>
                            <Input type="text" readOnly value={dealerData?.result?.contact_number} className="no-hover" disabled />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label className="fw-bold">Location</Label>
                            <Input type="text" readOnly value={dealerData?.result?.location} className="no-hover" disabled />
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

export default EditDealer