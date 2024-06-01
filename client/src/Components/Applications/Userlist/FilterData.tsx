import { FiltersData, UserFiltersData } from "@/Data/Application/Ecommerce";
import { useAppSelector } from "@/Redux/Hooks";
import React, { FC, useState } from "react";
import { Card, CardBody, Col, Collapse, Input, Label, Row } from "reactstrap";

interface FilterDataProps {
  setStatusData: any;
  setLocationData: any;
}

export const FilterData: FC<FilterDataProps> = ({ setStatusData, setLocationData }) => {
  const { filterToggle } = useAppSelector((state) => state.product);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectChange = (event: any, index: any, item: any) => {
    const selectedValue = event.target.value;
    const updatedSelectedItems: any = [...selectedItems];
    updatedSelectedItems[index] = selectedValue;
    setSelectedItems(updatedSelectedItems);
    if (item.name == "Status") {
      if (selectedValue == "All") {
        setStatusData("")
      } else {
        setStatusData(selectedValue)
      }
    }
    if (item.name == "Location") {
      if (selectedValue == "All") {
        setLocationData("")
      } else {
        setLocationData(selectedValue)
      }
    }
  };

  return (
      UserFiltersData.map((item, index) => (
        <Input type="select" placeholder="select" className="form-control" style={{ minWidth: "200px" }} onChange={(event) => handleSelectChange(event, index, item)}>
          {item.options.map((data, optionIndex) => (
            <option key={optionIndex} value={data}>{data}</option>
          ))}
        </Input>
      ))
    // <Collapse isOpen={filterToggle}>
    //   <Card className="shadow-none">
    //     <CardBody className="list-product-body">
    //       <Row className="row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
    //         {UserFiltersData.map((item, index) => (
    //           <Col key={index}>
    //             <Label >{ item.name }</Label>
    //             <Input type="select" placeholder="select" onChange={(event) => handleSelectChange(event, index, item)}>
    //               {item.options.map((data, optionIndex) => (
    //                 <option key={optionIndex} value={data}>{data}</option>
    //               ))}
    //             </Input>
    //           </Col>
    //         ))}
    //       </Row>
    //     </CardBody>
    //   </Card>
    // </Collapse>
  );
};
