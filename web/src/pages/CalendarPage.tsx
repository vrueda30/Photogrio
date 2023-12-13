
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from 'moment'

const localizer = momentLocalizer(moment)
const CalendarPage = () => {
    return(
        <div className="calendar">
            <Calendar className="calendar" localizer={localizer} />
        </div>
    )
}

export default CalendarPage