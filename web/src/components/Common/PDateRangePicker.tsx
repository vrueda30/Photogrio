import {useField} from "formik";
import {DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";
import './common.css'


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const PDateRangePicker = ({label, ...props}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [field, meta] = useField(props);
    return(
        <div>
            <div>{label}</div>
            <DateTimePickerComponent {...field} {...props} />
        </div>
    )
}

export default PDateRangePicker