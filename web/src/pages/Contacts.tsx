import {Button, Col, Container, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import ContactList from "../components/Contact/ContactList.tsx";
import {CONTACT_API_BASE_URL} from "./api-routes.tsx"
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {Cookies} from "react-cookie";
import {Form, Formik} from "formik";
import PTextInput from "../components/Common/PTextInput.tsx";
import * as Yup from 'yup'


interface userFormProps {
    isOpen: boolean,
    callback: () => void,
}

const CreateUserForm = ({isOpen, callback}:userFormProps) => {
    const cookies = new Cookies()
    const accountId = cookies.get("user").accountId
    const {getAccessTokenSilently} = useAuth0()
    const phoneRegex = new RegExp('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')


    return(
        <>
            <Modal isOpen={isOpen} toggle={callback}>
                <ModalHeader className="form-header"><h5 >New Contact</h5></ModalHeader>
                <ModalBody>
                    <Formik
                        initialValues={{
                         firstName: '',
                         lastName: '',
                         email: '',
                         phone: '',
                            contactType: 1,
                            accountId: accountId,
                            address: {
                             address1: '',
                                address2: '',
                                city: '',
                                state: '',
                                zip: '',
                            }
                        }}
                        validationSchema={Yup.object({
                            firstName: Yup.string()
                                .min(1, "Must be 1 character or more")
                                .required('First name is required'),
                            lastName: Yup.string()
                                .required('Last name is required'),
                            email: Yup.string()
                                .email("Invalid email"),
                            phone: Yup.string()
                                .matches(phoneRegex,"Invalid phone number" )
                        })}
                        onSubmit={async (values, {setSubmitting}) => {
                            getAccessTokenSilently().then((token) => {
                                const baseUrl =`${CONTACT_API_BASE_URL}create_contact/${accountId}`
                                axios.post(baseUrl, values, {
                                    headers: {
                                        Authorization: "Bearer " + token,
                                    },
                                    withCredentials: true,
                                }).then((r) => {
                                    console.log(r)
                                    setSubmitting(false)
                                    callback()
                                })
                            })
                        }}
                    >
                        <Form>
                        <PTextInput
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeHolder="First Name"
                            className="form-control w-100"
                            />
                        <PTextInput
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeHolder="Last Name"
                            className="form-control w-100"
                            />
                        <PTextInput
                            label="Email"
                            name="email"
                            type="text"
                            placeHolder="@"
                            className="form-control w-100"
                            />
                        <PTextInput
                            label="Phone Number"
                            name="phone"
                            type="text"
                            placeHolder="111-111-1111"
                            className="form-control w-100"
                            />
                            <div>
                                <Container className="new-contact-footer">
                                    <div className="d-flex justify-content-end">
                                        <button type="button" onClick={callback}>Cancel</button>
                                        <button type="submit" className="btn btn-primary ms-2 w-25">Save</button>
                                    </div>
                                </Container>
                            </div>
                        </Form>
                    </Formik>
                </ModalBody>
            </Modal>
        </>
    )

}
export const Contacts = () => {
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)
    const [contactData, setData] = useState([])
    const {getAccessTokenSilently} = useAuth0()
    const loadData = async () => {
        console.log("In load data")
        const token = await getAccessTokenSilently()
        const cookie = new Cookies()
        axios.get(`${CONTACT_API_BASE_URL}${cookie.get("user").accountId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        }).then((result)=> {
                setData(result.data.data)
                console.log(`contact data: ${contactData}`)
            }

        )
    }

    useEffect(() => {
        loadData().then(()=>{})
    },[])

    return(
        <>
            <CreateUserForm isOpen={modal} callback={toggle}/>
            <Container fluid>
                <Row className="client-header">
                    <Col className="d-flex justify-content-start align-items-center">
                        <h4>Contacts</h4>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center">
                        <Button className="btn btn-photogrio" onClick={toggle}>Create Contact</Button>
                    </Col>
                </Row>
            </Container>
            <ContactList data={contactData} />
        </>
    )
};

export default Contacts;