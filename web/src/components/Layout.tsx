import {Outlet} from "react-router-dom";
import NavBar from "./NavBar.tsx";
import {useCallback, useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {GET_CONTACT_COOKIES
    , GET_USER_COOKIES
    , GET_ACCOUNT_SETUP_STATUS_URL
    , JOB_API_BASE_URL
    , ACCOUNT_API_BASE_URL} from "../pages/api-routes.tsx";
import {Cookies} from "react-cookie";
import {useIdleTimer} from "react-idle-timer";

export const Layout = () => {
    const {user, getAccessTokenSilently} = useAuth0()
    const [setupStep, setSetupStep] = useState(0)
    const [remaingTime, setRemainingTime] = useState(0)
    const {logout} = useAuth0()

    const onIdle = () => {
        logout({logoutParams:{returnTo:"http://localhost:3000"}})
    }
    const { getRemainingTime } = useIdleTimer({
        onIdle,
        timeout:  30 * 60 * 1000,
        throttle: 500
    })

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
        console.log("Layout use effect called")
        const interval = setInterval(()=>{
            setRemainingTime(Math.ceil(getRemainingTime() / 1000))
        },1000)
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
            return () => {
                clearInterval(interval)
            }
        })
    },[])

    return (
        <div className="h-100 w-100 d-inline-block">
            <NavBar/>
            <div className="ps-0 pe-4">
                    <Outlet/>
            </div>
        </div>
    )
}

export default Layout;