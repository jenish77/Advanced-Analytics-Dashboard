import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Input } from "reactstrap";

const CopyInput = () => {
    const [textToCopy, setTextToCopy] = useState("");
    const [copyStatus, setCopyStatus] = useState(false);

    const onCopyText = () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000);
    };

    return (
        <div className="copy_wrapper">
            {copyStatus && (
                <div className="copy_lable">copied</div>
            )}
            <div className="input_wrapper">
                <Input
                    className='copy_input'
                    readOnly
                    value={'jkhjhkhkjkhjhkhkjkhjhkhkjkhjhkhkjkhjhkhkjkhjhkhkjkhjhkhkjkhjhkhkjkhjhkhkjkhjhkhkjkhjhkhk'}
                />
                <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                    <Button color="primary" className="btn-copy">
                        C
                    </Button>
                </CopyToClipboard>
            </div>
        </div>
    )
}

export default CopyInput