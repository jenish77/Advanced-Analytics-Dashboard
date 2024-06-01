import { CommonButtonsToolTipType } from '@/Types/ButtonType';
import { useState } from 'react'
import { Tooltip } from 'reactstrap';

const CommonButtonsToolTip:React.FC<CommonButtonsToolTipType> = ({ id, toolTipText }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <Tooltip isOpen={tooltipOpen} target={id} toggle={toggle}>{toolTipText}</Tooltip>
  )
}

export default CommonButtonsToolTip