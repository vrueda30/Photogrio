import DailyTaskWidget from "../components/DailySchedule/DailyTaskWidget.tsx";
import {Col, Row} from "reactstrap";
import MailWidget from "../components/MailWidget/MailWidget.tsx";
import {RevenueWidget} from "../components/Revenue/RevenueWidget.tsx";
import {LeadsWidget} from "../components/LeadsWidget/LeadsWidget.tsx";
import ToDoWidget from "../components/ToDo/ToDoWidget.tsx";

export const Dashboard = () => {
    return(
        <div className="dashboard d-inline-block">
            <Row>
                <Col className="col-12">
                   <DailyTaskWidget />
                </Col>
            </Row>
            <Row className="mt-5 m-0">
                <Col className="justify-content-center col-12 col-md-6">
                    <Row className="d-flex w-100 justify-content-center align-middle">
                        <Col className="col-12">
                           <ToDoWidget />
                        </Col>
                    </Row>
                    <Row className="d-flex">
                        <Col className="col-12">
                           <MailWidget />
                        </Col>
                    </Row>
                </Col>
                <Col className="col-12 col-md-6">
                    <Row>
                        <LeadsWidget />
                    </Row>
                    <Row className="mt-2">
                        <RevenueWidget />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Dashboard;