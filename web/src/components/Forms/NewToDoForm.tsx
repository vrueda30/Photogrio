import {Button, Modal, ModalBody, ModalHeader} from "reactstrap";
import {Form, Formik} from "formik";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {JOB_API_BASE_URL, TODO_API_BASE_URL} from "../../pages/api-routes.tsx";
import {ToDo} from "../../interfaces/todos.ts";
import PTextInput from "../Common/PTextInput.tsx";
import PDateRangePicker from "../Common/PDateRangePicker.tsx";
import PTextArea from "../Common/PTextArea.tsx";


export interface ToDoProps{
    listId: number,
    handleAddToDo: (toDo:ToDo) => void,
    toggle: () => void,
    isOpen: boolean
}
const NewToDoForm = (props: ToDoProps) => {
    const currentDate = new Date()
    const {getAccessTokenSilently} = useAuth0()

    const addToDo = async (values: { id: number; name: string; dueDate: Date; completed: boolean; list: number; notes: string; }) => {
        try {
            console.log("In add todo")
            const token = await getAccessTokenSilently()
            console.log(JSON.stringify(values))
            const vals:ToDo = {
                id:values.id,
                toDoListId: +values.list,
                name: values.name,
                notes: values.notes,
                dueDate: new Date(values.dueDate),
                completed: false
            }
            const res = await axios.post(`${TODO_API_BASE_URL}create_todo`,vals,{
                headers:{
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            }).then((res) => {
                return res.data
            }).catch((e)=>{
                console.log(e)
            })
            console.log(`Recieved from api: ${JSON.stringify(res)}`)
            props.handleAddToDo(res)
            props.toggle()
        } catch(e){
            console.log(e)
        }
    }

    return(
        <div>
            <Modal isOpen={props.isOpen}>
                <ModalHeader toggle={props.toggle}>New To-Do</ModalHeader>
                <ModalBody>
                    <Formik initialValues={{
                        id:-1,
                        name: '',
                        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                        completed: false,
                        list: props.listId,
                        notes: ''
                    }} onSubmit={async (values) => {
                        values.id = 0
                        await addToDo(values)
                    }}>
                    <Form>
                        <PTextInput name="name" label="Name" className="form-control" />
                        <PDateRangePicker label="Due Date" name="dueDate" />
                        <PTextArea label="Notes" name="notes" className="form-control" />
                        <div className="d-flex mt-3 justify-content-end">
                            <div className="me-1">
                                <Button className="btn-secondary" onClick={props.toggle}>Cancel</Button>
                            </div>
                            <div>
                                <Button type="submit" className="btn-success">Save</Button>
                            </div>
                        </div>
                    </Form>
                    </Formik>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default NewToDoForm