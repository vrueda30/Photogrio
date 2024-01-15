import {Row} from "reactstrap";
import DayCard from "./DayCard.tsx";
import {useMemo, useState} from "react";
import './day-card-styles.css'
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios"
import {WEATHER_API_BASE_URL} from "../../pages/api-routes.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ABSTRACT_URI} from "../../Constants.ts";
import {useSetState} from "../../hooks/UseSetState.ts";
import {Cookies} from "react-cookie";

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
    coords: Coordinates
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
    const [pos = null, savePos] = useState<Coordinates>()
    const [loading, setLoading] = useState(true)
    const [foreCasts, setForecasts] = useState<Forecast[] | null>(null)
    const currentDate = new Date();
    const {getAccessTokenSilently} = useAuth0()
    const [ip, setIP] = useState("")

    const getIP = async () => {
        const res = await axios.get("https://api.ipify.org/?format=json")
        setIP(res.data.ip)
    }

    const getWeatherForecast = async():Promise<Forecast[]> => {
        const locationCookie = new Cookies().get('location') as Coordinates
        console.debug(locationCookie)
        const token = await getAccessTokenSilently()
        const queryParams = locationCookie ? `?latitude=${locationCookie.latitude}&longitude=${locationCookie.longitude}` : ''
        const result = await axios.get(`${WEATHER_API_BASE_URL}get_five_day_forecast${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })
        return result.data
    }

    const getLocation = async () => {
        return await axios.get(`${ABSTRACT_URI}ip_address=${ip}`).then((res) => {
            return res.data
        }).catch((e) => {
            console.debug(e)
        })
    }

    /*const getLocationPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })*/

    const savePosition = async (latitude: number, longitude: number) => {
        console.debug(`incoming lat and long: ${latitude}:${longitude}`)
        const loc:Coordinates = {
                latitude: latitude,
                longitude: longitude
        }
        console.log(`saving coords: ${JSON.stringify(loc)}`)
        const locCookie = new Cookies()
        const expireDate = new Date()
        expireDate.setHours(expireDate.getHours() + 24)
        locCookie.set('location', loc)
    }

    const getWindowsDimension = async () => {
        const { innerWidth: width, innerHeight: height} = window;
        return {
            width, height
        }
    }

    const loadWeather = async () => {
        try {
            const lCookie = new Cookies()
            const currentLocation = lCookie.get('location') as Coordinates
            if (!currentLocation || currentLocation.latitude === undefined || currentLocation.longitude === undefined) {
                await getIP()
                const location = await getLocation()
                console.debug(`received from getLocation: ${JSON.stringify(location)}`)
                if (location != null) {
                    console.log(location.latitude)
                    await savePosition(location.latitude, location.longitude)
                }
            }
            const forecasts = await getWeatherForecast()
            if (forecasts){
                setForecasts([...forecasts])}
        } catch(e){
            console.debug(e)
        }
    }

    const dayForecast:DDate[] = useMemo(() => {
        const dlist: DDate[] = []
        setLoading(true)


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
        }).finally(()=> setLoading(false))
        return dlist
    }, [])

    const DisplayDay = () => {
        return(
            <div className="day-widget mt-4">
                <Row className="justify-content-center m-0">
                {dayForecast.map((day,index) => {
                    return(
                        <DayCard key={day.day} month={day.month} monthNumber={day.monthNumber} day={day.day} year={day.year}
                                 imageIndex={foreCasts ? foreCasts[index].Day.Icon : null}
                                 temp={foreCasts  ? foreCasts[index].Temperature.Maximum.Value : null} />
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
                {loading || !foreCasts ? <DisplayLoading /> : <DisplayDay />}
            </div>
        </>
    )
}

export default DailyTaskWidget