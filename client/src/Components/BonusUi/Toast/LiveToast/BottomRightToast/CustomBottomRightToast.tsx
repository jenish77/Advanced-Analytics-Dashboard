import { BottomRightToasts } from "@/Constant";
import React, { FC, SetStateAction, useEffect, useState } from "react";
import { Button, Toast, ToastBody } from "reactstrap";

interface Props {
    open: boolean,
    setopen: React.Dispatch<SetStateAction<boolean>>,
    msg: string
    color?: string
}


const CustomBottomRightToast: FC<Props> = ({ open, setopen, msg, color }) => {
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setopen(false)
            }, 1500)
        }
    })
    return (
        <>
            <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-index toast-rtl">
                <Toast fade isOpen={open}>
                    <div className={`d-flex justify-content-between pe-3 ${color ? `alert-${color}` : "alert-secondary"} align-items-center`}>
                        <ToastBody>{msg}</ToastBody>
                        <Button close className="btn-close-white me-2 m-auto" onClick={() => setopen(false)}></Button>
                    </div>
                </Toast >
            </div >
        </>
    );
};

export default CustomBottomRightToast;
