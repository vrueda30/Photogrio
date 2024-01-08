import {Button, Modal, ModalBody, ModalHeader} from "reactstrap";
import {Form, Formik} from "formik";
import PTextInput from "../Common/PTextInput.tsx";
import PDateRangePicker from "../Common/PDateRangePicker.tsx";
import PSelect from "../Common/PSelect.tsx";
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {CONTACT_API_BASE_URL, JOB_API_BASE_URL} from "../../pages/api-routes.tsx";
import axios from "axios";
import {ContactListView} from "../Contact/interfaces.ts";
import './photogrio-forms.css'
import PTextArea from "../Common/PTextArea.tsx";
import {JobsCreateDTO} from "../../interfaces/jobs.ts";

export interface JobEventProps {
    startDateTime: Date,
    endDateTime: Date
    modal: boolean
    toggle: () => void
}

interface JobTypes{
    ID: string | number | readonly string[] | undefined;
    id: number,
    name: string,
    description: string,
    accountId: number
}

const CreateJob = async (job:JobsCreateDTO, token:string):Promise<string | null> => {
    const res = await axios.post(`${JOB_API_BASE_URL}createJob`,job, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return await res.data.status
}

const JobEventForm = (props:JobEventProps) => {
    const {getAccessTokenSilently} = useAuth0()
    const [jobTypes, setJobTypes] = useState<JobTypes[]>([])
    const [contacts, setContacts] = useState<ContactListView[]>([])

    const GetContacts = async(token:string):Promise<ContactListView[]> => {
        const res = await axios.get(`${CONTACT_API_BASE_URL}getContactsForAccount`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })

        return res.data.data
    }
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
            const conRes = await GetContacts(token)
            setContacts(conRes)
        }

        loadJobTypes().catch(() => {
            console.log("Error loading jobs")
        })
    }, [getAccessTokenSilently]);

    return(
        <div>
            <Modal isOpen={props.modal}>
                <ModalHeader toggle={props.toggle}>New Event</ModalHeader>
                <ModalBody>
                    <Formik initialValues={{
                        eventName: '',
                        client: 0,
                        startDateTime:props.startDateTime,
                        endDateTime:props.endDateTime,
                        jobType: 0,
                        location: '',
                        notes: '',
                        allDay: false}}
                            onSubmit={async (values,{setSubmitting}) => {
                                setSubmitting(true)
                                const newJob:JobsCreateDTO = {
                                    id: 0,
                                    name: values.eventName,
                                    location: values.location,
                                    jobDateStart: new Date(values.startDateTime),
                                    jobDateEnd: new Date(values.endDateTime),
                                    allDay: values.allDay,
                                    notes: values.notes,
                                    jobType: Number(values.jobType),
                                    client: Number(values.client)
                                }
                                const token = await getAccessTokenSilently()
                                console.log(JSON.stringify(values))
                                const res = await CreateJob(newJob, token)
                                if (res !== "success") {
                                    console.log("Error creating job")
                                } else {
                                    props.toggle()
                                }
                                setSubmitting(false)
                            }}>
                        <Form>
                        <div className="job-form">
                            <div className="job-form-field">
                                <PTextInput
                                    label="Event Name"
                                    id="eventName"
                                    name="eventName"
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                            <div className="job-form-field">
                                <PSelect label="Client" name="client" className="form-control">
                                    <option value={-1} className="form-control">Select Client</option>
                                    {contacts.map((ct) => <option value={ct.id}>{ct.name}</option>)}
                                </PSelect>
                            </div>
                            <div className="job-form-field">
                                <PSelect label="Job Type" name="jobType" className="form-control">
                                    <option value={0} className="form-control">Select Job</option>
                                    {jobTypes.map((jt) => <option value={jt.ID}>{jt.name}</option>)}
                                </PSelect>
                            </div>
                            <div className="job-form-field">
                                <PDateRangePicker label= "Start" name="startDateTime"  value={props.startDateTime} />
                            </div>
                            <div className="job-form-field">
                                <PDateRangePicker  label="End" name="endDateTime" min={props.startDateTime} value={props.endDateTime} class="form-control" />
                            </div>
                            <div className="job-form-field">
                                <PTextInput label="Location" name="location" id="location" type="textarea" className="form-control" />
                            </div>
                            <div className="job-form-field">
                                <PTextArea label="Notes" name="notes" id="notes" className="form-control" />
                            </div>
                            <div className="d-flex justify-content-end btn-row">
                                    <Button className="btn btn-secondary btn-jb-sec" type="button" onClick={props.toggle}>Cancel</Button>
                                    <Button color="success" type="submit" className="btn btn-primary btn-jb-pri">Save</Button>
                            </div>
                        </div>
                        </Form>
                    </Formik>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default JobEventForm