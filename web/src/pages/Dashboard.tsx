import {Row} from "reactstrap";
import DayCard from "../components/DailySchedule/DayCard.tsx";
import {useAuth0} from "@auth0/auth0-react";

export const Dashboard = () => {
    const user = useAuth0()

    return(
        <>
            {user.user?.email}
            <Row>
                <DayCard /><DayCard /><DayCard /><DayCard /><DayCard />
            </Row>
        </>
    )
}

export default Dashboard;