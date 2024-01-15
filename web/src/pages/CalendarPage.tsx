
import {Calendar, momentLocalizer, SlotInfo, Views} from "react-big-calendar";
import moment from 'moment'
import {useCallback, useEffect, useMemo, useState} from "react";
import JobEventForm from "../components/Forms/JobEventForm.tsx";
import * as pdate from '../utils/date-utils.ts'
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {JOB_API_BASE_URL} from "./api-routes.tsx";
import {CalendarEvent} from "../interfaces/jobs.ts";

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
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
    const {getAccessTokenSilently} = useAuth0()
    const {views} = useMemo(() => ({
        views: Object.keys(Views).map((k) => Views[k]),
    }),[])

    const handleSelectSlot = useCallback((s:SlotInfo) => {
        setEvent({ID:0, start:s.start, end: s.end})
        setShowEventForm(!showEventForm)
    },[])
    const toggle = () => {
        setShowEventForm(!showEventForm)
    }

    const getEvents = async(start:string, end:string) => {
        const token = await getAccessTokenSilently()
        const res = await axios.get(`${JOB_API_BASE_URL}get_calendar_jobs?start=${start}&end=${end}`,{
            headers:{
                Authorization:`Bearer ${token}`
            },
            withCredentials:true
        })

        return await res.data
    }

    const handleEventAdd = async (jevent:CalendarEvent) => {
        jevent.start = new Date(jevent.start)
        jevent.end = new Date(jevent.end)
        setCalendarEvents([...calendarEvents, jevent])
    }

    useEffect(() => {
        const startDate = pdate.firstVisible(new Date())
        const endDate = pdate.lastVisible(new Date())
        getEvents(startDate.toISOString(), endDate.toISOString()).then(async (res) => {
            res.forEach( (e:CalendarEvent) => {
                e.start = new Date(e.start.toLocaleString())
                e.end = new Date(e.end.toLocaleString())
            })
            setCalendarEvents(res)
        })

    }, []);

    return(
        <div>
            <div className="calendar ms-4 mt-4">
                <Calendar className="calendar"
                      localizer={localizer}
                      onSelectSlot={handleSelectSlot}
                      onSelectEvent={(e)=>{console.log(e.id)}}
                      onNavigate={(d,v,a)=>{
                          console.log(d)
                          console.log(v)
                          console.log(a)
                      }}
                      events={calendarEvents}
                      views={views}
                      selectable />
            </div>
            <JobEventForm modal={showEventForm} startDateTime={event.start} endDateTime={event.end} toggle={toggle} handleEventAdd={handleEventAdd}/>
        </div>
    )
}

export default CalendarPage