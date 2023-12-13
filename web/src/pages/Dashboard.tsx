import DailyTaskWidget from "../components/DailySchedule/DailyTaskWidget.tsx";
import {Col, Row} from "reactstrap";
import MailWidget from "../components/MailWidget/MailWidget.tsx";
import {RevenueWidget} from "../components/Revenue/RevenueWidget.tsx";
import {LeadsWidget} from "../components/LeadsWidget/LeadsWidget.tsx";

export const Dashboard = () => {
    return(
        <>
            <div>
                <DailyTaskWidget />
            </div>
            <Row className="mt-5">
                <Col>
                    <MailWidget />
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