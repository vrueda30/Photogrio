import {Outlet} from "react-router-dom";
import NavBar from "./NavBar.tsx";
import {Container} from "reactstrap";
import {useCallback, useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {GET_CONTACT_COOKIES
    , GET_USER_COOKIES
    , GET_ACCOUNT_SETUP_STATUS_URL
    , JOB_API_BASE_URL
    , ACCOUNT_API_BASE_URL} from "../pages/api-routes.tsx";
import {Cookies} from "react-cookie";

export const Layout = () => {
    const {user, getAccessTokenSilently} = useAuth0()
    const [setupStep, setSetupStep] = useState(0)

    const get_cookies_url = `${GET_USER_COOKIES}${user?.email}`

    const seedJobTypes = async(token: string): Promise<string> => {
        const res = await axios.get(`${JOB_API_BASE_URL}setup_jobs`, {
            headers: {
                Authorization: "Bearer " + token
            },
            withCredentials: true
        })
        return res.data.status
    }

    const updateSetupStatus = async(token:string): Promise<string> => {
        const res = await axios.get(`${ACCOUNT_API_BASE_URL}update_setup_status`, {
            headers: {
                Authorization: "Bearer " + token
            },
            withCredentials: true
        })

        return await res.data
    }

    const setupAccount = useCallback(async(token:string) => {
        let setupStatus: string
        const res = await axios.get(GET_ACCOUNT_SETUP_STATUS_URL,{
            headers: {
                Authorization: "Bearer " + token
            },
            withCredentials: true
        })
        const data = await res.data.setupStep
        setSetupStep(data)
        switch (setupStep) {
            case 1:
                setupStatus = await  seedJobTypes(token)
                if (setupStatus === "complete"){
                   await updateSetupStatus(token)
                }

        }
    },[setupStep])

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
                    }).then(async () => {
                            //await setup_account(t)
                            await setupAccount(t)
                        }
                       )
                }
            )

        })

    },[getAccessTokenSilently, get_cookies_url, setupAccount, setupStep])

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