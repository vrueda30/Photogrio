import {ToDo} from "../../interfaces/todos.ts";

export interface ToDoItemProps{
    toDoItem: ToDo,
    name: string,
    handleChange: (todo:ToDo) => void,
}


const ToDoItem = (props:ToDoItemProps) => {
    const dueDate = new Date(props.toDoItem.dueDate)

    const onCheckChanged = async (todo:ToDo) =>{
        todo.completed = !todo.completed;
        console.debug(`todo changed: ${JSON.stringify(todo)}`)
        props.handleChange(todo);
    }
    return(
        <div className="row to-do-item ms-2 me-2 mt-2 p-2">
            <div className="col col-6 d-flex">
                <input type="checkbox"  id={`${props.toDoItem.ID}`}
                       name={props.name}
                       checked={props.toDoItem.completed}
                       onChange={()=>onCheckChanged(props.toDoItem)}
                />
                <label className={`ms-4${props.toDoItem.completed?' to-do-item-completed':''}`} htmlFor={`${props.toDoItem.ID}`}>{props.toDoItem.name}</label>
            </div>
            <div className="col col-6">
                {`${dueDate.getMonth()+1}-${dueDate.getDate().toString().padStart(2,"0")}-${dueDate.getFullYear()}`}
            </div>
        </div>
    )
}

export default ToDoItem