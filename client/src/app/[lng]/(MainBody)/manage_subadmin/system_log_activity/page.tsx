"use client"
import SystemLogContainer from '@/Components/Applications/SystemLogActivity'
import { useParams, useSearchParams } from 'next/navigation'
// import { useRouter } from 'next/router'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    return (
        <SystemLogContainer id={id} />
    )
}

export default page