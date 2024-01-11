import {Task} from "../../interfaces/daycardinterfaces.ts";
import "./day-card-styles.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row} from "reactstrap";

export interface TaskProps{
    tasks: Task[]
}


export const DayCardItem = (props:TaskProps) => {
    const displayTasks = props.tasks.map((t) => {
        return(
                <Row className="d-flex day-card-line-item align-items-start justify-content-start mt-1 ps-2 p-0">
                    <Col className="d-flex justify-content-start align-items-center">
                        <FontAwesomeIcon icon={["fal","calendar"]} className="me-2" />
                        <span className="line-item-txt"> {t.start} {t.name}</span>
                    </Col>
                </Row>
        )
    })

    return(
        <>
            {displayTasks}
        </>
    )
}

export default DayCardItem