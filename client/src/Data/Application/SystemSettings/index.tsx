export const MethodSettingsListData = [
    {
        id: "MID12345357511",
        name: "PayPal",
        image: "paypal.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: true,
        withdraw: true,
        apiAccess: true,
        minTransaction: 10,
        maxTransaction: 10000,
        autoRejectMinimum: 5,
        status: true,
    },
    {
        id: "MID12345357512",
        name: "Stripe",
        image: "visa.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: false,
        withdraw: true,
        apiAccess: true,
        minTransaction: 5,
        maxTransaction: 5000,
        autoRejectMinimum: 5,
        status: false,
    },
    {
        id: "MID12345357513",
        name: "Authorize.Net",
        image: "mastercard.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: true,
        withdraw: true,
        apiAccess: false,
        minTransaction: 20,
        maxTransaction: 20000,
        autoRejectMinimum: 10,
        status: false,
    },
    {
        id: "MID12345357514",
        name: "Braintree",
        image: "card.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: false,
        withdraw: false,
        apiAccess: false,
        minTransaction: 15,
        maxTransaction: 15000,
        autoRejectMinimum: 12,
        status: false,
    },
    {
        id: "MID12345357515",
        name: "Square",
        image: "paypal.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: true,
        withdraw: true,
        apiAccess: true,
        minTransaction: 25,
        maxTransaction: 25000,
        autoRejectMinimum: 5,
        status: true,
    },
    {
        id: "MID12345357516",
        name: "2Checkout",
        image: "visa.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: true,
        withdraw: true,
        apiAccess: false,
        minTransaction: 30,
        maxTransaction: 30000,
        autoRejectMinimum: 5,
        status: true,
    },
    {
        id: "MID12345357517",
        name: "Authorize.Net",
        image: "mastercard.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: true,
        withdraw: true,
        apiAccess: false,
        minTransaction: 20,
        maxTransaction: 20000,
        autoRejectMinimum: 7,
        status: false,
    },
    {
        id: "MID12345357518",
        name: "Payoneer",
        image: "paypal.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: true,
        withdraw: true,
        apiAccess: true,
        minTransaction: 10,
        maxTransaction: 10000,
        autoRejectMinimum: 5,
        status: true,
    },
    {
        id: "MID12345357519",
        name: "Worldpay",
        image: "mastercard.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: true,
        withdraw: false,
        apiAccess: false,
        minTransaction: 25,
        maxTransaction: 25000,
        autoRejectMinimum: 7,
        status: true,
    },
    {
        id: "MID123453575110",
        name: "Skrill",
        image: "paypal.png",
        apiKey: "API_KEY",
        secretKey: "************1234",
        deposit: true,
        withdraw: true,
        apiAccess: true,
        minTransaction: 15,
        maxTransaction: 15000,
        autoRejectMinimum: 5,
        status: true,
    }
]

export const TransferSettingData = [
    {
        id: "MID12345357511",
        gateWay: "PayPal",
        name: "Suyog"
    },
    {
        id: "MID12345357512",
        gateWay: "Stripe",
        name: "Suyog"
    },
    {
        id: "MID12345357513",
        gateWay: "Authorize.Net",
        name: "Suyog"
    },
    {
        id: "MID12345357514",
        gateWay: "Braintree",
        name: "Suyog"
    },
    {
        id: "MID12345357515",
        gateWay: "Square",
        name: "Suyog"
    },
    {
        id: "MID12345357516",
        gateWay: "2Checkout",
        name: "Suyog"
    },
    {
        id: "MID12345357517",
        gateWay: "Authorize.Net",
        name: "Suyog"
    },
    {
        id: "MID12345357518",
        gateWay: "Payoneer",
        name: "Suyog"
    },
    {
        id: "MID12345357519",
        gateWay: "Worldpay",
        name: "Suyog"
    },
    {
        id: "MID123453575110",
        gateWay: "Skrill",
        name: "Suyog"
    }
]

export const ManageBanksTableData = [
    {
        id: "ID1231",
        username: "archana",
        balance: 5000,
        company: "Company A",
        bankName: "Bank of America",
        accountOwner: "John Doe",
        accountIBAN: "US12345678901234",
        limit: 10000,
        api: "https://api.wellsfargo123.com",
        status: "Active",
        approvalType: "Automatic"
    },
    {
        id: "ID1232",
        username: "archana",
        balance: 7000,
        company: "Company B",
        bankName: "Chase Bank",
        accountOwner: "Jane Smith",
        accountIBAN: "US23456789012345",
        limit: 15000,
        api: "https://api.wellsfargo456.com",
        status: "Active",
        approvalType: "Manual"
    },
    {
        id: "ID1233",
        username: "archana",
        balance: 10000,
        company: "Company C",
        bankName: "Wells Fargo",
        accountOwner: "Alice Johnson",
        accountIBAN: "US34567890123456",
        limit: 20000,
        api: "https://api.wellsfargo789.com",
        status: "Inactive",
        approvalType: "Automatic"
    },
    {
        id: "ID1234",
        username: "archana",
        balance: 3000,
        company: "Company D",
        bankName: "Citibank",
        accountOwner: "Bob Williams",
        accountIBAN: "US45678901234567",
        limit: 12000,
        api: "https://api.wellsfargo101.com",
        status: "Inactive",
        approvalType: "Manual"
    },
    {
        id: "ID1235",
        username: "archana",
        balance: 9000,
        company: "Company E",
        bankName: "HSBC",
        accountOwner: "David Brown",
        accountIBAN: "US56789012345678",
        limit: 18000,
        api: "https://api.wellsfargo112.com",
        status: "Active",
        approvalType: "Automatic"
    },
    {
        id: "ID1236",
        username: "archana",
        balance: 6000,
        company: "Company F",
        bankName: "TD Bank",
        accountOwner: "Emily Taylor",
        accountIBAN: "US67890123456789",
        limit: 25000,
        api: "https://api.wellsfargo223.com",
        status: "Active",
        approvalType: "Manual"
    },
    {
        id: "ID1237",
        username: "archana",
        balance: 8000,
        company: "Company G",
        bankName: "BB&T",
        accountOwner: "Michael Anderson",
        accountIBAN: "US78901234567890",
        limit: 14000,
        api: "https://api.wellsfargo334.com",
        status: "Active",
        approvalType: "Automatic"
    },
    {
        id: "ID1238",
        username: "archana",
        balance: 12000,
        company: "Company H",
        bankName: "Capital One",
        accountOwner: "Olivia Garcia",
        accountIBAN: "US89012345678901",
        limit: 30000,
        api: "https://api.wellsfargo445.com",
        status: "Inactive",
        approvalType: "Manual"
    },
    {
        id: "ID1239",
        username: "archana",
        balance: 4000,
        company: "Company I",
        bankName: "PNC Bank",
        accountOwner: "Sophia Martinez",
        accountIBAN: "US90123456789012",
        limit: 20000,
        api: "https://api.wellsfargo556.com",
        status: "Active",
        approvalType: "Automatic"
    },
    {
        id: "ID1293",
        username: "archana0",
        balance: 15000,
        company: "Company J",
        bankName: "SunTrust",
        accountOwner: "William Rodriguez",
        accountIBAN: "US01234567890123",
        limit: 25000,
        api: "https://api.wellsfargo667.com",
        status: "Active",
        approvalType: "Manual"
    },
    {
        id: "ID1293",
        username: "archana1",
        balance: 11000,
        company: "Company K",
        bankName: "US Bank",
        accountOwner: "Abigail Hernandez",
        accountIBAN: "US12345678901234",
        limit: 18000,
        api: "https://api.wellsfargo778.com",
        status: "Active",
        approvalType: "Automatic"
    },
    {
        id: "ID1293",
        username: "archana2",
        balance: 5000,
        company: "Company L",
        bankName: "Regions Bank",
        accountOwner: "James Nguyen",
        accountIBAN: "US23456789012345",
        limit: 22000,
        api: "https://api.wellsfargo889.com",
        status: "Inactive",
        approvalType: "Manual"
    },
    {
        id: "ID1293",
        username: "archana3",
        balance: 8000,
        company: "Company M",
        bankName: "Fifth Third Bank",
        accountOwner: "Isabella Kim",
        accountIBAN: "US34567890123456",
        limit: 28000,
        api: "https://api.wellsfargo990.com",
        status: "Active",
        approvalType: "Automatic"
    },
    {
        id: "ID1293",
        username: "archana4",
        balance: 2000,
        company: "Company N",
        bankName: "Ally Bank",
        accountOwner: "Benjamin Lee",
        accountIBAN: "US45678901234567",
        limit: 15000,
        api: "https://api.wellsfargo1010.com",
        status: "Active",
        approvalType: "Manual"
    },
    {
        id: "ID1293",
        username: "archana5",
        balance: 10000,
        company: "Company O",
        bankName: "Ally Bank",
        accountOwner: "Benjamin Lee",
        accountIBAN: "US45678901234567",
        limit: 15000,
        api: "https://api.wellsfargo1010.com",
        status: "Active",
        approvalType: "Manual"
    }
]


export const DomainListTableData = [
    {
        id: "ID12544567836",
        domainName: "example.com",
        merchantName: "Archna Merchant A",
        dateTime: "2024-03-22T10:30:00",
        status: "Active"
    },
    {
        id: "ID12544567836",
        domainName: "sample.net",
        merchantName: "Archna Merchant B",
        dateTime: "2024-03-23T14:45:00",
        status: "Inactive"
    },
    {
        id: "ID12544567836",
        domainName: "test.org",
        merchantName: "Archna Merchant C",
        dateTime: "2024-03-24T09:15:00",
        status: "Active"
    },
    {
        id: "ID12544567836",
        domainName: "example.com",
        merchantName: "Archna Merchant A",
        dateTime: "2024-03-22T10:30:00",
        status: "Active"
    },
    {
        id: "ID12544567836",
        domainName: "sample.net",
        merchantName: "Archna Merchant B",
        dateTime: "2024-03-23T14:45:00",
        status: "Inactive"
    },
    {
        id: "ID12544567836",
        domainName: "test.org",
        merchantName: "Archna Merchant C",
        dateTime: "2024-03-24T09:15:00",
        status: "Active"
    },
    {
        id: "ID12544567836",
        domainName: "example.com",
        merchantName: "Archna Merchant A",
        dateTime: "2024-03-22T10:30:00",
        status: "Active"
    },
    {
        id: "ID12544567836",
        domainName: "sample.net",
        merchantName: "Archna Merchant B",
        dateTime: "2024-03-23T14:45:00",
        status: "Inactive"
    },
    {
        id: "ID12544567836",
        domainName: "test.org",
        merchantName: "Archna Merchant C",
        dateTime: "2024-03-24T09:15:00",
        status: "Active"
    },
    {
        id: "ID12544567836",
        domainName: "example.com",
        merchantName: "Archna Merchant A",
        dateTime: "2024-03-22T10:30:00",
        status: "Active"
    }
]


export const IpListsTableData = [
    {
        id: "ID9787871",
        ipAddress: "192.168.1.1",
        merchantName: "Archna Merchant A",
        dateTime: "2024-03-22T10:30:00",
        country: "United States",
        status: "Active"
    },
    {
        id: "ID9787872",
        ipAddress: "203.0.113.2",
        merchantName: "Archna Merchant B",
        dateTime: "2024-03-23T14:45:00",
        country: "Canada",
        status: "Inactive"
    },
    {
        id: "ID9787873",
        ipAddress: "198.51.100.3",
        merchantName: "Archna Merchant C",
        dateTime: "2024-03-24T09:15:00",
        country: "United Kingdom",
        status: "Active"
    },
    {
        id: "ID9787874",
        ipAddress: "192.0.2.4",
        merchantName: "Archna Merchant D",
        dateTime: "2024-03-25T11:20:00",
        country: "Australia",
        status: "Active"
    },
    {
        id: "ID9787875",
        ipAddress: "172.16.0.5",
        merchantName: "Archna Merchant E",
        dateTime: "2024-03-26T13:55:00",
        country: "Germany",
        status: "Inactive"
    },
    {
        id: "ID9787876",
        ipAddress: "10.0.0.6",
        merchantName: "Archna Merchant F",
        dateTime: "2024-03-27T08:40:00",
        country: "Japan",
        status: "Active"
    },
    {
        id: "ID9787877",
        ipAddress: "192.168.0.7",
        merchantName: "Archna Merchant G",
        dateTime: "2024-03-28T16:10:00",
        country: "France",
        status: "Active"
    },
    {
        id: "ID9787878",
        ipAddress: "172.31.0.8",
        merchantName: "Archna Merchant H",
        dateTime: "2024-03-29T12:25:00",
        country: "Spain",
        status: "Inactive"
    },
    {
        id: "ID9787879",
        ipAddress: "203.0.113.9",
        merchantName: "Archna Merchant I",
        dateTime: "2024-03-30T14:30:00",
        country: "Italy",
        status: "Active"
    },
    {
        id: "ID9787897",
        ipAddress: "198.18.0.10",
        merchantName: "Archna Merchant J",
        dateTime: "2024-03-31T09:50:00",
        country: "Brazil",
        status: "Inactive"
    }
]


export const ManageCurrencyTableData = [
    {
        id: "ID123451",
        currencyCode: "USD",
        currencyName: "US Dollar",
        symbol: "$",
        country: "United States",
        status: "Active"
    },
    {
        id: "ID123459",
        currencyCode: "INR",
        currencyName: "Indian Rupee",
        symbol: "₹",
        country: "India",
        status: "Active"
    },
    {
        id: "ID123452",
        currencyCode: "EUR",
        currencyName: "Euro",
        symbol: "€",
        country: "Eurozone",
        status: "Active"
    },
    {
        id: "ID123453",
        currencyCode: "GBP",
        currencyName: "British Pound",
        symbol: "£",
        country: "United Kingdom",
        status: "Inactive"
    },
    {
        id: "ID123454",
        currencyCode: "JPY",
        currencyName: "Japanese Yen",
        symbol: "¥",
        country: "Japan",
        status: "Active"
    },
    {
        id: "ID123455",
        currencyCode: "AUD",
        currencyName: "Australian Dollar",
        symbol: "A$",
        country: "Australia",
        status: "Active"
    },
    {
        id: "ID123456",
        currencyCode: "CAD",
        currencyName: "Canadian Dollar",
        symbol: "C$",
        country: "Canada",
        status: "Active"
    },
    {
        id: "ID123457",
        currencyCode: "CHF",
        currencyName: "Swiss Franc",
        symbol: "Fr",
        country: "Switzerland",
        status: "Inactive"
    },
    {
        id: "ID123458",
        currencyCode: "CNY",
        currencyName: "Chinese Yuan",
        symbol: "¥",
        country: "China",
        status: "Inactive"
    },
    {
        id: "ID123462",
        currencyCode: "SGD",
        currencyName: "Singapore Dollar",
        symbol: "S$",
        country: "Singapore",
        status: "Active"
    }
]


export const SystemConfigrationsData = [
    {
        id: 1,
        title: "Deposit",
        content: "If the deposit main setting for the admin is turned off, all deposit transactions will be halted until the setting is enabled again.",
        status: true
    },
    {
        id: 2,
        title: "Withdraw",
        content: "If the withdraw main setting for the admin is turned off, all withdraw transactions will be halted until the setting is enabled again.",
        status: true
    },
    {
        id: 3,
        title: "API Access",
        content: "If the API Access main setting for the admin is turned off, all API Access transactions will be halted until the setting is enabled again.",
        status: true
    },
    {
        id: 5,
        title: "Dealer Login",
        content: "When the 'Dealer Login' setting is disabled, Delaer will be unable to access their accounts through the login portal. This setting can only be modified by administrators through the admin site, thereby controlling access to Dealer accounts.",
        status: true
    },
    {
        id: 4,
        title: "Merchant Login",
        content: "When the 'Merchant Login' setting is disabled, merchants will be unable to access their accounts through the login portal. This setting can only be modified by administrators through the admin site, thereby controlling access to merchant accounts.",
        status: true
    },
]


export const TransferSettingsListData = []