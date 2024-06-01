import { RowCreateCallBackSpan, SearchTableButton } from "@/Constant";
import { ProductListTableDataColumn } from "@/Data/Application/Ecommerce";
import { RowCreateCallData, RowCreateCallList, RowCreateCallColumn } from "@/Data/Form&Table/Table/DataTable/RowCreateCallbackData";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { DealerListFilterHeader } from "./DealerListFilterHeader";
import { CollapseFilterData } from "./CollapseFilterData";
import { DealerColumn, DealerList } from "./DealerListTableData";


const DealerListContainer = () => {
  const [filterText, setFilterText] = useState("");
  const [filteredItems, setfilteredItems] = useState(DealerList)

  // DealerList.filter((item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()));

  useEffect(() => {
    filterText === ""
      ?
      setfilteredItems(DealerList)
      :
      setfilteredItems(DealerList.filter((item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase())))
  }, [filterText])


  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div id="row_create_filter" className="dataTables_filter d-flex align-items-center">
        <Label className="me-1">{SearchTableButton}:</Label>
        <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} />
      </div>
    );
  }, [filterText]);

  return (

    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader className="pb-0 card-no-border">
              {/* <h4>Dealer List</h4> */}
            </CardHeader>
            <CardBody>
              <div className="d-block d-md-flex justify-content-between align-items-start gap-3">
                <div id="row_create_filter" className="dataTables_filter flex-grow-1 mb-3 mb-md-0">
                  <Input placeholder="Search Dealer . . ." onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} type="search" value={filterText} className="w-100%" style={{ maxWidth: '800px' }}
                  />
                </div>
                <div className="list-product-header flex-shrink-0">
                  <DealerListFilterHeader />
                </div>
              </div>
              <CollapseFilterData />
              <div className="list-product">
                <div className="table-responsive">
                  <DataTable data={filteredItems} persistTableHead columns={DealerColumn} highlightOnHover striped pagination className="display dataTable theme-scrollbar tbl_custome" customStyles={{
                    rows: {
                      style: {
                        paddingTop: '15px', // Adjust the top padding as needed
                        paddingBottom: '15px', // Adjust the bottom padding as needed
                      }
                    }
                  }} />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>

  );
};

export default DealerListContainer;
