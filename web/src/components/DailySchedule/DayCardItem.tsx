import {Task} from "./daycardinterfaces.ts";

export interface TaskProps{
    tasks: Task[]
}


export const DayCardItem = (props:TaskProps) => {
    const displayTasks = props.tasks.map((t,i) => {
        return(
        <div>{t.name} {i}</div>
        )
    })

    return(
        <>
            {displayTasks}
        </>
    )
}

export default DayCardItem