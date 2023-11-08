import {Button, Container, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Form, Formik, useField} from "formik";
import * as Yup from "yup"
import axios from "axios";
import {useState} from "react";
import {CREATE_ACCOUNT_URL} from "./api-routes.tsx";
import {useNavigate} from "react-router-dom";

const MyTextInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return(
        <>
            <div className="form-group row form-row-gp">

                    <label className="col-sm-2" htmlFor={props.id || props.name}>{label}</label>
                    <input className="text-input col-sm-10" {...field}{...props} />

            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
            </div>
        </>
    );
};


export const Register = () => {
    const [modal, setModal] = useState(false);
    const [errMessage, setErrMessage] = useState("")
    const toggle = () => setModal(!modal)
    const setModalErr = (msg:string) => setErrMessage(msg)
    const navigate = useNavigate()

    return(
        <Container className="reg-container">
            <h1>Register</h1>
            <Formik initialValues={{
                name: "",
                email: "",
                password: "",
                company: ""
            }} validationSchema={
              Yup.object({
                name: Yup.string()
                    .max(30, "Must be 30 characters or less")
                    .required("Required"),
                  email: Yup.string()
                      .min(6)
                      .email("Must be a valid email")
                      .required("Required"),
                  password: Yup.string()
                      .min(6)
                      .max(32)
                      .required("Required"),
                  company: Yup.string()
                      .min(1)
                      .required("Required")
              })
            } onSubmit={async(values, {setSubmitting}) => {
                const response = await axios.post(CREATE_ACCOUNT_URL, JSON.stringify(values, null, 2), )
                    .then((r) => {
                        console.log(r.data)
                        navigate("/")
                    })
                    .catch((e) => {
                        const err = JSON.parse(e.response.data.error)
                        setModalErr(err.message)
                        toggle()
                    })
                await new Promise(r => setTimeout(r, 500));
                setSubmitting(false);
            }}>
                <Form>
                    <MyTextInput
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Name"
                        />
                    <MyTextInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="@"
                        />
                    <MyTextInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder=""
                        />
                    <MyTextInput
                        label="Company"
                        name="company"
                        type="text"
                        placeholder = "Company name"
                        />
                    <button className="btn btn-primary" type="submit">Register</button>
                </Form>
            </Formik>
            <Modal isOpen={modal} toggle={toggle} centered={true} >
                <ModalHeader toggle={toggle} className="modal-error-title">Error</ModalHeader>
                <ModalBody>
                    {errMessage}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    )
}

export default Register;