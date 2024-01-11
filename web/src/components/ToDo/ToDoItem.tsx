import {ToDo} from "../../interfaces/todos.ts";

export interface ToDoItemProps{
    toDoItem: ToDo,
    name: string,
}
const ToDoItem = (props:ToDoItemProps) => {
    const dueDate = new Date(props.toDoItem.dueDate)
    return(
        <div className="row w-100">
            <div className="col col-4">
                <input type="checkbox" id={`${props.toDoItem.ID}`} name={props.name} />
            </div>
            <div className="col col-4">
                {props.toDoItem.name}
            </div>
            <div className="col col-4">
                {`${dueDate.getMonth()+1}-${dueDate.getDate().toString().padStart(2,"0")}-${dueDate.getFullYear()}`}
            </div>
        </div>
    )
}

export default ToDoItem