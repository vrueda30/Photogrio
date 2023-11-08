import {Button, Col, Container, Row} from "reactstrap";
import ContactList from "../components/Contact/ContactList.tsx";
import authConfig from "../auth/auth_config.json"
import {CREATE_CONTACT_URL} from "../pages/api-routes.tsx"
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";


export const Contacts = () => {
    const {getAccessTokenSilently} = useAuth0()
    const getToken = async () => {
        return await getAccessTokenSilently()
    }
    const createUser = async () => {
        axios.post(CREATE_CONTACT_URL, "", {
            headers: {
                Authorization: "Bearer " + await getToken(),
            }
        })
            .then(() => {
                alert("clicked")
            })
    }

    return(
        <>
            <Container fluid>
                <Row className="client-header">
                    <Col className="d-flex justify-content-start align-items-center">
                        <h4>Contacts</h4>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center">
                        <Button className="btn btn-photogrio" onClick={createUser}>Create Contact</Button>
                    </Col>
                </Row>
                <div className="justify-content-start">
                    <ContactList />
                </div>
            </Container>
        </>
    )
};

export default Contacts;