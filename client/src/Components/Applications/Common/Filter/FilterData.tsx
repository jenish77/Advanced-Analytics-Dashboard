// import { FiltersData } from "@/Data/Application/Ecommerce";
import { useAppSelector } from "@/Redux/Hooks";
import React, { useState } from "react";
import { Card, CardBody, Col, Collapse, Input, Row } from "reactstrap";


const FiltersData = [
  {
    title: "Status",
    options: [
      {
        name: "Active",
        value: 1
      }
      , {
        name: "Inactive",
        value: 0
      }
    ],
  },
  {
    title: "bussiness type",
    options: [
      {
        name: "Furniture",
        value: "furniure"
      },
      {
        name: "Glossary",
        value: "Glossary"
      },
      {
        name: "Electrics",
        value: "Electrics"
      }
    ],
  },
  {
    title: "bussiness type",
    options: [
      {
        name: "Furniture",
        value: "furniure"
      },
      {
        name: "Glossary",
        value: "Glossary"
      },
      {
        name: "Electrics",
        value: "Electrics"
      }
    ],
  }
];


export const FilterData = () => {
  const { filterToggle } = useAppSelector((state) => state.product);

  const [selectedValues, setSelectedValues] = useState<any>({});

  const handleSelectChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedValues((prevValues: any) => ({
      ...prevValues,
      [fieldName]: newValue
    }));
  };


  console.log("common filtered values with filter name _____:::___", selectedValues);


  return (
    <Collapse isOpen={filterToggle}>
      <Card className="shadow-none">
        <CardBody className="list-product-body">
          <Row className="row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
            {FiltersData.map((item, index) => (
              <Col key={index}>
                <Input
                  type="select"
                  value={selectedValues[item.title] || ''} // Set the value from state
                  onChange={e => handleSelectChange(item.title, e)}
                >
                  <option className="text-secondary f-14 p-1" value={""}>{item.title}</option>
                  {item.options.map((data, optionIndex) => (
                    <option key={optionIndex} value={data.value}>{data.name}</option>
                  ))}
                </Input>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </Collapse>
  );
};
