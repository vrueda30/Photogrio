import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {Formik} from "formik";
import PTextInput from "../Common/PTextInput.tsx";
import PDateRangePicker from "../Common/PDateRangePicker.tsx";
import PSelect from "../Common/PSelect.tsx";
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {JOB_API_BASE_URL} from "../../pages/api-routes.tsx";
import axios from "axios";

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

interface JobTypes{
    id: number,
    name: string,
    description: string,
    accountId: number
}

const JobEventForm = (props:JobEventProps) => {
    const {getAccessTokenSilently} = useAuth0()
    const [jobTypes, setJobTypes] = useState<JobTypes[]>([])
    useEffect(() => {
        const loadJobTypes = async() => {
            const token = await getAccessTokenSilently()
            const res = await axios.get(`${JOB_API_BASE_URL}get_job_types`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            setJobTypes(res.data)
        }

        loadJobTypes()
    }, [getAccessTokenSilently]);

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
                            className="form-control"
                            />
                            <PSelect label="Job Type" name="jobType" className="form-control">
                                <option value={-1} className="form-control">Select Job</option>
                                {jobTypes.map((jt) => <option value={jt.id}>{jt.name}</option>)}
                            </PSelect>
                            <PDateRangePicker label= "Start" name="startDateTime"  value={props.startDateTime} />
                            <PDateRangePicker  label="End" name="endDateTime" min={props.startDateTime} value={props.endDateTime} class="form-control" />
                        </div>
                    </Formik>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default JobEventForm