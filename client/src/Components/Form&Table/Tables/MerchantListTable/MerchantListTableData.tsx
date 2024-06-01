import { StarColor } from "@/Constant";
import { CustomCellInterFaceProp, RowCreateCallBackData } from "@/Types/TableType";
import { TableColumn } from "react-data-table-component";
import { Alert, Badge, Button, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label, Progress, UncontrolledDropdown } from "reactstrap";
import { VscEye } from "react-icons/vsc";
import { FaTrash } from "react-icons/fa";


export const MerchantList =
    [
        {
            id: 1,
            name: "Merchant A",
            location: "City X",
            contactPerson: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            businessType: "Retail",
            status: "Active",
            joinedDate: "2023-01-01",
            balance: 5000
        },
        {
            id: 2,
            name: "Merchant B",
            location: "City Y",
            contactPerson: "Jane Smith",
            email: "jane@example.com",
            phone: "+1987654321",
            businessType: "Restaurant",
            status: "Active",
            joinedDate: "2022-11-15",
            balance: 7500
        },
        {
            id: 3,
            name: "Merchant C",
            location: "City Z",
            contactPerson: "Alice Johnson",
            email: "alice@example.com",
            phone: "+1122334455",
            businessType: "Clothing",
            status: "Active",
            joinedDate: "2023-02-20",
            balance: 6200
        },
        {
            id: 4,
            name: "Merchant D",
            location: "City W",
            contactPerson: "Bob Williams",
            email: "bob@example.com",
            phone: "+9988776655",
            businessType: "Electronics",
            status: "Active",
            joinedDate: "2022-12-10",
            balance: 4800
        },
        {
            id: 5,
            name: "Merchant E",
            location: "City V",
            contactPerson: "Emma Brown",
            email: "emma@example.com",
            phone: "+3344556677",
            businessType: "Furniture",
            status: "Active",
            joinedDate: "2023-03-05",
            balance: 5500
        },
        {
            id: 6,
            name: "Merchant F",
            location: "City U",
            contactPerson: "David Wilson",
            email: "david@example.com",
            phone: "+6677889900",
            businessType: "Grocery",
            status: "Active",
            joinedDate: "2023-04-12",
            balance: 7000
        },
        {
            id: 7,
            name: "Merchant G",
            location: "City T",
            contactPerson: "Sophia Martinez",
            email: "sophia@example.com",
            phone: "+1122334455",
            businessType: "Hardware",
            status: "Active",
            joinedDate: "2022-10-22",
            balance: 4000
        },
        {
            id: 8,
            name: "Merchant H",
            location: "City S",
            contactPerson: "William Taylor",
            email: "william@example.com",
            phone: "+7788990011",
            businessType: "Jewelry",
            status: "Active",
            joinedDate: "2023-05-18",
            balance: 6300
        },
        {
            id: 9,
            name: "Merchant I",
            location: "City R",
            contactPerson: "Ava Rodriguez",
            email: "ava@example.com",
            phone: "+9988776655",
            businessType: "Books",
            status: "Active",
            joinedDate: "2022-09-30",
            balance: 5800
        },
        {
            id: 10,
            name: "Merchant J",
            location: "City Q",
            contactPerson: "Noah Garcia",
            email: "noah@example.com",
            phone: "+1122334455",
            businessType: "Sporting Goods",
            status: "Active",
            joinedDate: "2023-07-08",
            balance: 6900
        },
        {
            id: 11,
            name: "Merchant K",
            location: "City P",
            contactPerson: "Olivia Lee",
            email: "olivia@example.com",
            phone: "+1234567890",
            businessType: "Cosmetics",
            status: "Active",
            joinedDate: "2022-08-15",
            balance: 5100
        },
        {
            id: 12,
            name: "Merchant L",
            location: "City O",
            contactPerson: "Liam Martinez",
            email: "liam@example.com",
            phone: "+9988776655",
            businessType: "Home Decor",
            status: "Active",
            joinedDate: "2023-06-22",
            balance: 7200
        },
        {
            id: 13,
            name: "Merchant M",
            location: "City N",
            contactPerson: "Ella Harris",
            email: "ella@example.com",
            phone: "+3344556677",
            businessType: "Stationery",
            status: "Active",
            joinedDate: "2022-11-01",
            balance: 4600
        },
        {
            id: 14,
            name: "Merchant N",
            location: "City M",
            contactPerson: "Logan Jackson",
            email: "logan@example.com",
            phone: "+1234567890",
            businessType: "Appliances",
            status: "Active",
            joinedDate: "2022-11-01",
            balance: 4600
        }
    ]


export const MerchantColumn: TableColumn<any>[] = [
    {
        name: "Id",
        cell: (row: { id: any; }) => `${row.id}`,
        width: '60px',
    },
    {
        name: "Name",
        selector: (row: { name: string; }) => `${row.name}`,
        sortable: true,
    },
    {
        name: "Email",
        cell: (row: { email: any; }) => row.email,
        // minWidth: "200px"
    },
    {
        name: "Location",
        cell: (row: { location: string; }) => `${row.location}`,
    },
    {
        name: "Contact Number",
        cell: (row: { phone: string; }) => `${row.phone}`,
    },
    {
        name: "Status",
        cell: (row: { status: any; }) =>
            <div className={`form-check form-switch `} >
                <Input type="switch" role="switch" style={{ width: '32px', height: '18px' }} />
            </div>
    },
    {
        name: "Bussiness type",
        selector: (row: { businessType: any; }) => row.businessType,
    },
    {
        name: "Balance",
        selector: (row: { balance: any; }) => row.balance,
        sortable: true,
        // style:{ fontSize: '16px' }
    },
    {
        name: "Joined Date",
        selector: (row: { joinedDate: any; }) => row.joinedDate,
        sortable: true,
    },
    {
        name: "Actions",
        cell: (row: { salary: number; }) =>
            <ul className="action simple-list d-flex flex-row gap-2 gap-md-3 align-items-center">
                <li className="view text-primary">
                    <VscEye style={{ width: '20px', height: '20px' }} />
                </li>
                <li className="delete text-danger">
                    <FaTrash style={{ width: '16px', height: '16px' }} />
                </li>
            </ul>,
    },
];
