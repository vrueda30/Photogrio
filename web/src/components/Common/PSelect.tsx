import {useField} from "formik";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const PSelect = ({label, ...props}) => {
    const [field, meta] = useField(props)
    return(
        <div>
            <label htmlFor={props.id || props.name} className="p-label">{label}</label>
            <select {...field}{...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    )
}

export default PSelect