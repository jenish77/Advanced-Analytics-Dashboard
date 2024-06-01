import React, { FC, useState } from 'react';
import { Button, Tooltip } from 'reactstrap';

interface Props {
    children: React.ReactNode;
    id: string;
    helpText: string;
}

const CommonTooltip: FC<Props> = ({ children, id, helpText }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div>
            <Button id={id} type="button">
                children
            </Button>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target={id} toggle={toggle}>
                {helpText}
            </Tooltip>
        </div>
    );
}

export default CommonTooltip;
