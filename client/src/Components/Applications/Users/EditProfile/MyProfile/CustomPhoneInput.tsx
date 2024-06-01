import { FC } from "react";
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css';

interface CustomPhoneInputProps {
    field?: any;
    form?: any;
    customInputClass: string
}

const CustomPhoneInput: FC<CustomPhoneInputProps> = ({ form, field, customInputClass, ...props }) => {
    const { setFieldValue } = form;

    return (
        <PhoneInput
            className='phone-dropdown'
            {...props}
            onChange={(phone) => setFieldValue(field.name, phone)}
            value={field.value}
            forceDialCode
        />
    );
};

export default CustomPhoneInput;
