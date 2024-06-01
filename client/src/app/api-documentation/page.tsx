'use client'
import React, { useEffect, useState } from 'react';
import IcnCopy from '@/CommonComponent/Icon/IcnCopy';
import IcnJs from '@/CommonComponent/Icon/IcnJs';
import IcnNode from '@/CommonComponent/Icon/IcnNode';
import IcnPhp from '@/CommonComponent/Icon/IcnPhp';
import IcnPython from '@/CommonComponent/Icon/IcnPython';
import IcnGreenDot from '@/CommonComponent/Icon/IcnGreenDot';
import IcnRedDot from '@/CommonComponent/Icon/IcnRedDot';
import IcnDown from '@/CommonComponent/Icon/IcnDown';

const language = [
    {
        id: 1,
        title: 'Shell',
        icon: <IcnJs />,
    },
    {
        id: 2,
        title: 'Python',
        icon: <IcnPython />,
    },
    {
        id: 3,
        title: 'PHP',
        icon: <IcnPhp />,
    },
    {
        id: 4,
        title: 'NodeJS',
        icon: <IcnNode />,
    }
]

const resList = [
    {
        icon: <IcnGreenDot />,
        status: '200'
    },
    {
        icon: <IcnRedDot />,
        status: '400'
    }
]

const ApiDocumentation = () => {
    const [lang, setLang] = useState(language[0]);
    const [open, setOpen] = useState(false);
    const [selectValue, setSelectValue] = useState(resList[0]);
    const [id, setId] = useState();
    const [urlCopy, setUrlCopy] = useState(false);

    const scrollToSection = (sectionId: any) => {
        const abc = document.getElementsByClassName('inner_part1')[0];
        const section = document.getElementById(sectionId);
        if (section) {
            abc?.scrollTo({
                top: section.offsetTop - 16,
                behavior: "smooth",
            });
        }
    };

    const RightScrollToSection = (sectionId: any) => {
        const abc = document.getElementsByClassName('inner_part2')[0];
        const section = document.getElementById(sectionId);
        if (section) {
            abc?.scrollTo({
                top: section.offsetTop - 10,
                behavior: "smooth",
            });
        }
    };

    // useEffect(() => {
    //     document.querySelector('.inner_part1').addEventListener('scroll', function () {
    //         const mainDiv = this;
    //         var children = mainDiv.children;
    //         var visibleChildId;

    //         for (var i = 0; i < children.length; i++) {
    //             var child = children[i];
    //             var rect = child.getBoundingClientRect();

    //             // Check if the child is in the view
    //             if (rect.top === 0 || rect.bottom >= 400) {
    //                 // if (rect.top === 200 || rect.bottom <= 500) {
    //                 visibleChildId = child.id;
    //                 if (child.id == 'supported_currencies') {
    //                     RightScrollToSection('right_supported_currencies')
    //                 }
    //                 if (child.id == 'deposit') {
    //                     RightScrollToSection('right_deposit')
    //                 }
    //                 if (child.id == 'withdraw') {
    //                     RightScrollToSection('right_withdraw')
    //                 }
    //                 if (child.id == 'all_transactions') {
    //                     RightScrollToSection('right_all_transactions')
    //                 }
    //                 if (child.id == 'transaction') {
    //                     RightScrollToSection('right_transaction')
    //                 }
    //                 break;
    //             }
    //         }
    //     });


    // }, [])

    useEffect(() => {
        const handleScroll = (event: Event) => {
            const mainDiv = event.target as HTMLElement;
            const children = mainDiv.children;
            let visibleChildId: string | undefined;

            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                const rect = child.getBoundingClientRect();

                if (rect.top === 0 || rect.bottom >= 250) {
                    visibleChildId = child.id;
                    if (child.id === 'supported_currencies') {
                        RightScrollToSection('right_supported_currencies');
                    }
                    if (child.id === 'deposit') {
                        RightScrollToSection('right_deposit');
                    }
                    if (child.id === 'withdraw') {
                        RightScrollToSection('right_withdraw');
                    }
                    if (child.id === 'all_transactions') {
                        RightScrollToSection('right_all_transactions');
                    }
                    if (child.id === 'transaction') {
                        RightScrollToSection('right_transaction');
                    }
                    break;
                }
            }
        };

        const innerPart1 = document.querySelector('.inner_part1');
        if (innerPart1) {
            innerPart1.addEventListener('scroll', handleScroll);
        }

        // Cleanup event listener on component unmount
        // return () => {
        //     if (innerPart1) {
        //         innerPart1.removeEventListener('scroll', handleScroll);
        //     }
        // };
    }, []);

    const copyUrl = (ids: any, key: any) => {
        setId(ids);
        setUrlCopy(true);
        navigator?.clipboard?.writeText(key);
        setTimeout(() => {
            setUrlCopy(false);
        }, 2000);
    }


    return (
        <div className='api_wrapper'>
            <div className="first_part">
                <h3>Introduction</h3>
                <ul className='mb-3'>
                    <li onClick={() => scrollToSection('key_setup')}>API Key Setup</li>
                    <li onClick={() => scrollToSection('jwt_token')}>Generate JWT Token</li>
                </ul>
                <h3>API</h3>
                <ul>
                    <li onClick={() => { scrollToSection('supported_currencies'); RightScrollToSection('right_supported_currencies') }}>Supported Currencies</li>
                    <li onClick={() => { scrollToSection('deposit'); RightScrollToSection('right_deposit') }}>Deposit</li>
                    <li onClick={() => { scrollToSection('withdraw'); RightScrollToSection('right_withdraw') }}>Withdraw</li>
                    {/* <li onClick={() => { scrollToSection('all_transactions'); RightScrollToSection('right_all_transactions') }}>All Transactions</li> */}
                    {/* <li onClick={() => { scrollToSection('transaction'); RightScrollToSection('right_transaction') }}>Transaction</li> */}
                </ul>
            </div>
            <div className="second_part flex-grow-1">
                <div className="inner_part1 theme_scrollbar">
                    <div className="title">Introduction</div>
                    <div className="sub_content pb-4 border-bottom border-black" id='key_setup'>
                        <h4 className='my-3'>API Key Setup</h4>
                        <ul>
                            <li>Register with Payment Hub and from home page you can able for file the API Section.</li>
                            <li>You can create many API for different purpose.</li>
                            <li>You can get two keys which is Auth Key and Enc Key.</li>
                            <li>Once it created from Payment Hub Application it will goes for admin approval once its approve you can integrate in your system.</li>
                            <li>API Base Url <span>/supportedCurrency</span></li>
                        </ul>
                    </div>
                    <div className="sub_content pb-3" id='jwt_token'>
                        <h4 className='my-3'>Generate JWT Token</h4>
                        <ul className='outer_li'>
                            <li>
                                <h5>Get Currency and Generate IFrame</h5>
                                <ul>
                                    <li>Algorithm will be : HS256</li>
                                    <li>You are required to make a signatureString using crypto sha256.</li>
                                    <p>E.g. crypto.createHash("sha256").update(JSON.stringify(‘merchantId#api_key#secret_key’)).digest().toString("hex")</p>
                                    <li>Following is your payload for json</li>
                                    <div>
                                        <p>&#123;</p>
                                        <div className="code">
                                            <p>"uri": "path",</p>
                                            <p>"iat": DateTime.now(),</p>
                                            <p>"exp": DateTime.now() + 60</p>
                                            <p>"key": {"authKey"},</p>
                                            <p>"signatureString": signatureString</p>
                                        </div>
                                        <p>&#125;</p>
                                    </div>
                                    <li>Datetime should be in GTM format.</li>
                                    <li>For the sign JWT we required to use Enc Key</li>
                                </ul>
                            </li>
                            <li>
                                <h5>Deposit and Withdraw </h5>
                                <ul>
                                    <li>Algorithm will be : HS256</li>
                                    <li>You are required to make a signatureString using crypto sha256.</li>
                                    <p>E.g. crypto.createHash("sha256").update(JSON.stringify(‘methodId#bankId#currencyId’)).digest().toString("hex")</p>
                                    <li>Following is your payload for json</li>
                                    <div>
                                        <p>&#123;</p>
                                        <div className="code">
                                            <p>"uri": "path",</p>
                                            <p>"iat": DateTime.now(),</p>
                                            <p>"exp": DateTime.now() + 60</p>
                                            <p>"key": {"authKey"},</p>
                                            <p>"signatureString": signatureString</p>
                                        </div>
                                        <p>&#125;</p>
                                    </div>
                                    <li>Datetime should be in GTM format.</li>
                                    <li>For the sign JWT we required to use Enc Key</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className="title mt-4">API</div>
                    <div className="sub_content" id='supported_currencies'>
                        <div className="content">
                            <h4>Supported Currencies</h4>
                            <div className="url">
                                <div className="url_data">
                                    <p>GET</p>
                                    <p>/get-currency</p>
                                </div>
                                <div className="copy_wrapper" onClick={() => copyUrl('supported_currencies', '/get-currency')}>
                                    <IcnCopy />
                                </div>
                                {(id === 'supported_currencies' && urlCopy) && <div className="copy_lable">Copied</div>}
                            </div>
                            <p>This api is used for get supported currency</p>
                            <h5>Headers:</h5>
                            <div className="tbl_wrapper">
                                <table className="tbl_header">
                                    <thead>
                                        <tr>
                                            <th className="border border-black" style={{ width: '150px' }}>Key</th>
                                            <th className="border border-black" style={{ width: '500px' }}>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        <tr>
                                            <td className="border border-black text-dark-gray font-700" style={{ width: '150px' }}>signatureToken</td>
                                            <td className="border border-black text-dark-gray font-700" style={{ width: '500px' }}>
                                                Generate JWT token as explain in section "Generate JWT
                                                Token" using empty string
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <h5>Request Body:</h5>
                            <div className="tbl_wrapper overflow-x-auto">
                                <table className="tbl_header tbl_res">
                                    <thead >
                                        <tr>
                                            <th className="border border-black" style={{ width: '150px' }}>Key</th>
                                            <th className="border border-black" style={{ width: '150px' }}>Value</th>
                                            <th className="border border-black" style={{ width: '400px' }}>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-14 font-500">
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>merchantId</td>
                                            <td className="border border-black" style={{ width: '150px' }}>BTC</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Merchant id which you have
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>api_key</td>
                                            <td className="border border-black" style={{ width: '150px' }}>String</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Apikey of Merchant
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>secret_key</td>
                                            <td className="border border-black" style={{ width: '150px' }}>String</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Secretkey of Merchant
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="sub_content" id='deposit'>
                        <div className="content">
                            <h4>Deposit</h4>
                            <div className="url">
                                <div className="url_data">
                                    <p>POST</p>
                                    <p>/deposit-amount</p>
                                </div>
                                <div className="copy_wrapper" onClick={() => copyUrl('deposit', '/deposit-amount')}>
                                    <IcnCopy />
                                </div>
                                {(id === 'deposit' && urlCopy) && <div className="copy_lable">Copied</div>}
                            </div>
                            <p>This api is used for deposit amount.</p>
                            <h5>Headers:</h5>
                            <div className="tbl_wrapper">
                                <table className="tbl_header tbl_head">
                                    <thead>
                                        <tr>
                                            <th className="border border-black" style={{ width: '150px' }}>Key</th>
                                            <th className="border border-black" style={{ width: '500px' }}>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        <tr>
                                            <td className="border border-black text-dark-gray font-700" style={{ width: '150px' }}>signatureToken</td>
                                            <td className="border border-black text-dark-gray font-700" style={{ width: '500px' }}>
                                                Generate JWT token as explain in section "Generate JWT
                                                Token" using empty string
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <h5>Request Body:</h5>
                            <div className="tbl_wrapper overflow-x-auto">
                                <table className="tbl_header tbl_res">
                                    <thead >
                                        <tr>
                                            <th className="border border-black" style={{ width: '150px' }}>Key</th>
                                            <th className="border border-black" style={{ width: '150px' }}>Value</th>
                                            <th className="border border-black" style={{ width: '400px' }}>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-14 font-500">
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>bank_id</td>
                                            <td className="border border-black" style={{ width: '150px' }}>BTC</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Bank id which you have
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>currency</td>
                                            <td className="border border-black" style={{ width: '150px' }}>BTC</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Currency id by using that you want to payment
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>first_name</td>
                                            <td className="border border-black" style={{ width: '150px' }}>String</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Enter your first name
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>last_name</td>
                                            <td className="border border-black" style={{ width: '150px' }}>String</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Enter your last name
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>method_id</td>
                                            <td className="border border-black" style={{ width: '150px' }}>BTC</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Enter your method id by using you want to payment
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>authorizedSignatory</td>
                                            <td className="border border-black" style={{ width: '150px' }}>String</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Provide the signature string
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="sub_content" id='withdraw'>
                        <div className="content">
                            <h4>Withdraw</h4>
                            <div className="url">
                                <div className="url_data">
                                    <p>POST</p>
                                    <p>/withdraw-amount</p>
                                </div>
                                <div className="copy_wrapper" onClick={() => copyUrl('withdraw', '/withdraw-amount')}>
                                    <IcnCopy />
                                </div>
                                {(id === 'withdraw' && urlCopy) && <div className="copy_lable">Copied</div>}
                            </div>
                            <p>This api is used for with amount.</p>
                            <h5>Headers:</h5>
                            <div className="tbl_wrapper">
                                <table className="tbl_header">
                                    <thead>
                                        <tr>
                                            <th className="border border-black">Key</th>
                                            <th className="border border-black">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        <tr>
                                            <td className="border border-black text-dark-gray font-700">signatureToken</td>
                                            <td className="border border-black text-dark-gray font-700 ">
                                                Generate JWT token as explain in section "Generate JWT
                                                Token" using empty string
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <h5>Request Body:</h5>
                            <div className="tbl_wrapper overflow-x-auto">
                                <table className="tbl_header tbl_res">
                                    <thead >
                                        <tr>
                                            <th className="border border-black" style={{ width: '150px' }}>Key</th>
                                            <th className="border border-black" style={{ width: '150px' }}>Value</th>
                                            <th className="border border-black" style={{ width: '400px' }}>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-14 font-500">
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>bank_id</td>
                                            <td className="border border-black" style={{ width: '150px' }}>BTC</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Bank id which you have
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>iban</td>
                                            <td className="border border-black" style={{ width: '150px' }}>BTC</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Iban number for the withdraw
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>currency</td>
                                            <td className="border border-black" style={{ width: '150px' }}>BTC</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Currency id by using that you want to payment
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>first_name</td>
                                            <td className="border border-black" style={{ width: '150px' }}>String</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Enter your first name
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>last_name</td>
                                            <td className="border border-black" style={{ width: '150px' }}>String</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Enter your last name
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>method_id</td>
                                            <td className="border border-black" style={{ width: '150px' }}>BTC</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Enter your method id by using you want to payment
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black" style={{ width: '150px' }}>authorizedSignatory</td>
                                            <td className="border border-black" style={{ width: '150px' }}>String</td>
                                            <td className="border border-black" style={{ width: '400px' }}>Provide the signature string
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* <div className="sub_content" id='all_transactions'>
                        <div className="content">
                            <h4>All Transactions</h4>
                            <div className="url">
                                <div className="url_data">
                                    <p>GET</p>
                                    <p>/all_transactions</p>
                                </div>
                                <div className="copy_wrapper" onClick={() => copyUrl('all_transactions', '/all_transactions')}>
                                    <IcnCopy />
                                </div>
                                {(id === 'all_transactions' && urlCopy) && <div className="copy_lable">Copied</div>}
                            </div>
                            <p>This api is used for get list of transactions.</p>
                            <h5>Headers:</h5>
                            <div className="tbl_wrapper">
                                <table className="tbl_header">
                                    <thead>
                                        <tr>
                                            <th className="border border-black">Key</th>
                                            <th className="border border-black">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        <tr>
                                            <td className="border border-black text-dark-gray font-700">signatureToken</td>
                                            <td className="border border-black text-dark-gray font-700 ">
                                                Generate JWT token as explain in section "Generate JWT
                                                Token" using empty string
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="sub_content" id='transaction'>
                        <div className="content border-0">
                            <h4>Transaction</h4>
                            <div className="url">
                                <div className="url_data">
                                    <p>GET</p>
                                    <p>/transaction</p>
                                </div>
                                <div className="copy_wrapper" onClick={() => copyUrl('transaction', '/transaction')}>
                                    <IcnCopy />
                                </div>
                                {(id === 'transaction' && urlCopy) && <div className="copy_lable">Copied</div>}
                            </div>
                            <p>This api is used for get list of transactions.</p>
                            <h5>Headers:</h5>
                            <div className="tbl_wrapper">
                                <table className="tbl_header">
                                    <thead>
                                        <tr>
                                            <th className="border border-black">Key</th>
                                            <th className="border border-black">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        <tr>
                                            <td className="border border-black text-dark-gray font-700">signatureToken</td>
                                            <td className="border border-black text-dark-gray font-700">
                                                Generate JWT token as explain in section "Generate JWT
                                                Token" using empty string
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="inner_part2">
                    <div className="sub_content pt-0" id='right_supported_currencies'>
                        <div className="title right_title">Supported Currencies</div>
                        <p className='my-2'>LANGUAGE</p>
                        <div className="mb-4">
                            <div className="language_list">
                                {language.map((data, index) =>
                                    <div className={`language_item ${data.id === lang.id ? 'active' : ''}`} onClick={() => setLang(data)}>
                                        {data.icon}
                                        <p>{data.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className="code_section">
                                <div className="code_header">
                                    <p className="text-[12px]">{lang.title}</p>
                                </div>
                                <div className="code_body">
                                    <p className="text-[12px]">curl --location
                                        'https://paymenthub.com/get-currency'</p>
                                    <p className="text-[12px]">--header 'signatureToken:
                                        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmkiOiJjcmVhdGVUcmFuc2FjdGlvblJlcXVlc3QiLCJpYXQiOjE3MTUxNTM2NTQsImV4cCI6MTcxNTE1MzcwOSwia2V5Ijoicmh0TmJELU9yTFQteFp3M3QtMkpFWnR4Iiwic2lnbmF0dXJlU3RyaW5nIjoiMWVjY2M1NDc0YWZiMzU4NDExNDEzNjBkOGQ0MDBlMWYxOWIzNRjYzVkM2YxNTRjNmQ5YjViNSJ9.JuF7d8Oc4EyMvm7s5g3CN9L9Wbl_TFI_yO8jt20dvHw'</p>
                                    <p className="text-[12px]">--header 'Content-Type:
                                        application/json'</p>
                                    <br />
                                </div>
                                <div className="code_footer">
                                    <div className="icn_copy d-flex">
                                        <IcnCopy />
                                    </div>
                                    <p className="copy_text">Copied</p>
                                </div>
                            </div>
                        </div>
                        <div className="res_section">
                            {/* <div className="border border-light-gray rounded-[8px]">
                            </div> */}
                            <div className="res_header">
                                <h5>Response</h5>
                                <div className="select_wrapper">
                                    <div className="selection" onClick={() => setOpen(!open)}>
                                        <span>{selectValue.icon} {selectValue.status}</span>
                                        <IcnDown />
                                    </div>
                                    {
                                        open &&
                                        <div className="select_list">
                                            {
                                                resList.map((data, index) =>
                                                    <span className="flex items-center gap-2 cursor-pointer text-[14px]"
                                                        onClick={() => {
                                                            setSelectValue(data);
                                                            setOpen(false)
                                                        }}>
                                                        {data.icon} {data.status}
                                                    </span>
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="res_body response-content">
                                {selectValue.status === '200' &&
                                    <>
                                        <h4 className="text-12">&#123;</h4>
                                        <div className="code ps-12">
                                            <h4 className="text-12">"name": "Bitcoin",</h4>
                                            <h4 className="text-12">"symbol": "BTC",</h4>
                                            <h4 className="text-12">"code": "BTC"</h4>
                                        </div>
                                        <h4 className="text-12">&#125;</h4>
                                    </>
                                }
                                {selectValue.status === '400' && <div>
                                    <h4 className="text-12">&#123;</h4>
                                    <div className="code ps-12">
                                        <h4 className="text-12"> "message": "Error message"</h4>
                                    </div>
                                    <h4 className="text-12">&#125;</h4>
                                </div>}
                                <br />
                            </div>
                            <div className="res_footer bg-[#f1f1f1] p-[10px]">
                                <div className="icn_copy d-flex">
                                    <IcnCopy />
                                </div>
                                <p className="copy_text">Copied</p>
                                {/* <div className="cursor-pointer w-fit flex">
                                    <IcnCopy />
                                </div>
                                <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p> */}
                                {/* {copyResponse &&
                                    <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p>} */}
                            </div>
                        </div>
                    </div>
                    <div className="sub_content" id='right_deposit'>
                        <div className="title right_title">Deposit</div>
                        <p className='my-2'>LANGUAGE</p>
                        <div className="mb-4">
                            <div className="language_list">
                                {language.map((data, index) =>
                                    <div className={`language_item ${data.id === lang.id ? 'active' : ''}`} onClick={() => setLang(data)}>
                                        {data.icon}
                                        <p>{data.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className="code_section">
                                <div className="code_header">
                                    <p className="text-[12px]">{lang.title}</p>
                                </div>
                                <div className="code_body">
                                    <p className="text-[12px]">curl --location
                                        'https://paymenthub.com/deposit-amount'</p>
                                    <p className="text-[12px]">--header 'signatureToken:
                                        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmkiOiJjcmVhdGVUcmFuc2FjdGlvblJlcXVlc3QiLCJpYXQiOjE3MTUxNTM2NTQsImV4cCI6MTcxNTE1MzcwOSwia2V5Ijoicmh0TmJELU9yTFQteFp3M3QtMkpFWnR4Iiwic2lnbmF0dXJlU3RyaW5nIjoiMWVjY2M1NDc0YWZiMzU4NDExNDEzNjBkOGQ0MDBlMWYxOWIzNRjYzVkM2YxNTRjNmQ5YjViNSJ9.JuF7d8Oc4EyMvm7s5g3CN9L9Wbl_TFI_yO8jt20dvHw'</p>
                                    <p className="text-[12px]">--header 'Content-Type:
                                        application/json'</p>
                                    <br />
                                </div>
                                <div className="code_footer">
                                    <div className="icn_copy d-flex">
                                        <IcnCopy />
                                    </div>
                                    <p className="copy_text">Copied</p>
                                </div>
                            </div>
                        </div>
                        <div className="res_section">
                            {/* <div className="border border-light-gray rounded-[8px]">
                            </div> */}
                            <div className="res_header">
                                <h5>Response</h5>
                                <div className="select_wrapper">
                                    <div className="selection" onClick={() => setOpen(!open)}>
                                        <span>{selectValue.icon} {selectValue.status}</span>
                                        <IcnDown />
                                    </div>
                                    {
                                        open &&
                                        <div className="select_list">
                                            {
                                                resList.map((data, index) =>
                                                    <span className="flex items-center gap-2 cursor-pointer text-[14px]"
                                                        onClick={() => {
                                                            setSelectValue(data);
                                                            setOpen(false)
                                                        }}>
                                                        {data.icon} {data.status}
                                                    </span>
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="res_body response-content">
                                {selectValue.status === '200' &&
                                    <>
                                        <h4 className="text-12">&#123;</h4>
                                        <div className="code ps-12">
                                            <h4 className="text-12">"name": "Bitcoin",</h4>
                                            <h4 className="text-12">"symbol": "BTC",</h4>
                                            <h4 className="text-12">"code": "BTC"</h4>
                                        </div>
                                        <h4 className="text-12">&#125;</h4>
                                    </>
                                }
                                {selectValue.status === '400' && <div>
                                    <h4 className="text-12">&#123;</h4>
                                    <div className="code ps-12">
                                        <h4 className="text-12"> "message": "Error message"</h4>
                                    </div>
                                    <h4 className="text-12">&#125;</h4>
                                </div>}
                                <br />
                            </div>
                            <div className="res_footer bg-[#f1f1f1] p-[10px]">
                                <div className="icn_copy d-flex">
                                    <IcnCopy />
                                </div>
                                <p className="copy_text">Copied</p>
                                {/* <div className="cursor-pointer w-fit flex">
                                    <IcnCopy />
                                </div>
                                <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p> */}
                                {/* {copyResponse &&
                                    <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p>} */}
                            </div>
                        </div>
                    </div>
                    <div className="sub_content" id='right_withdraw'>
                        <div className="title right_title">Withdraw</div>
                        <p className='my-2'>LANGUAGE</p>
                        <div className="mb-4">
                            <div className="language_list">
                                {language.map((data, index) =>
                                    <div className={`language_item ${data.id === lang.id ? 'active' : ''}`} onClick={() => setLang(data)}>
                                        {data.icon}
                                        <p>{data.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className="code_section">
                                <div className="code_header">
                                    <p className="text-[12px]">{lang.title}</p>
                                </div>
                                <div className="code_body">
                                    <p className="text-[12px]">curl --location
                                        'https://paymenthub.com/withdraw-amount'</p>
                                    <p className="text-[12px]">--header 'signatureToken:
                                        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmkiOiJjcmVhdGVUcmFuc2FjdGlvblJlcXVlc3QiLCJpYXQiOjE3MTUxNTM2NTQsImV4cCI6MTcxNTE1MzcwOSwia2V5Ijoicmh0TmJELU9yTFQteFp3M3QtMkpFWnR4Iiwic2lnbmF0dXJlU3RyaW5nIjoiMWVjY2M1NDc0YWZiMzU4NDExNDEzNjBkOGQ0MDBlMWYxOWIzNRjYzVkM2YxNTRjNmQ5YjViNSJ9.JuF7d8Oc4EyMvm7s5g3CN9L9Wbl_TFI_yO8jt20dvHw'</p>
                                    <p className="text-[12px]">--header 'Content-Type:
                                        application/json'</p>
                                    <br />
                                </div>
                                <div className="code_footer">
                                    <div className="icn_copy d-flex">
                                        <IcnCopy />
                                    </div>
                                    <p className="copy_text">Copied</p>
                                </div>
                            </div>
                        </div>
                        <div className="res_section">
                            {/* <div className="border border-light-gray rounded-[8px]">
                            </div> */}
                            <div className="res_header">
                                <h5>Response</h5>
                                <div className="select_wrapper">
                                    <div className="selection" onClick={() => setOpen(!open)}>
                                        <span>{selectValue.icon} {selectValue.status}</span>
                                        <IcnDown />
                                    </div>
                                    {
                                        open &&
                                        <div className="select_list">
                                            {
                                                resList.map((data, index) =>
                                                    <span className="flex items-center gap-2 cursor-pointer text-[14px]"
                                                        onClick={() => {
                                                            setSelectValue(data);
                                                            setOpen(false)
                                                        }}>
                                                        {data.icon} {data.status}
                                                    </span>
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="res_body xxl:max-w-[430px] max-w-full overflow-y-auto response-content">
                                {selectValue.status === '200' &&
                                    <>
                                        <h4 className="text-12">&#123;</h4>
                                        <div className="code ps-12">
                                            <h4 className="text-12">"name": "Bitcoin",</h4>
                                            <h4 className="text-12">"symbol": "BTC",</h4>
                                            <h4 className="text-12">"code": "BTC"</h4>
                                        </div>
                                        <h4 className="text-12">&#125;</h4>
                                    </>
                                }
                                {selectValue.status === '400' && <div>
                                    <h4 className="text-12">&#123;</h4>
                                    <div className="code ps-12">
                                        <h4 className="text-12"> "message": "Error message"</h4>
                                    </div>
                                    <h4 className="text-12">&#125;</h4>
                                </div>}
                                <br />
                            </div>
                            <div className="res_footer bg-[#f1f1f1] p-[10px]">
                                <div className="icn_copy d-flex">
                                    <IcnCopy />
                                </div>
                                <p className="copy_text">Copied</p>
                                {/* <div className="cursor-pointer w-fit flex">
                                    <IcnCopy />
                                </div>
                                <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p> */}
                                {/* {copyResponse &&
                                    <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p>} */}
                            </div>
                        </div>
                    </div>
                    <div className="sub_content" id='right_all_transactions'>
                        <div className="title right_title">All Transactions</div>
                        <p className='my-2'>LANGUAGE</p>
                        <div className="mb-4">
                            <div className="language_list">
                                {language.map((data, index) =>
                                    <div className={`language_item ${data.id === lang.id ? 'active' : ''}`} onClick={() => setLang(data)}>
                                        {data.icon}
                                        <p>{data.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className="code_section">
                                <div className="code_header">
                                    <p className="text-[12px]">{lang.title}</p>
                                </div>
                                <div className="code_body xxl:max-w-[430px] max-w-full overflow-y-auto">
                                    <p className="text-[12px]">curl --location
                                        'https://oppiwallet.com/api/supportedCurrency'</p>
                                    <p className="text-[12px]">--header 'signatureToken:
                                        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmkiOiJjcmVhdGVUcmFuc2FjdGlvblJlcXVlc3QiLCJpYXQiOjE3MTUxNTM2NTQsImV4cCI6MTcxNTE1MzcwOSwia2V5Ijoicmh0TmJELU9yTFQteFp3M3QtMkpFWnR4Iiwic2lnbmF0dXJlU3RyaW5nIjoiMWVjY2M1NDc0YWZiMzU4NDExNDEzNjBkOGQ0MDBlMWYxOWIzNRjYzVkM2YxNTRjNmQ5YjViNSJ9.JuF7d8Oc4EyMvm7s5g3CN9L9Wbl_TFI_yO8jt20dvHw'</p>
                                    <p className="text-[12px]">--header 'Content-Type:
                                        application/json'</p>
                                    <br />
                                </div>
                                <div className="code_footer">
                                    <div className="icn_copy d-flex">
                                        <IcnCopy />
                                    </div>
                                    <p className="copy_text">Copied</p>
                                </div>
                            </div>
                        </div>
                        <div className="res_section">
                            {/* <div className="border border-light-gray rounded-[8px]">
                            </div> */}
                            <div className="res_header">
                                <h5>Response</h5>
                                <div className="select_wrapper">
                                    <div className="selection" onClick={() => setOpen(!open)}>
                                        <span>{selectValue.icon} {selectValue.status}</span>
                                        <IcnDown />
                                    </div>
                                    {
                                        open &&
                                        <div className="select_list">
                                            {
                                                resList.map((data, index) =>
                                                    <span className="flex items-center gap-2 cursor-pointer text-[14px]"
                                                        onClick={() => {
                                                            setSelectValue(data);
                                                            setOpen(false)
                                                        }}>
                                                        {data.icon} {data.status}
                                                    </span>
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="res_body xxl:max-w-[430px] max-w-full overflow-y-auto response-content">
                                {selectValue.status === '200' &&
                                    <>
                                        <h4 className="text-12">&#123;</h4>
                                        <div className="code ps-12">
                                            <h4 className="text-12">"name": "Bitcoin",</h4>
                                            <h4 className="text-12">"symbol": "BTC",</h4>
                                            <h4 className="text-12">"code": "BTC"</h4>
                                        </div>
                                        <h4 className="text-12">&#125;</h4>
                                    </>
                                }
                                {selectValue.status === '400' && <div>
                                    <h4 className="text-12">&#123;</h4>
                                    <div className="code ps-12">
                                        <h4 className="text-12"> "message": "Error message"</h4>
                                    </div>
                                    <h4 className="text-12">&#125;</h4>
                                </div>}
                                <br />
                            </div>
                            <div className="res_footer bg-[#f1f1f1] p-[10px]">
                                <div className="icn_copy d-flex">
                                    <IcnCopy />
                                </div>
                                <p className="copy_text">Copied</p>
                                {/* <div className="cursor-pointer w-fit flex">
                                    <IcnCopy />
                                </div>
                                <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p> */}
                                {/* {copyResponse &&
                                    <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p>} */}
                            </div>
                        </div>
                    </div>
                    <div className="sub_content pb-0 border-0" id='right_transaction'>
                        <div className="title right_title">Transaction</div>
                        <p className='my-2'>LANGUAGE</p>
                        <div className="mb-4">
                            <div className="language_list">
                                {language.map((data, index) =>
                                    <div className={`language_item ${data.id === lang.id ? 'active' : ''}`} onClick={() => setLang(data)}>
                                        {data.icon}
                                        <p>{data.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className="code_section">
                                <div className="code_header">
                                    <p className="text-[12px]">{lang.title}</p>
                                </div>
                                <div className="code_body xxl:max-w-[430px] max-w-full overflow-y-auto">
                                    <p className="text-[12px]">curl --location
                                        'https://oppiwallet.com/api/supportedCurrency'</p>
                                    <p className="text-[12px]">--header 'signatureToken:
                                        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmkiOiJjcmVhdGVUcmFuc2FjdGlvblJlcXVlc3QiLCJpYXQiOjE3MTUxNTM2NTQsImV4cCI6MTcxNTE1MzcwOSwia2V5Ijoicmh0TmJELU9yTFQteFp3M3QtMkpFWnR4Iiwic2lnbmF0dXJlU3RyaW5nIjoiMWVjY2M1NDc0YWZiMzU4NDExNDEzNjBkOGQ0MDBlMWYxOWIzNRjYzVkM2YxNTRjNmQ5YjViNSJ9.JuF7d8Oc4EyMvm7s5g3CN9L9Wbl_TFI_yO8jt20dvHw'</p>
                                    <p className="text-[12px]">--header 'Content-Type:
                                        application/json'</p>
                                    <br />
                                </div>
                                <div className="code_footer">
                                    <div className="icn_copy d-flex">
                                        <IcnCopy />
                                    </div>
                                    <p className="copy_text">Copied</p>
                                </div>
                            </div>
                        </div>
                        <div className="res_section">
                            {/* <div className="border border-light-gray rounded-[8px]">
                            </div> */}
                            <div className="res_header">
                                <h5>Response</h5>
                                <div className="select_wrapper">
                                    <div className="selection" onClick={() => setOpen(!open)}>
                                        <span>{selectValue.icon} {selectValue.status}</span>
                                        <IcnDown />
                                    </div>
                                    {
                                        open &&
                                        <div className="select_list">
                                            {
                                                resList.map((data, index) =>
                                                    <span className="flex items-center gap-2 cursor-pointer text-[14px]"
                                                        onClick={() => {
                                                            setSelectValue(data);
                                                            setOpen(false)
                                                        }}>
                                                        {data.icon} {data.status}
                                                    </span>
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="res_body xxl:max-w-[430px] max-w-full overflow-y-auto response-content">
                                {selectValue.status === '200' &&
                                    <>
                                        <h4 className="text-12">&#123;</h4>
                                        <div className="code ps-12">
                                            <h4 className="text-12">"name": "Bitcoin",</h4>
                                            <h4 className="text-12">"symbol": "BTC",</h4>
                                            <h4 className="text-12">"code": "BTC"</h4>
                                        </div>
                                        <h4 className="text-12">&#125;</h4>
                                    </>
                                }
                                {selectValue.status === '400' && <div>
                                    <h4 className="text-12">&#123;</h4>
                                    <div className="code ps-12">
                                        <h4 className="text-12"> "message": "Error message"</h4>
                                    </div>
                                    <h4 className="text-12">&#125;</h4>
                                </div>}
                                <br />
                            </div>
                            <div className="res_footer bg-[#f1f1f1] p-[10px]">
                                <div className="icn_copy d-flex">
                                    <IcnCopy />
                                </div>
                                <p className="copy_text">Copied</p>
                                {/* <div className="cursor-pointer w-fit flex">
                                    <IcnCopy />
                                </div>
                                <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p> */}
                                {/* {copyResponse &&
                                    <p className="bg-gray text-white text-[12px] rounded-[6px] py-[4px] px-[6px]">Copied</p>} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApiDocumentation;
