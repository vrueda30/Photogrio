import {Button} from "reactstrap";
import NewToDoListForm from "../components/Forms/NewToDoListForm.tsx";
import {useEffect, useReducer, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {TODO_API_BASE_URL} from "./api-routes.tsx";
import {ToDo, ToDoList} from "../interfaces/todos.ts";
import ToDoPanel from "../components/ToDo/ToDoPanel.tsx";

export interface ActiveTab {
    id: number,
    title: string
}

export interface ToDoAction{
    type?:string,
    id?: number,
    name?: string,
    dueDate?: Date,
    list?: number,
    completed?: boolean,
    notes?: string,
    payload?:ToDo[],
    todo?:ToDo,
}

export interface ToDoState{
    todos:ToDo[]
}

const toDoReducer = (todos = null , action:ToDoAction) =>{
    switch (action.type){
        case 'added': {
            console.log(`to-do: ${JSON.stringify(action)}`)
            if (!todos){
                return(
                    [{
                        id: action.id,
                        name: action.name,
                        dueDate: action.dueDate,
                        list: action.list,
                        completed:false
                    }]
                )
            }
            return [...todos,{
                id: action.id,
                name: action.name,
                dueDate: action.dueDate,
                list: action.list,
                completed:false
            }]
        }
        case 'initialize': {
            return action.payload
        }
        case 'changed':{
            return todos.map(t => {
                console.debug(`todo id: ${t.ID}`)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (t.ID === action.todo.ID){
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return action.todo
                } else {
                    return t
                }
            })
        }
        case 'deleted': {
            return todos.filter(t => t.id !== action.id)
        }
        default: {
            throw Error('Unknown action: ' + action.type)
        }
    }
}

const ToDos = () => {
    const initialToDos = null
    const [newListOpen, setNewListOpen] = useState(false)
    const [newToDoOpen,setNewToDoOpen] = useState(false)
    const {getAccessTokenSilently} = useAuth0()
    const [toDoLists, setToDoLists] = useState<ToDoList[]>([])
    const [activeTab, setActiveTab] = useState<ActiveTab>()
    const [title, setTitle] = useState("To Dos")
    const [toDos, dispatch] = useReducer(
        toDoReducer,
        initialToDos
    )
    const toggleNewListOpen = () => {
        setNewListOpen(!newListOpen)
    }

    const toggleNewToDo = () => {
        setNewToDoOpen(!newToDoOpen)
    }

    const handleUpdateToDo = async (todo:ToDo) => {
        const token =  await getAccessTokenSilently();
        console.log(`completed: ${todo.completed}`)
        const updateToDo = {
            name: todo.name,
            completed: todo.completed,
            contactId: todo?.contactId,
        }
        await axios.patch(`${TODO_API_BASE_URL}${todo.ID}`, updateToDo, {
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        dispatch({
            type: 'changed',
            todo: todo,
        })
    }

    const handleAddToDo = (todo:ToDo) => {
        console.log(`In handle add todo: ${JSON.stringify(todo)}`)
        dispatch({
            type: 'added',
            id: todo.ID,
            name: todo.name,
            dueDate:todo.dueDate,
            completed:todo.completed,
            notes: todo.notes,
            list: todo.list
        })
    }

    const submitNewList = async (name:string) => {
        const token = await getAccessTokenSilently()
        const res = await axios.post(`${TODO_API_BASE_URL}create_todo_list`,
            {name: name},
            {
                headers:{
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            }).then((res)=>{
                return res.data
        }).catch((e)=>{
                console.log(e)
        })

        setToDoLists([
            ...toDoLists,
            res
        ].sort((n1,n2)=> {
            if (n1.name > n2.name){
                return 1;
            }

            if (n1.name < n2.name){
                return -1
            }
            return 0
        }))

        await updateListView(res.ID, res.name)
        toggleNewListOpen()
        console.log(JSON.stringify(toDoLists))
    }

    const loadToDosForList = async (listId:number):Promise<ToDo[]> => {
        const token = await getAccessTokenSilently()
        const res = await axios.get(`${TODO_API_BASE_URL}get_todos_for_list?listid=${listId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        return await res.data
    }

    const loadToDoLists = async ():Promise<ToDoList[]> => {
        const token = await getAccessTokenSilently()
        return await axios.get(`${TODO_API_BASE_URL}get_todo_lists`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }).then((res)=>{
            updateListView(res.data.ID,res.data.name)
            return res.data
        }).catch((e)=>{
            console.log(e)
        })
    }

    const updateListView = async (id:number,title:string) => {
        setActiveTab({id:id,title:title})
        setTitle(title)
        if (id) {
            console.log(id)
            const res = await loadToDosForList(id)
            dispatch({
                type:'initialize',
                payload: res
            })
        }
    }

    const deleteList = async(id?:number,title?:string) => {
        const shouldDelete = confirm(`Are you sure you want to delete ${title}`)
        const token = await getAccessTokenSilently()
        if (shouldDelete){
            await axios.delete(`${TODO_API_BASE_URL}delete_todo_list?listid=${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials:true
            }).then((res) => {
                return res.data
            })
            let tindex = -1
            toDoLists.forEach((item,index) => {
                if (item.ID === id){
                    tindex = index
                }
            })
            const newToDoList = [...toDoLists]
            newToDoList.splice(tindex, 1)
            setToDoLists([...newToDoList])
            if (toDoLists.length > 0){
                updateListView(toDoLists[0].ID, toDoLists[0].name)
            }else{
                setTitle("To Dos")
                setActiveTab({id:-1, title:""})
            }
        }
    }

    useEffect(() => {
        loadToDoLists().then((res)=>{
            setToDoLists(res)
            if (res.length > 0){
                updateListView(res[0].ID, res[0].name)
            }
        })
    }, []);


    return(
        <div>
        <div className="to-dos">
            <div className="to-do-side-bar">
                <Button className="btn-photogrio" onClick={toggleNewListOpen}>Create List</Button>
                <h5>To-Dos Lists</h5>
                    {toDoLists.map((t)=>{
                        const activeSideBarItem = activeTab?.id === t.ID ? "active-todo-sidebar-item" : ""
                        return(
                            <div className={`ms-2 me-2 to-do-list-sidebar-item ${activeSideBarItem}`}
                                 key={t.ID}
                                 onClick={async ()=>{
                                     await updateListView(t.ID, t.name)
                                 }}>
                                {t.name}
                            </div>
                        )
                    })}
            </div>
            <div className="to-do-panel mt-2 ms-2 w-100 p-0">
                <div className="mt-2 m-0 p-0">
                    <div className="d-flex h-100 align-content-center justify-content-center mt-5">
                        {(toDoLists.length > 0 && toDos) && <ToDoPanel toDos={toDos}
                                                                       listName={title}
                                                                       listId={activeTab?.id}
                                                                       toggle={toggleNewToDo}
                                                                       isOpen={newToDoOpen}
                                                                       handleAdd={handleAddToDo}
                                                                       handleChange={handleUpdateToDo}
                        /> }
                    </div>
                </div>
            </div>
        </div>
            {newListOpen && <NewToDoListForm isOpen={newListOpen} toggle={toggleNewListOpen} submit={submitNewList} />}
            {/*    {newListOpen && <NewToDoListForm isOpen={newListOpen} toggle={toggleNewListOpen} submit={submitNewList}/>}

            {newToDoOpen && <NewToDoForm listId={activeTab.id} handleAddToDo={handleAddToDo} toggle={toggleNewToDo} isOpen={newToDoOpen} />} */}
        </div>
    )
}

export default ToDos