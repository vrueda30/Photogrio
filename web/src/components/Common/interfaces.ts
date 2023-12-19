import {FieldHookConfig} from "formik";

export interface Eprops {
    label: string,
    props: string[] | FieldHookConfig<never>
}