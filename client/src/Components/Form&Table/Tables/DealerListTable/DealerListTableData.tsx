import { TableColumn } from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import { Input } from "reactstrap";
import { VscEye } from "react-icons/vsc";

export const DealerList = [
    {
        id: 1,
        name: "ABC Motors",
        location: "New York",
        email: "john.doe@example.com",
        balance: "5000",
        phone: "+1 (555) 123-4567",
        status: "Active",
        joinedDate: "2022-03-19",
    },
    {
        id: 2,
        name: "XYZ Auto",
        location: "Los Angeles",
        email: "jane.smith@example.com",
        balance: "155000",
        phone: "+1 (555) 987-6543",
        status: "Active",
        joinedDate: "2022-02-15",
    },
    {
        id: 3,
        name: "LMN Motors",
        location: "Chicago",
        email: "mike.johnson@example.com",
        balance: "505000",
        phone: "+1 (555) 555-5555",
        status: "Active",
        joinedDate: "2022-01-10",
    },
    {
        id: 4,
        name: "PQR Auto",
        location: "Houston",
        email: "emily.brown@example.com",
        balance: "8000",
        phone: "+1 (555) 222-3333",
        status: "Inactive",
        joinedDate: "2021-12-05",
    },
    {
        id: 5,
        name: "DEF Motors",
        location: "Miami",
        email: "david.wilson@example.com",
        balance: "14000",
        phone: "+1 (555) 777-8888",
        status: "Active",
        joinedDate: "2021-11-20",
    },
    {
        id: 6,
        name: "GHI Auto",
        location: "Seattle",
        email: "sarah.lee@example.com",
        balance: "5000",
        phone: "+1 (555) 456-7890",
        status: "Inactive",
        joinedDate: "2021-10-25",
    },
    {
        id: 7,
        name: "JKL Motors",
        location: "San Francisco",
        email: "michael.chen@example.com",
        balance: "3000",
        phone: "+1 (555) 999-0000",
        status: "Active",
        joinedDate: "2021-09-30",
    },
    {
        id: 8,
        name: "RST Auto",
        location: "Dallas",
        email: "anna.davis@example.com",
        balance: "45000",
        phone: "+1 (555) 111-2222",
        status: "Active",
        joinedDate: "2021-08-15",
    },
    {
        id: 9,
        name: "UVW Motors",
        location: "Boston",
        email: "tom.jones@example.com",
        balance: "21000",
        phone: "+1 (555) 333-4444",
        status: "Active",
        joinedDate: "2021-07-20",
    },
    {
        id: 10,
        name: "NOP Auto",
        location: "Atlanta",
        email: "jessica.white@example.com",
        balance: "75000",
        phone: "+1 (555) 777-9999",
        status: "Inactive",
        joinedDate: "2021-06-05",
    },
    {
        id: 11,
        name: "MNO Motors",
        location: "Denver",
        email: "andrew.smith@example.com",
        balance: "78000",
        phone: "+1 (555) 444-5555",
        status: "Inactive",
        joinedDate: "2021-05-10",
    },
    {
        id: 12,
        name: "QRS Auto",
        location: "Phoenix",
        email: "emily.johnson@example.com",
        balance: "146700",
        phone: "+1 (555) 222-1111",
        status: "Active",
        joinedDate: "2021-04-15",
    },
    {
        id: 13,
        name: "VWX Motors",
        location: "Las Vegas",
        email: "chris.davis@example.com",
        balance: "31000",
        phone: "+1 (555) 888-9999",
        status: "Active",
        joinedDate: "2021-03-20",
    },
    {
        id: 14,
        name: "TUV Auto",
        location: "Portland",
        email: "alice.wilson@example.com",
        balance: "24000",
        phone: "+1 (555) 123-9876",
        status: "Active",
        joinedDate: "2021-02-05",
    },
    {
        id: 15,
        name: "XYZ Motors",
        location: "Detroit",
        email: "robert.lee@example.com",
        balance: "1700",
        phone: "+1 (555) 987-6543",
        status: "Active",
        joinedDate: "2021-01-01",
    }
]

export const DealerColumn: TableColumn<any>[] = [
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
