import {Address, Contact} from "./interfaces.ts";
import {Col, Container, Row} from "reactstrap";
import ProfileImage from "../ProfileImage.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
export interface CardProps{
    contact: Contact,
    callback: (edit: boolean) => void
}

const WriteAddress = (address?: Address) => {
    console.log(`address received: ${JSON.stringify(address)}`)
    return (
        <>
            <Row className="row-divider mt-2"><span></span></Row>
            <Row className="d-flex pt-3 mb-0 align-items-start">
                <h6 className="d-flex align-items-start mb-1">Address</h6>
                <div className="d-flex align-items-start align-items-center">
                    <FontAwesomeIcon icon="location-dot" />
                    <span className="ms-3">
                        <div>{address?.address1}</div>
                        <div>{address?.address2}</div>
                        <div>{address?.city}, {address?.state} {address?.zip}</div>
                    </span>
                </div>
            </Row>
        </>
    )
}

const ContactCard = (props: CardProps) => {

    return(
        <>
            <Container className="contact-card pt-3 ps-5 pe-5">
                <Row className="text-start contact-card-header pb-3">
                    <Col className="col-2">
                        <ProfileImage readOnly={true} imageSource={props.contact.profilePic} callback={() => {}} />
                    </Col>
                    <Col className="col-6 d-flex align-items-center">
                        <h3> {props.contact.firstName} {props.contact.lastName}</h3>
                        <span className="ms-3 edit-pencil">
                            <FontAwesomeIcon icon="pencil" onClick={() => {
                                console.log("pencil clicked")
                                props.callback(true)
                            }}/>
                        </span>
                    </Col>
                </Row>
                <Row className="d-flex pt-3 mb-0 align-items-start">
                    <h6 className="d-flex align-items-start mb-1">Email Address</h6>
                    <div className="d-flex align-items-start align-items-center">
                        <FontAwesomeIcon icon="envelope" /> <span className="ms-3">{props.contact.email}</span>
                    </div>
                </Row>
                <Row className="row-divider mt-2"><span></span></Row>
                <Row className="d-flex pt-3 mb-0 align-items-start">
                    <h6 className="d-flex align-items-start mb-1">Phone Number</h6>
                    <div className="d-flex align-items-start align-items-center">
                        <FontAwesomeIcon icon="phone" />
                        <span className="ms-3">{props.contact.phone}</span>
                    </div>
                </Row>
                {props.contact.address?.ID !== 0 && <WriteAddress {...props.contact.address} />}
            </Container>
        </>
    )
}

export default ContactCard