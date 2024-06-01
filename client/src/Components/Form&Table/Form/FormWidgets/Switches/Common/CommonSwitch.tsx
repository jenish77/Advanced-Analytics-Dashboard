import { CommonSwitchProp } from "@/Types/FormType";
import { useState } from "react";
import { Input, Label } from "reactstrap";

const CommonSwitch: React.FC<CommonSwitchProp> = ({ defaultChecked, onChange, color = "primary", disabled, style }) => {

    const handleToggle = () => {
        if (onChange) {
            onChange(!defaultChecked);
        }
    };
  return (
    <Label className="form-switch form-check-inline" check>
      <Input className={`switch-${color} check-size`} type="checkbox" role="switch" checked={defaultChecked} disabled={disabled} style={style} onChange={handleToggle} />
    </Label>
  );
};

export default CommonSwitch;
