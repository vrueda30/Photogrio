import {Col, Container, Row} from "reactstrap";
import DayCard from "./DayCard.tsx";
import {useEffect, useMemo, useState} from "react";
import './day-card-styles.css'
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios"
import {ACCOUNT_API_BASE_URL, SCHEDULING_API_BASE_URL, WEATHER_API_BASE_URL} from "../../pages/api-routes.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const DAY_BREAK_POINT = 920

const getMonthAsString = (m:number): string => {
    let val = "";
    switch (m) {
        case 0:
            val = "Jan"
            break;
        case 1:
            val = "Feb"
            break;
        case 2:
            val = "Mar"
            break;
        case 3:
            val="Apr"
            break;
        case 4:
            val="May"
            break;
        case 5:
            val="Jun"
            break;
        case 6:
            val="Jul"
            break;
        case 7:
            val="Aug"
            break;
        case 8:
            val="Sept"
            break;
        case 9:
            val="Oct"
            break;
        case 10:
            val="Nov"
            break;
        case 11:
            val="Dec"
            break;
        default:
            val="unknown"
            break;
    }

    return  val
}

export interface DDate{
    day: number | string,
    month: string,
    year: string,
    monthNumber: number
}

export interface Coordinates{
    latitude: number,
    longitude: number
}

export interface Position{
    coords: Coords
}

export interface Coords{
    latitude: number
    longitude: number
}

export interface Forecast {
    Date: string,
    EpochDate: number,
    Temperature: {
        Minimum: {
            Value: number,
            Unit: string,
            UnitType: number
        }
        Maximum:{
            Value: number,
            Unit: string,
            UnitType: number
        }
    },
    Day: {
        Icon: number,
        IconPhrase: string,
        HasPrecipitation: boolean
    },
    Night: {
        Icon: number,
        IconPhrase: string,
        HasPrecipitation: boolean
    },
    Sources: string[],
    MobileLink: string,
    Link: string
}

export interface DayNight {
    Icon:number,
    IconPhrase: number,
    HasPrecipitation: boolean
}
export const DailyTaskWidget = () => {
    const [pos, savePos] = useState<Coordinates>({latitude: 0, longitude: 0})
    const [loading, setLoading] = useState(true)
    const [foreCasts, setForecasts] = useState<Forecast[]>([])
    const currentDate = new Date();
    const {getAccessTokenSilently} = useAuth0()

    const getWeatherForecast = async():Promise<Forecast[]> => {
        const token = await getAccessTokenSilently()
        await getLocation()
        const result = await axios.get(`${WEATHER_API_BASE_URL}get_five_day_forecast`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })
        return result.data
    }
    const getLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(savePosition)
        }
    }

    const savePosition = async (position:Position) => {
        savePos({latitude: position.coords.latitude, longitude: position.coords.longitude})
    }

    const getWindowsDimension = async () => {
        const { innerWidth: width, innerHeight: height} = window;
        return {
            width, height
        }
    }


    const dayForecast:DDate[] = useMemo(() => {
        const dlist: DDate[] = []
        setLoading(true)
        const loadWeather = async () => {
            const foreCasts = await getWeatherForecast()
            if (foreCasts === null) {
                setForecasts([])
            } else {
                setForecasts(foreCasts)
            }
        }

        loadWeather().then(async () => {
            const dimensions = await getWindowsDimension()
            const stopIndex = dimensions.width < DAY_BREAK_POINT ? 2 : 4

            dlist.push({
                day: currentDate.getDate(),
                monthNumber: currentDate.getMonth(),
                month: getMonthAsString(currentDate.getMonth()),
                year: String(currentDate.getFullYear())
            })
            for (let i = 0; i < stopIndex; i++) {
                currentDate.setDate(currentDate.getDate() + 1)
                dlist.push({
                    day: currentDate.getDate(),
                    monthNumber: currentDate.getMonth(),
                    month: getMonthAsString(currentDate.getMonth()),
                    year: String(currentDate.getFullYear())
                })
            }
        })
        setLoading(false)
        return dlist
    }, [])

    useEffect(() => {
    }, []);



    const DisplayDay = () => {
        return(
            <div className="day-widget mt-4">
                <Row className="justify-content-center m-0">
                {dayForecast.map((day,index) => {
                    return(
                        <DayCard key={day.day} month={day.month} monthNumber={day.monthNumber} day={day.day} year={day.year}
                                 imageIndex={foreCasts[index].Day.Icon}
                                 temp={foreCasts[index].Temperature.Maximum.Value}/>
                    )})}
                </Row>
            </div>
        )
    }

    const DisplayLoading = () => {
        return(
            <Row className="day-widget justify-content-center mt-4">
                <FontAwesomeIcon icon={["fal","spinner"]} spin size="2xl" className="task-widget-spinner" />
            </Row>
        )
    }

    return(
        <>
            <div>
                {loading || foreCasts.length < 5 ? <DisplayLoading /> : <DisplayDay />}
            </div>
        </>
    )
}

export default DailyTaskWidget