import {useField} from "formik";
import {DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";
import './common.css'


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const PDateRangePicker = ({label, ...props}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [field, meta,helpers] = useField(props);
    const {setValue} = helpers
    return(
        <div>
            <label htmlFor={props.id || props.name} className="p-label">{label}</label>
            <DateTimePickerComponent  {...field} {...props} onBlur={(v)=>{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setValue(v.target.value).catch(async (e) => {
                    console.log(`Error setting field: ${e.error.value}`)
                })
            }} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    )
}

export default PDateRangePicker