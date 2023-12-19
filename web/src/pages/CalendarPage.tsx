
import {Calendar, momentLocalizer, SlotInfo} from "react-big-calendar";
import moment from 'moment'
import {useCallback, useState} from "react";
import JobEventForm from "../components/Forms/JobEventForm.tsx";

const localizer = momentLocalizer(moment)

export interface ScheduleEvent {
    ID: number,
    start?: Date,
    end?: Date,
    title?: string,
}

export interface CalendarProps {
    dataSource: ScheduleEvent[]
}
const CalendarPage = () => {
    const defaultEvent:ScheduleEvent = {
        ID: 0,
        start: undefined,
        end: undefined,
        title: ''
    }
   // const [events,setEvents] = useState(props.dataSource)
    const [showEventForm, setShowEventForm] = useState(false)
    const [event, setEvent] = useState<ScheduleEvent>(defaultEvent)
    const handleSelectSlot = useCallback((s:SlotInfo) => {
        setEvent({ID:0, start:s.start, end: s.end})
        setShowEventForm(!showEventForm)
    },[])
    const toggle = () => {
        setShowEventForm(!showEventForm)
    }

    return(
        <div>
            <div className="calendar">
                <Calendar className="calendar"
                      localizer={localizer}
                      onSelectSlot={handleSelectSlot}
                      selectable />
            </div>
            <JobEventForm modal={showEventForm} startDateTime={event.start} endDateTime={event.end} toggle={toggle}/>
        </div>
    )
}

export default CalendarPage