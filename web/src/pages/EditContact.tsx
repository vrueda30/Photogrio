import {useParams} from "react-router-dom";
import {Formik} from "formik";

export interface ContactInfo {
    ID: number

}
export const EditContact = () => {
    const params = useParams()
    return(
        <>
            <div className="d-flex justify-content-start">
                <h5>Edit Contact</h5>
            </div>
            <div className="d-flex justify-content-start">
                <Formik initialValues={} onSubmit={()=>{}}>

                </Formik>
            </div>
        </>
    )
}

export default EditContact