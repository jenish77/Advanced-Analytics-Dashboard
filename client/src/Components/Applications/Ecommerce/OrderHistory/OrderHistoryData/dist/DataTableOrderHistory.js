"use strict";
exports.__esModule = true;
var reactstrap_1 = require("reactstrap");
var Constant_1 = require("@/Constant");
var react_data_table_component_1 = require("react-data-table-component");
var CommonCardHeader_1 = require("@/CommonComponent/CommonCardHeader");
var Ecommerce_1 = require("@/Data/Application/Ecommerce");
var react_1 = require("react");
var DataTableOrderHistory = function () {
    var _a = react_1.useState(""), filterText = _a[0], setFilterText = _a[1];
    var filteredItems = Ecommerce_1.OrderHistoryData.filter(function (item) { return item.productName && item.productName.toLowerCase().includes(filterText.toLowerCase()); });
    var subHeaderComponentMemo = react_1.useMemo(function () {
        return (React.createElement("div", { id: "basic-1_filter", className: "dataTables_filter d-flex align-items-center" },
            React.createElement(reactstrap_1.Label, { className: "me-2" },
                Constant_1.SearchTableButton,
                ":"),
            React.createElement(reactstrap_1.Input, { onChange: function (e) { return setFilterText(e.target.value); }, type: "search", value: filterText })));
    }, [filterText]);
    return (React.createElement(reactstrap_1.Col, { sm: "12" },
        React.createElement(reactstrap_1.Card, null,
            React.createElement(CommonCardHeader_1["default"], { title: Constant_1.OrdersHistory }),
            React.createElement(reactstrap_1.CardBody, null,
                React.createElement("div", { className: "order-history table-responsive" },
                    React.createElement(react_data_table_component_1["default"], { data: filteredItems, columns: Ecommerce_1.OrderHistoryDataColumn, className: "dataTables_wrapper no-footer", highlightOnHover: true, noHeader: true, pagination: true, paginationServer: true, subHeader: true, subHeaderComponent: subHeaderComponentMemo }))))));
};
exports["default"] = DataTableOrderHistory;
