import '../components.css'
import {ToDo} from "../../interfaces/todos.ts";
import {useState} from "react";

const NoToDos = () => {
    return(
        <>
            <div className="mt-3">
                There are no To Dos
            </div>
        </>
    )
}

const ToDoItems = () => {
    return(
        <>
            Work in progress
        </>
    )
}
const ToDoWidget = () => {
    const [todos, setToDos] = useState<ToDo[]>([])

    return(
        <div className="to-do-widget p-0">
            <div className="to-do-widget-header justify-content-start align-items-start d-flex ps-2">To Do's</div>
            <div className="to-do-widget-body">
                {todos.length > 0 ?(
                    <ToDoItems />
                ) : (
                    <NoToDos />
                )}
            </div>
        </div>
    )
}

export default ToDoWidget