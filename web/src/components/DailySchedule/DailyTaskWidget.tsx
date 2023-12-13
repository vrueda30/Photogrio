import {Row} from "reactstrap";
import DayCard from "./DayCard.tsx";
import {useMemo, useState} from "react";
import './day-card-styles.css'
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios"
import {SCHEDULING_API_BASE_URL} from "../../pages/api-routes.tsx";

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
    year: string
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
    const [foreCasts, setForecasts] = useState<Forecast[]>([])
    const currentDate = new Date();
    const {getAccessTokenSilently} = useAuth0()

    const getWeatherForecast = async():Promise<Forecast[]> => {
        const token = await getAccessTokenSilently()
        await getLocation()
        const result = await axios.get(`${SCHEDULING_API_BASE_URL}get_five_day_forecast`, {
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


    const fiveDayWeek:DDate[] = useMemo(() => {
        const dlist:DDate[] = []
        getWeatherForecast().then((res) => {
            if (res == null){
                setForecasts([])
            }else {
                console.log(JSON.stringify(res))
                setForecasts(res)
            }
        })
        dlist.push({day: currentDate.getDate(), month:getMonthAsString(currentDate.getMonth()), year:String(currentDate.getFullYear())})
        for (let i = 0; i < 4; i++){
            currentDate.setDate(currentDate.getDate() + 1)
            dlist.push({day: currentDate.getDate(), month:getMonthAsString(currentDate.getMonth()), year:String(currentDate.getFullYear())})
        }
        return dlist
    },[])


    const listDays = fiveDayWeek.map((day,index) =>
        <DayCard month={day.month} day={day.day} year={day.year} imageIndex={foreCasts.length === 0 ? 1 : foreCasts[index].Day.Icon}/>
    );


    return(
        <>
            <Row className="task-widget justify-content-center mt-4">
                {listDays}
            </Row>
        </>
    )
}

export default DailyTaskWidget