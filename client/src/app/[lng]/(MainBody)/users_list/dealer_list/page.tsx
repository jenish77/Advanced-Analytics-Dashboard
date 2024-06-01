"use client"

import React from 'react'
import { Container, Row } from "reactstrap";
import ApiTableContainer from '@/Components/Form&Table/Tables/DataTable/ApiTable';
import RowCreateCallback from '@/Components/Form&Table/Tables/DataTable/AdvanceInit/RowCreateCallback';
import CommanTable from '@/Components/Form&Table/Tables/CutomTables/CommanTable';
import DealerListTable from '@/Components/Form&Table/Tables/DealerListTable';
import DealerListContainer from '@/Components/Applications/Userlist/Dealer_List';
type Props = {}

const page = (props: Props) => {
    return (
        <DealerListContainer/>
    )
}

export default page