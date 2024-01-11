import {ToDo} from "../../interfaces/todos.ts";
import {Col, Container, Row} from "reactstrap";
import ToDoItem from "./ToDoItem.tsx";
import '../components.css'

export interface ToDoPanelProps{
    toDos: ToDo[],
    className?: string,
}
const ToDoPanel = (props:ToDoPanelProps) => {
    return(
        <div className="to-do-panel-view">
            <div className="to-do-panel-header m-0 p-0">
                <Row>
                    <Col>
                        To Do
                    </Col>
                    <Col>
                        Client
                    </Col>
                    <Col>
                        Due Date
                    </Col>
                </Row>
            </div>
            <div className={`to-do-panel-body${props.className ? ` ${props.className}`:''}`}>
                {!props.toDos || props.toDos.length > 0 && props.toDos.map((t)=>{
                    return(
                        <ToDoItem toDoItem={t} name={t.name} />
                    )
                })}
            </div>
        </div>
    )
}

export default ToDoPanel