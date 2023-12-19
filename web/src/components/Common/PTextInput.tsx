import {FieldHookConfig, useField} from "formik";
import {Props} from "./interfaces.ts";

//const PTextInput = ({label, ...props}) => {
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const PTextInput = ({label, ...props}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [field, meta] = useField(props);
    return (
        <div>
            <label htmlFor={props.id || props.name} className="p-label">{label}</label>
            <input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    )
}

export default PTextInput