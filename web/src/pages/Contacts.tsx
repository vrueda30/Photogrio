import {Button, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import ContactList from "../components/Contact/ContactList.tsx";
import {CREATE_CONTACT_URL} from "./api-routes.tsx"
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {Cookies} from "react-cookie";
import {Form, Formik} from "formik";
import PTextInput from "../components/Common/PTextInput.tsx";

interface userFormProps {
    isOpen: boolean,
    callback: () => void,
}

interface ContactType{
    id: number,
    name: string,
}

interface Values{
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    contactType: ContactType,
}
const CreateUserForm = ({isOpen, callback}:userFormProps) => {
    const {getAccessTokenSilently} = useAuth0()
    const [bearerToken, setBearerToken] = useState("")
    const cookies = new Cookies()
    const accountId = cookies.get("account").accountId

    useEffect( () => {
        getAccessTokenSilently().then((token => {
            setBearerToken(token)
        }))
    })
    return(
        <>
            <Modal isOpen={isOpen} toggle={callback} >
                <ModalHeader>New Contact</ModalHeader>
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
                        onSubmit={async (values, {setSubmitting}) => {
                            axios.post(CREATE_CONTACT_URL + `/${accountId}`, values, {
                                headers: {
                                    Authorization: "Bearer " + bearerToken,
                                },
                                withCredentials: true,
                            }).then((r) => {
                                console.log(r)
                                setSubmitting(false)
                            })
                        }}
                    >
                        <Form>
                        <PTextInput
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeHolder="First Name"
                            />
                        <PTextInput
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeHolder="Last Name"
                            />
                        <PTextInput
                            label="Email"
                            name="email"
                            type="text"
                            placeHolder="@"
                            />
                        <PTextInput
                            label="Phone Number"
                            name="phone"
                            type="text"
                            placeHolder="(111) 111-1111"
                            />
                            <div>
                                <button type="submit">Save</button>
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
            <ContactList  />
        </>
    )
};

export default Contacts;