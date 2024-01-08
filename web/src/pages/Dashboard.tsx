import DailyTaskWidget from "../components/DailySchedule/DailyTaskWidget.tsx";
import {Col, Row} from "reactstrap";
import MailWidget from "../components/MailWidget/MailWidget.tsx";
import {RevenueWidget} from "../components/Revenue/RevenueWidget.tsx";
import {LeadsWidget} from "../components/LeadsWidget/LeadsWidget.tsx";
import ToDoWidget from "../components/ToDo/ToDoWidget.tsx";

export const Dashboard = () => {
    return(
        <>
            <div>
                <DailyTaskWidget />
            </div>
            <Row className="mt-5">
                <Col className="justify-content-center">
                    <Row className="d-flex justify-content-center align-middle">
                        <ToDoWidget />
                    </Row>
                    <Row>
                        <MailWidget />
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <LeadsWidget />
                    </Row>
                    <Row className="mt-2">
                        <RevenueWidget />
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Dashboard;