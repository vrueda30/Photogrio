import {Outlet} from "react-router-dom";
import NavBar from "./NavBar.tsx";
import {Container} from "reactstrap";

export const Layout = () => {
    return(
        <>
            <NavBar />
            <Container fluid className="main-container container-fluid">
                <Outlet />
            </Container>
        </>
    )
}

export default Layout;