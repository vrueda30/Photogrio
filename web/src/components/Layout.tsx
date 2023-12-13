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

    const get_cookies_url = `${GET_USER_COOKIES}${user?.email}`


    useEffect(() => {
        getAccessTokenSilently().then((t) => {
            axios.get(get_cookies_url, {
                headers: {
                    Authorization: "Bearer " + t
                },
                withCredentials:true
            }).then((r) => {
                const cookies = new Cookies()
                    cookies.set('user', r.data, {path: '/'})
                    axios.get(GET_CONTACT_COOKIES + r.data.accountId, {
                        headers: {
                            Authorization: "Bearer " + t
                        },
                        withCredentials:true
                    })
                        .then(() => {
                            console.log("Contact cookies retrieved")
                        })
                }
            )

        })

    },[])

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