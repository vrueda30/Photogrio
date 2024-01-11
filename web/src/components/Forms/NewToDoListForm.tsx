import {Button, Modal, ModalBody, ModalHeader} from "reactstrap";
import {Form, Formik} from "formik";
import PTextInput from "../Common/PTextInput.tsx";

export interface ToDoListProps{
    isOpen: boolean,
    toggle: () => void,
    submit: (name:string) => void
}
const NewToDoListForm = (props:ToDoListProps) => {
    return(
        <div className="new-to-do-list-form">
            <Modal isOpen={props.isOpen} className="new-to-do-list-form" >
                <ModalHeader toggle={props.toggle}>New ToDo List</ModalHeader>
                <ModalBody>
                    <div>
                        <Formik initialValues={{todoListName: ""}} onSubmit={async (values) => {
                            props.submit(values.todoListName)
                        }}>
                            <Form>
                            <div>
                                <PTextInput className="form-control" label="To Do List Name" name="todoListName" key="toDoListName" />
                            </div>
                            <div className="d-flex justify-content-end mt-3">
                                <Button type="submit" color="success" className="btn-primary">Save</Button>
                            </div>
                            </Form>

                        </Formik>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default NewToDoListForm