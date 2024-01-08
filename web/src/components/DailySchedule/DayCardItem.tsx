import {Task} from "../../interfaces/daycardinterfaces.ts";
import "./day-card-styles.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Row} from "reactstrap";

export interface TaskProps{
    tasks: Task[]
}


export const DayCardItem = (props:TaskProps) => {
    const displayTasks = props.tasks.map((t) => {
        return(
            <div className="day-card-line-item mb-2">
                <Row>
                    <div className="line-item-grip"><FontAwesomeIcon icon="grip-lines-vertical" /></div>
                    <div className="w-auto">{t.start} {t.name}</div>
                </Row>
            </div>
        )
    })

    return(
        <>
            {displayTasks}
        </>
    )
}

export default DayCardItem