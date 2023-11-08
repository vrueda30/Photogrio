import axios from "axios"
import apiConfig from "./api_config.json"
import {useAuth0} from "@auth0/auth0-react";
import authConfig from "../auth/auth_config.json"

export const contactApiInstance = axios.create({
    baseURL: apiConfig.contact_api
});

contactApiInstance.interceptors.request.use(
    async (config) => {
        const {getAccessTokenSilently} = useAuth0()
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: authConfig.audience
            }
        });
        config.headers.Authorization = "Bearer " + token;
        return config;
    },
    function (error){
        return Promise.reject(error)
    }
)