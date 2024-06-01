import { CommonUserFormGroupType } from "@/Types/UserType";
import { FormGroup, Input, Label } from "reactstrap";

const CommonUserFormGroup: React.FC<CommonUserFormGroupType> = ({ nn,name,type, title, placeholder, defaultValue, row, disabled,value,onChange }) => {
  return (
    <FormGroup>
      <Label check>{title}</Label>
      <Input nn={nn} name={ name } type={type} placeholder={placeholder} defaultValue={defaultValue} rows={row} disabled={disabled} value={value} onChange={onChange} />
    </FormGroup>
  );
};

export default CommonUserFormGroup;
