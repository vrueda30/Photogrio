import {useParams} from "react-router-dom";
import {Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {CONTACT_API_BASE_URL} from "./api-routes.tsx";
import PTextInput from "../components/Common/PTextInput.tsx";
import {Col, Row} from "reactstrap";
import ProfileImage, {ProfileFile} from "../components/ProfileImage.tsx";
import PSelect from "../components/Common/PSelect.tsx";


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
    address: Address | undefined;
    contactType: ContactType | undefined;
}

export const EditContact = () => {
    const [contact, setContact] = useState<ContactInfo>({
        ID: 0,
        address: undefined,
        contactType: undefined,
        email: "",
        firstName: "",
        lastName: "",
        phone: ""
    })
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
                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                value={contact.firstName}
                                />
                        <PTextInput label="Email"
                                    name="email"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                    value={contact.email}
                        />
                        <PTextInput label="Address1"
                                name="address1"
                                type="text"
                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                value={contact.address?.address1}
                                />
                        <PTextInput label="City"
                                    name="city"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                    value={contact.address?.city}
                                    />
                        <PTextInput label="Zip Code"
                                    name="zip"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100"
                                    value={contact.address?.zip}
                                    />
                    </Col>
                    <Col>
                        <PTextInput label="Last Name"
                                    name="lastName"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                    value={contact.lastName}
                        />
                        <PTextInput label="Phone"
                                    name="phone"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                    value={contact.phone}
                        />
                        <PTextInput label="Address2"
                                    name="address2"
                                    type="text"
                                    className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                    value={contact.address?.address2}
                                    />
                        <PSelect label="State"
                                 name="state"
                                 className="form-control justify-content-start w-100">
                            <option value="">Select a State</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </PSelect>
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