"use client"

import React from 'react'
import { Container, Row } from "reactstrap";
import ApiTableContainer from '@/Components/Form&Table/Tables/DataTable/ApiTable';
import RowCreateCallback from '@/Components/Form&Table/Tables/DataTable/AdvanceInit/RowCreateCallback';
import CommanTable from '@/Components/Form&Table/Tables/CutomTables/CommanTable';
import MerchantListContainer from '@/Components/Applications/Userlist/Merchant_List';
type Props = {}

const page = (props: Props) => {
    return (
        <MerchantListContainer/>
    )
}

export default page