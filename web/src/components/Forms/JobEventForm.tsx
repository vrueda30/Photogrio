import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {Formik} from "formik";
import PTextInput from "../Common/PTextInput.tsx";
import PDateRangePicker from "../Common/PDateRangePicker.tsx";

export interface JobEventProps {
    startDateTime: Date,
    endDateTime: Date
    modal: boolean
    toggle: () => void
}

interface Values {
    eventName: string,
    startDateTime: Date,
    endDateTime: Date,
    allDay: boolean
}

const JobEventForm = (props:JobEventProps) => {

    const submit = async (values:Values) => {
        alert(JSON.stringify(values))
    }



    return(
        <div>
            <Modal isOpen={props.modal}>
                <ModalHeader toggle={props.toggle}>New Event</ModalHeader>
                <ModalBody>
                    <Formik initialValues={{eventName: '',
                        startDateTime:props.startDateTime,
                        endDateTime:props.endDateTime,
                        allDay: false}} onSubmit={submit}>
                        <div>
                        <PTextInput
                            label="Event Name"
                            id="eventName"
                            name="eventName"
                            type="text"
                            />
                            <PDateRangePicker label= "Start" name="startDateTime" value={props.startDateTime} />
                            <PDateRangePicker label="End" name="endDateTime" min={props.startDateTime} value={props.endDateTime} />
                        </div>
                    </Formik>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default JobEventForm