import { useRef, useState } from "react";
import DatePicker, { DateObject, DatePickerRef } from "react-multi-date-picker";
import { Button, Col, InputGroup, Label, Row } from "reactstrap";
import { RangeDatePicker } from "@/Constant";

interface MyDatePickerProps {
  setFromDate: (date: any) => void;
  setToDate: (date: any) => void;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({ setFromDate, setToDate}) => {
  const [value, setValue] = useState<DateObject | DateObject[] | null>(new DateObject());
  const maxDate = new DateObject();
  const pickerRef = useRef<DatePickerRef>(null);
  const handleDateChange = (date: DateObject | DateObject[] | any) => {
    if (Array.isArray(date)) {
      const fromDate = date[0]?.format("YYYY-MM-DD") || '';
      const toDate = date[1]?.format("YYYY-MM-DD") || '';
      setFromDate(fromDate);
      setToDate(toDate);
    } else {
      const fromDate = date?.format("YYYY-MM-DD") || '';
      setFromDate(fromDate);
      setToDate(fromDate);
    }
    if (date?.length === 2 && pickerRef.current) {
      pickerRef.current.closeCalendar();
    }
  };

  // FOR SINGLE DATE AND MULTI DATE FILTER
  /* const handleDateChange = (date: DateObject | DateObject[] | any) => {
    if (Array.isArray(date)) {
      if (date.length === 2) {
        const fromDate = date[0]?.format("YYYY-MM-DD") || '';
        const toDate = date[1]?.format("YYYY-MM-DD") || '';
        setFromDate(fromDate);
        setToDate(toDate);
        setExactDate(null); // Clear exact date if range is selected
        if (pickerRef.current) {
          pickerRef.current.closeCalendar();
        }
      } else if (date.length === 1) {
        const exactDate = date[0]?.format("YYYY-MM-DD") || '';
        setFromDate('');
        setToDate('');
        setExactDate(exactDate); // Set exact date if a single date is selected
      }
    } else {
      const exactDate = date?.format("YYYY-MM-DD") || '';
      setFromDate('');
      setToDate('');
      setExactDate(exactDate); // Set exact date if a single date is selected
    }
    setValue(date);
  }; */

  const handleClear = () => {
    setValue(null);
    setFromDate('');
    setToDate('');
    const inputElement = document.getElementById("datePickerInput");    
    if (inputElement instanceof HTMLInputElement) {
      inputElement.value = '';
      inputElement.blur();
    }
  };
  
  return (  
    <Row>
      {/* <Label htmlFor="fromDate" className="mr-2">Date</Label> */}
      <Col xxl="9" className="box-col-12">
        <InputGroup className="flatpicker-calender" style={{ minWidth: '200px' }}>
          <DatePicker
            id="datePickerInput"
            inputClass="form-control"
            range
            value={value}
            onChange={handleDateChange}
            maxDate={maxDate}
            placeholder={value ? '' : 'Select Date'}
            ref={pickerRef}
          />
          <Button color="link" className="clear-button" onClick={handleClear} style={{ position: 'absolute', right: '10px', top: '3%', transform: 'translateY(-12%)' }}><i className="fa fa-refresh"></i></Button>
        </InputGroup>
      </Col>
    </Row>
  );
};

export default MyDatePicker;
