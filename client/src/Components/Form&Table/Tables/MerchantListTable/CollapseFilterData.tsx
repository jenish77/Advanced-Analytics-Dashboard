import { DealerList } from "@/Components/Form&Table/Tables/DealerListTable/DealerListTableData";
import { MerchantList } from "@/Components/Form&Table/Tables/MerchantListTable/MerchantListTableData";
import { useAppSelector } from "@/Redux/Hooks";
import React, { FC, SetStateAction, useEffect, useState } from "react";
import { Card, CardBody, Col, Collapse, Input, Row } from "reactstrap";



export const FiltersData = [
    {
        id: "Location",
        name: "Choose Location",
        options: ["India", "United States", "United Kingdom"],
    },
    {
        id: "Status",
        name: "Choose Status",
        options: ["Active", "Inactive"],
    },
    {
        id: "MinBalance",
        name: "Choose Min Balance",
        options: ["10000", "30000", "50000", "100000"],
    },
    {
        id: "Bussiness Type",
        name: "Choose Bussiness Type",
        options: Array.from(new Set(MerchantList.map(merchant => merchant.businessType))),
    },
];



export const CollapseFilterData = () => {
    const { filterToggle } = useAppSelector((state: any) => state.product);


    const [selectedLocation, setselectedLocation] = useState("")
    const [selectedStatus, setselectedStatus] = useState("")
    const [selectedMinBalance, setselectedMinBalance] = useState("")

    const handleFiterValueSet = (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
        console.log("e>>", e);
        console.log("e>>", item);
        if (item.id === "Location") {
            setselectedLocation(e.target.value)
        }
        else if (item.id === "Status") {
            setselectedStatus(e.target.value)
        }
        else if (item.id === "MinBalance") {
            setselectedMinBalance(e.target.value)
        }
    }


    useEffect(() => {
        console.log("selected Location >> ", selectedLocation);
        console.log("selected Status >> ", selectedStatus);
        console.log("selected Min Balance >> ", selectedMinBalance);
    }, [selectedLocation, selectedMinBalance, setselectedStatus])

    return (
        <Collapse isOpen={filterToggle}>
            <Card className="shadow-none">
                <CardBody className="list-product-body">
                    <Row className="row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
                        {FiltersData.map((item, index) => (
                            <Col key={index}>
                                <Input type="select" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiterValueSet(e, item)}>
                                    <option defaultValue={""}>{item.name}</option>
                                    {item.options.map((data, optionIndex) => (
                                        <option key={optionIndex} value={data} >{data}</option>
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
