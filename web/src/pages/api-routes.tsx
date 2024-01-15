export const CREATE_ACCOUNT_URL = "http://localhost:5001/api/accounts/create_account"

export const USER_API_BASE_URL = import.meta.env.VITE_USER_API_URL
export const CONTACT_API_BASE_URL = import.meta.env.VITE_CONTACT_API_URL
export const GET_ACCOUNT_SETUP_STATUS_URL = import.meta.env.VITE_ACCOUNT_SETUP_STATUS_URL
export const JOB_API_BASE_URL = import.meta.env.VITE_JOB_API_URL
export const ACCOUNT_API_BASE_URL = import.meta.env.VITE_ACCOUNT_API_URL
export const WEATHER_API_BASE_URL = import.meta.env.VITE_WEATHER_API_URL
export const TODO_API_BASE_URL = import.meta.env.VITE_TODO_API_URL

export const GET_CONTACT_COOKIES=`${CONTACT_API_BASE_URL}get_cookies/`

export const GET_USER_COOKIES = `${USER_API_BASE_URL}get_user_session_info/`
