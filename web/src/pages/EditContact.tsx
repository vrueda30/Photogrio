import {useParams} from "react-router-dom";
import {Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {CONTACT_API_BASE_URL} from "./api-routes.tsx";
import PTextInput from "../components/Common/PTextInput.tsx";
import {Col, Row} from "reactstrap";
import ProfileImage, {ProfileFile} from "../components/ProfileImage.tsx";


export interface ContactType{
    ID: number;
    name: string;
}
export interface Address{
    ID: number
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip:string
}
export interface ContactInfo {
    ID: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: Address;
    contactType: ContactType;
}

export const EditContact = () => {
    const [contact, setContact] = useState({})
    const [imageUrl, setImageUrl] = useState("")
    const params = useParams()
    const {getAccessTokenSilently} = useAuth0()

    const profilePicUpdateCallback = async (file:ProfileFile) => {
        const contactId = Number(params.contactId)
        const data = new FormData()
        data.append("image", file.file)
        const token = await getAccessTokenSilently()
        const res = await axios.post(`${CONTACT_API_BASE_URL}save_profile_avatar/${contactId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        setImageUrl(res.data.url)
        console.log(`save profile result: ${res.data.url}`)
    }


    const loadContact = async() => {
        const contactId = params.contactId
        const token = await getAccessTokenSilently()
        const res = await axios.get(`${CONTACT_API_BASE_URL}get_contact\\${contactId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        });

        if (res.status !== 200){
            console.log("Bad request")
        }else{
            setContact(res.data)
            console.log(`contact set: ${res.data}`)
            setImageUrl(res.data.profilePic)
        }
    }

    useEffect(() => {
        loadContact()
    }, [])

    return(
        <>
            <div className="d-flex justify-content-start">
                <h4>Edit Contact</h4>
            </div>
            <Formik initialValues={contact} onSubmit={() => {

            }}>
                <div>
                <Form className="contact-edit-form p-3">
                    <Row className="d-flex">
                    <Col>
                    <PTextInput label="First Name"
                                name="firstName"
                                type="text"
                                className="contact-edit-field form-control d-flex justify-content-start w-100"
                                value={contact.firstName}
                    />
                        <PTextInput label="Email"
                                    name="email"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100"
                                    value={contact.email}
                        />

                    </Col>
                    <Col>
                        <PTextInput label="Last Name"
                                    name="lastName"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100"
                                    value={contact.lastName}
                        />
                        <PTextInput label="Phone"
                                    name="phone"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100"
                                    value={contact.phone}
                        />
                    </Col>
                        <Col className="d-flex">
                            <div className="d-flex w-100 ps-5tea">
                                <ProfileImage imageSource={imageUrl} callback={profilePicUpdateCallback} />
                            </div>
                        </Col>
                    </Row>
                </Form>
                </div>
            </Formik>
        </>
    )
}

export default EditContact