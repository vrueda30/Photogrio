import {useParams} from "react-router-dom";
import {Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {CONTACT_API_BASE_URL} from "../api-routes.tsx";
import PTextInput from "../../components/Common/PTextInput.tsx";
import {Button, Col, Nav, NavItem, NavLink, Row} from "reactstrap";
import ProfileImage, {ProfileFile} from "../../components/ProfileImage.tsx";
import PSelect from "../../components/Common/PSelect.tsx";
import ContactCard from "../../components/Contact/ContactCard.tsx";
import {Contact} from "../../components/Contact/interfaces.ts";



export const EditContact = () => {
    const [contact, setContact] = useState<Contact>({
        ID: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
            ID: 0,
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            accountId: 0
        }, birthDay: undefined, city: "", profilePic: "",
        contactType: 1,
        notes: '',
        address1: '',
        address2: '',
        zip: '',
        state: '',
        accountId: 0
    })
    const [edit, setEdit] = useState(false)
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
        console.log(res.data.url)
        setImageUrl(res.data.url)
        const updateContact = {...contact}
        updateContact.profilePic = res.data.url
        console.log(`Profile pic updated contact: ${JSON.stringify(updateContact)}`)
        setContact(updateContact)
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
            const retrievedContact = {
                ID: res.data.ID,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                phone: res.data.phone,
                address: {
                    ID: res.data.address.ID,
                    address1: res.data.address.address1,
                    address2: res.data.address2,
                    city: res.data.address.city,
                    state: res.data.address.state,
                    zip: res.data.address.zip,
                    accountId: res.data.accountId
                },
                birthDay: res.data.birthDay,
                city: res.data.address.city,
                profilePic: res.data.profilePic,
                contactType: res.data.contactType,
                notes: res.data.notes,
                address1: res.data.address.address1,
                address2: res.data.address.address2,
                zip: res.data.address.zip,
                state: res.data.address.state,
                accountId: res.data.accountId
            }
            setContact(retrievedContact)
            setImageUrl(res.data.profilePic)
        }
    }

    const updateContact = async(values:Contact) => {
        const token = await getAccessTokenSilently()
        try{
            values.contactType = +values.contactType
        const res = await axios.put(`${CONTACT_API_BASE_URL}`, values,{
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials:true,
        })
            const retrievedContact = {
                ID: res.data.ID,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                phone: res.data.phone,
                address: {
                    ID: res.data.address.ID,
                    address1: res.data.address.address1,
                    address2: res.data.address2,
                    city: res.data.address.city,
                    state: res.data.address.state,
                    zip: res.data.address.zip,
                    accountId: res.data.accountId
                }, birthDay: res.data.birthDay,
                city: res.data.city,
                profilePic: res.data.profilePic,
                contactType: +res.data.contactType,
                notes: res.data.notes,
                address1: res.data.address.address1,
                address2: res.data.address.address2,
                zip: res.data.address.zip,
                state: res.data.address.state,
                accountId: res.data.accountId
            }
            setContact(retrievedContact)
            setEdit(!edit);}catch(e){
                if (e !== null){
                    console.log(e)
                }
        }
    }

    useEffect(() => {
        loadContact()
    }, [])

    const editForm = () => {
        return(
            <>
                <div className="d-flex justify-content-start">
                    <Row className="d-flex w-100">
                        <Col className="d-flex justify-content-start ps-4">
                            <h4>{contact?.firstName} {contact?.lastName}</h4>
                        </Col>
                        <Col className="d-flex justify-content-end pe-3">
                            <div className="d-flex align-items-end">
                                <Button form={'contact-edit'} type="submit" className="btn btn-success btn-save">Save</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Nav tabs>
                    <NavItem>
                        <NavLink >Profile</NavLink>
                    </NavItem>
                </Nav>
                <Formik initialValues={contact}
                        onSubmit={async (v, a) => {
                            v.address.address1 = v.address1
                            v.address.address2 = v.address2
                            v.address.city = v.city
                            v.address.zip = v.zip
                            v.address.state = v.state
                            v.profilePic = imageUrl
                            console.log(`Submitting update: ${JSON.stringify(v)}`)
                            await updateContact(v)
                            a.setSubmitting(false)
                }}>
                    <div>
                        <Form id="contact-edit" className="contact-edit-form p-3">
                            <Row className="d-flex">
                                <Col>
                                    <PTextInput label="First Name"
                                                name="firstName"
                                                type="text"
                                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                                initialValue={contact?.firstName}
                                    />
                                    <PTextInput label="Email"
                                                name="email"
                                                type="text"
                                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                                initialValue={contact?.email}
                                    />
                                    <PTextInput label="Address1"
                                                name="address1"
                                                type="text"
                                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                                initialValue={contact.address1}
                                    />
                                    <PTextInput label="City"
                                                name="city"
                                                type="text"
                                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                                initialValue={contact?.address.city}
                                    />
                                    <PTextInput label="Zip Code"
                                                name="zip"
                                                type="text"
                                                className="contact-edit-field form-control d-flex justify-content-start w-100"
                                                initialValue={contact?.address.zip}
                                    />
                                </Col>
                                <Col>
                                    <PTextInput label="Last Name"
                                                name="lastName"
                                                type="text"
                                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                                initialValue={contact.lastName}
                                    />
                                    <PTextInput label="Phone"
                                                name="phone"
                                                type="text"
                                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                                initialValue={contact.phone}
                                    />
                                    <PTextInput label="Address2"
                                                name="address2"
                                                type="text"
                                                className="contact-edit-field form-control d-flex justify-content-start w-100 mb-2"
                                                initialValue={contact.address.address2}
                                    />
                                    <PSelect label="State"
                                             name="state"
                                             initialValue={contact.address.state}
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
                                <Col className="w-100">
                                    <Row className="w-100">
                                        <PSelect label="Contact Type"
                                                 name="contactType"
                                                 className="form-control">
                                            <option value="1">Client</option>
                                            <option value="2">Hot Lead</option>
                                            <option value="3">Cold Lead</option>
                                            <option value="4">Other</option>
                                        </PSelect>
                                    </Row>
                                    <Row className="w-100 pt-5">
                                        <ProfileImage imageSource={imageUrl} callback={profilePicUpdateCallback} />
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Formik>
            </>
        )
    }


    if (edit) {
        return editForm()
    }else{
        return (
            <div className="pt-5">
                <ContactCard callback={()=>{setEdit(!edit)}} contact={contact}  />
            </div>
        )
    }
}

export default EditContact