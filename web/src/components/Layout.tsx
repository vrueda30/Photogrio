import {Outlet} from "react-router-dom";
import NavBar from "./NavBar.tsx";
import {Container} from "reactstrap";
import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {GET_CONTACT_COOKIES, GET_USER_COOKIES} from "../pages/api-routes.tsx";
import {Cookies} from "react-cookie";

export const Layout = () => {
    const {user, getAccessTokenSilently} = useAuth0()
    const cookies = new Cookies()

    useEffect(() => {
        getAccessTokenSilently().then((t) => {
            axios.get(GET_USER_COOKIES + user?.email, {
                headers: {
                    Authorization: "Bearer " + t
                }
            }).then((r) => {
                    cookies.set('account', r.data, {path: '/'})
                    console.log("Session retrieved")
                    axios.get(GET_CONTACT_COOKIES + cookies.get("account").accountId, {
                        headers: {
                            Authorization: "Bearer " + t
                        },
                        withCredentials: true,
                    })
                        .then(() => {
                            console.log("Contact cookies retrieved")
                        })
                }
            )

        })

    })
    return (
        <>
            <NavBar/>
            <Container fluid className="main-container container-fluid">
                <Outlet/>
            </Container>
        </>
    )
}

export default Layout;