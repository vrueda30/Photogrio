import {Props, Task} from "../../interfaces/daycardinterfaces.ts";
import {Col, Row} from "reactstrap";
import DayCardItem from "./DayCardItem.tsx";
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {JOB_API_BASE_URL} from "../../pages/api-routes.tsx";
import {CalendarEvent} from "../../interfaces/jobs.ts";
import {timeToString} from "../../utils/date-utils.ts";

export const DayCard = (props: Props) => {
    const [imgIndex = null, setImgIndex] = useState<string | null>(null)
    const {getAccessTokenSilently} = useAuth0()
    const [jobs, setJobs] = useState<CalendarEvent[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const getIndexAsString = async(index:number|undefined):Promise<string> => {
        switch (index){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                return `0${index}`
            default:
                return `${index}`
        }
    }
    const getCalendarEvents = async(date:Date):Promise<CalendarEvent[]> => {
        const token = await getAccessTokenSilently()
        const queryDate = date.toISOString()
        const events = await axios.get(`${JOB_API_BASE_URL}get_jobs_by_day?date=${queryDate}`, {
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        return events.data
    }
    const getEventsForDay = async()=> {
        const date = new Date(+props?.year, +props?.monthNumber, +props?.day,0,0,0)
        const dayJobs = getCalendarEvents(date)
        const cjobs = await dayJobs
        const taskList:Task[] = []
        cjobs.forEach((job) => {
            const taskDate = new Date(job.start)
            const startTimeStr = timeToString(taskDate.getHours(), taskDate.getMinutes()) //`${taskDate.getHours()}:${taskDate.getMinutes()}`
            taskList.push({
                id: job.id,
                name: job.title,
                type: 1,
                start: startTimeStr
            })
        })
        setTasks(taskList)
        setJobs(await dayJobs)
    }

    useEffect(() => {
        if (props.imageIndex) {
            getIndexAsString(props?.imageIndex).then((r) => {
                setImgIndex(r)
            })
        }
        getEventsForDay().catch(() => {
            console.log("Error retrieving jobs for the day")
        })
    }, []);
    return(
            <Col className="day-card col-12 col-xl-2 m-1">
                <Row className="justify-content-center align-items-center daily-card-header">
                    {props?.month} {props?.day}, {props?.year}  {props?.temp}&#8457; {imgIndex && <img alt="weather icon" className="weather-icon" src={`https://developer.accuweather.com/sites/default/files/${imgIndex}-s.png`} />}
                </Row>
                <Row className="day-card-body d-flex pb-2">
                    <Col className="col-12 p-0 m-0">
                        <DayCardItem tasks={tasks} />
                    </Col>
                </Row>
            </Col>
    );
}

export default DayCard;