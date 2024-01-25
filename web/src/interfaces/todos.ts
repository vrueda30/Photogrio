export interface ToDo {
    ID?: number,
    id: number,
    name: string,
    dueDate: Date,
    completed: boolean,
    list: number,
    notes: string,
    toDoListId: number,
    contactId?: number
}

export interface ToDoList {
    ID:number,
    name:string,
    accountId: number,
}