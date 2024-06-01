import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { CenteredModals, Close, ImagePath, SomethingWentWrong, VerticallyCentered } from "@/Constant";
import { CenteredModalList } from "@/Data/Uikits/modal";
import { FC, SetStateAction, useState } from "react";
import { Button, Card, CardBody, Col, ModalFooter } from "reactstrap";
import CommonModal from "./Common/CommonModal";

interface Props {
  deleteModalOpen: boolean,
  setdeleteModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const CommonDeleteModal:FC<Props> = ({deleteModalOpen,setdeleteModalOpen}) => {
  const [centred, setCentered] = useState(false);
  const modalToggle = () => setdeleteModalOpen(!deleteModalOpen);
  return (
    <Col xl="4">
      <Card>
        <CommonCardHeader title={CenteredModals} span={CenteredModalList} />
        <CardBody className="badge-spacing">
          <Button color="success" onClick={modalToggle}>{VerticallyCentered}</Button>
          <CommonModal centered isOpen={deleteModalOpen} toggle={modalToggle}>
            <div className="modal-toggle-wrapper">
              <ul className="modal-img">
                <li className="text-center"><img src={`${ImagePath}/gif/danger.gif`} alt="error" /></li>
              </ul>
              <h4 className="text-center pb-2">Are You Sure ?</h4>
              <p className="text-center">You Really want to Delete This One ? Once you Delete there is no way to come it Back .</p>
              {/* <div>
                <Button color="secondary" className="d-flex m-auto" onClick={modalToggle}>Close</Button>
                <Button color="danger" className="d-flex m-auto" onClick={modalToggle}>Delete</Button>
              </div> */}
            </div>

            <ModalFooter>
            <Button color="secondary" className="d-flex m-auto" onClick={modalToggle}>Close</Button>
                <Button color="danger" className="d-flex m-auto" onClick={modalToggle}>Delete</Button>
            </ModalFooter>
          </CommonModal>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CommonDeleteModal;





// const AddDealer: FC<Props> = ({ addDealerModalOpen, setaddDealerModalOpen }) => {
//     const modalToggle = () => setaddDealerModalOpen(!addDealerModalOpen);



//     const Title = () => (
//         <div className='d-flex justify-center align-items-center gap-2'>
//             <i className="fa fa-plus" />
//             Add Dealer
//         </div>
//     )
//     const Footer = () => (
//         <Button color="primary pt-2 pb-2" onClick={modalToggle}>Add Dealer</Button>
//     )

//     return (
//         <CommonModal size="lg" isOpen={addDealerModalOpen} toggle={modalToggle} sizeTitle={<Title />} footer={<Footer />} modalBodyClassName="dark-modal">
            
//         </CommonModal>
//     )
// }
