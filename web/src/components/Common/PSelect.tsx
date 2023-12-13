import {useField} from "formik";

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