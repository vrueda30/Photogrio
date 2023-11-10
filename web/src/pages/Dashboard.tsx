import {Row} from "reactstrap";
import {useAuth0} from "@auth0/auth0-react";

export const Dashboard = () => {
    const user = useAuth0()

    return(
        <>
            {user.user?.email}
            <Row>

            </Row>
        </>
    )
}

export default Dashboard;