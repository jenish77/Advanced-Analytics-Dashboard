import MyDatePicker from "@/Components/Form&Table/Form/FormWidgets/DatePicker/DatesPicker/MyDatePicker";
import { FiltersData } from "@/Data/Application/Ecommerce";
import { useAppSelector } from "@/Redux/Hooks";
import React, { FC, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Button, Card, CardBody, Col, Collapse, Input, Label, Row } from "reactstrap";

interface FilterDataProps {
  setStatusData: any;
  setTypeData: any;
  setFromDate: any;
  setToDate: any;
}

export const FilterData: FC<FilterDataProps> = ({ setStatusData, setTypeData, setFromDate, setToDate }) => {
  const { filterToggle } = useAppSelector((state) => state.product);
  const [selectedItems, setSelectedItems] = useState([]);
  const [minToDate, setMinToDate] = useState('');

  const mapStatusToBackend = (status: any) => {
    switch (status) {
      case "All":
        return "";
      case "Pending":
        return "0";
      case "Success":
        return "1";
      case "Fail":
        return "2";
      case "Cancel":
        return "3";
      case "Payment pending":
        return "4";
      default:
        return "";
    }
  };

  const mapTypeToBackend = (type: any) => {
    switch (type) {
      case "All":
        return "";
      case "Deposit":
        return "2";
      case "Withdraw":
        return "1";
      default:
        return "";
    }
  };
  const handleSelectChange = (event: any, index: any, item: any) => {
    const selectedValue = event.target.value;
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems: any = [...prevSelectedItems];
      updatedSelectedItems[index] = selectedValue;
      return updatedSelectedItems;
    });
    if (item.name === "Status") {
      setStatusData(mapStatusToBackend(selectedValue));
    }
    if (item.name === "Type") {
      setTypeData(mapTypeToBackend(selectedValue));
    }
  };

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fromDate = event.target.value;
    setFromDate(fromDate);
    setMinToDate(fromDate);
    setToDate("");
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const toDate = event.target.value;
    setToDate(toDate);
  };

  const clearDates = () => {
    const fromDateElement: any = document.getElementById('fromDate');
    const toDateElement: any = document.getElementById('toDate');

    if (fromDateElement && toDateElement) {
      fromDateElement.value = "";
      toDateElement.value = "";
      setFromDate("");
      setToDate("");
    }
  };

  return (
    <>
      <Row className="filter-row">
        {FiltersData.map((item, index) => (
          <Col key={index}>
            {/* <Label htmlFor={`select-${index}`} className="mr-2">{item.name}</Label> */}
            <Input id={`select-${index}`} type="select" className="form-control" style={{ minWidth: '250px' }} placeholder="Select" onChange={(event) => handleSelectChange(event, index, item)}>
              {item.options.map((data, optionIndex) => (
                <option key={optionIndex} value={data}>{data}</option>
              ))}
            </Input>
          </Col>
        ))}
        <Col className="position-relative">
          <MyDatePicker setFromDate={setFromDate} setToDate={setToDate} />
          {/* <Label htmlFor="fromDate" className="mr-2">From Date</Label>
              <Input id="fromDate" type="date" className="form-control" max={new Date().toISOString().split('T')[0]} onChange={handleFromDateChange} />
              <Button color="link" className="clear-button" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-12%)' }} onClick={clearDates}>
                <FaTimes />
              </Button> */}
        </Col>
        {/* &nbsp;&nbsp;&nbsp;&nbsp;
            <Col className="position-relative">
              <Label htmlFor="toDate" className="mr-2">To Date</Label>
              <Input id="toDate" type="date" className="form-control" max={new Date().toISOString().split('T')[0]} min={minToDate} onChange={handleToDateChange} />
              <Button color="link" className="clear-button" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-12%)' }} onClick={clearDates}>
                <FaTimes />
              </Button>
            </Col> */}
      </Row>
    </>
    //   <Collapse isOpen={filterToggle}>
    //   <Card className="shadow-none">
    //     <CardBody className="list-product-body">
    //       <Row className="filter-row">
    //         {FiltersData.map((item, index) => (
    //           <Col key={index}>
    //             <Label htmlFor={`select-${index}`} className="mr-2">{item.name}</Label>
    //             <Input id={`select-${index}`} type="select" className="form-control" placeholder="Select" onChange={(event) => handleSelectChange(event, index, item)}>
    //               {item.options.map((data, optionIndex) => (
    //                 <option key={optionIndex} value={data}>{data}</option>
    //               ))}
    //             </Input>
    //           </Col>
    //         ))}
    //         <Col className="position-relative">
    //         <MyDatePicker setFromDate={setFromDate} setToDate={setToDate}/>
    //           {/* <Label htmlFor="fromDate" className="mr-2">From Date</Label>
    //           <Input id="fromDate" type="date" className="form-control" max={new Date().toISOString().split('T')[0]} onChange={handleFromDateChange} />
    //           <Button color="link" className="clear-button" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-12%)' }} onClick={clearDates}>
    //             <FaTimes />
    //           </Button> */}
    //         </Col>
    //         {/* &nbsp;&nbsp;&nbsp;&nbsp;
    //         <Col className="position-relative">
    //           <Label htmlFor="toDate" className="mr-2">To Date</Label>
    //           <Input id="toDate" type="date" className="form-control" max={new Date().toISOString().split('T')[0]} min={minToDate} onChange={handleToDateChange} />
    //           <Button color="link" className="clear-button" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-12%)' }} onClick={clearDates}>
    //             <FaTimes />
    //           </Button>
    //         </Col> */}
    //       </Row>
    //     </CardBody>
    //   </Card>
    // </Collapse >

  );
};
