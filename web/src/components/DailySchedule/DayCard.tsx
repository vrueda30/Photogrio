import {Props, Task} from "./daycardinterfaces.ts";
import {Col, Row} from "reactstrap";
import DayCardItem from "./DayCardItem.tsx";
import {useEffect, useState} from "react";

export const DayCard = (props?: Props) => {
    const test: Task[] = [{name:"test", type:1},{name:"test2", type:1}]
    const [imgIndex, setImgIndex] = useState("01")
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
    useEffect(() => {
        getIndexAsString(props?.imageIndex).then((r) => {
            console.log(`image index received: ${props?.imageIndex}`)
            setImgIndex(r)
        })
    }, [props?.imageIndex]);
    return(
            <Col className="day-card m-1">
                <Row className="justify-content-center align-items-center daily-card-header">
                    {props?.month} {props?.day}, {props?.year} <img alt="weather icon" className="weather-icon" src={`https://developer.accuweather.com/sites/default/files/${imgIndex}-s.png`} />
                </Row>
                <Row>
                    <DayCardItem tasks={test} />
                </Row>
            </Col>
    );
}

export default DayCard;