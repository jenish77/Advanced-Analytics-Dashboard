import { useState } from 'react'
import { Tooltip } from 'reactstrap';

const CommonColorButtonTooltip: React.FC<any> = ({ id = "exampleTooltip", toolTipText = "This is a tooltip", color = "primary" }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <Tooltip outline={color} color={color} isOpen={tooltipOpen} target={id} toggle={toggle} > {toolTipText}</Tooltip>
    )
}

export default CommonColorButtonTooltip