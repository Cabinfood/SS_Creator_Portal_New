import { useState, useEffect, forwardRef } from 'react';
import { Button, Box, CircularProgress } from "@mui/material"
import { Calendar as CalendarIcon } from '../../icons/calendar';
// https://www.npmjs.com/package/react-datepicker
import DatePicker from "react-datepicker";

export default function DatePickerButton(props) {
    const {handleSelected, isBusy, maxDate, ...other} = props
    const [maxDateRange, setMaxDateRange] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    useEffect(()=>{
        console.log(selectedDate)
        console.log("MAX DATE: ", maxDate)
        if (maxDate) setMaxDateRange(new Date(maxDate))
    },[selectedDate])
    
    const DatePickerCustomInput = forwardRef(({ value, onClick }, ref) => (
        <Button 
            className="datepicker-custom-input" 
            variant='contained'
            onClick={onClick} 
            ref={ref}
            disabled = {isBusy}
            endIcon= {
                <CalendarIcon />
            }
        >
            {value}            
        </Button>        
    ));

    return (        
        <div className="date-picker-button"
            {...other}
        >
            <DatePicker 
                selected={selectedDate} 									
                onChange={(date) => {
                    handleSelected(new Date(date))
                    setSelectedDate(date)
                }} 
                dateFormat={'dd/MM/yyyy'}
                maxDate={maxDateRange}
                wrapperClassName = "date-picker"
                customInput= {<DatePickerCustomInput />}
            />

            <style jsx>{`
                
            `                
            }</style>
        </div>
    )
}