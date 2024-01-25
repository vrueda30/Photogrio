import {ToDo} from "../../interfaces/todos.ts";
import {Button, Col, Row} from "reactstrap";
import ToDoItem from "./ToDoItem.tsx";
import '../components.css'
import NewToDoForm from "../Forms/NewToDoForm.tsx";

export interface ToDoPanelProps{
    toDos?: ToDo[],
    listName?: string
    listId: number
    handleAdd: (toDo:ToDo)=>void
    handleChange: (toDo:ToDo)=>void
    toggle: ()=>void
    isOpen: boolean
}
const ToDoPanel = (props:ToDoPanelProps) => {
    return(
        <div className="to-do-panel-view">
            <div className="to-do-panel-header m-0">
                <div className="d-flex justify-content-center align-items-center mt-2">
                    <div className="flex-fill">
                        <h5>{props.listName}</h5>
                    </div>
                    <div className="me-3">
                        <Button type="button" className="btn btn-add-todo" onClick={props.toggle} >New To Do</Button>
                    </div>
                </div>
                <Row>
                    <Col>
                        To Do
                    </Col>
                    <Col>
                        Due Date
                    </Col>
                </Row>
            </div>
            <div className="mt-5 ms-3 me-3">
                {!props.toDos || props.toDos.length > 0 && props.toDos.map((t)=>{
                    return(
                        <ToDoItem toDoItem={t} name={t.name} handleChange={props.handleChange} />
                    )
                })}
            </div>
            {props.isOpen && <NewToDoForm listId={props.listId} handleAddToDo={props.handleAdd} toggle={props.toggle} isOpen={props.isOpen} />}
        </div>
    )
}

export default ToDoPanel