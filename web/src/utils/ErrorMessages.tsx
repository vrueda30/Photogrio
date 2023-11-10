import {isRouteErrorResponse} from "react-router-dom";

export function errorMessages(error: unknown): string {
    if (isRouteErrorResponse(error)) {
        return `${error.status} ${error.statusText}`
    } else if (error instanceof Error) {
        return error.message
    } else if (typeof error === 'string') {
        return error
    } else {
        console.log(error)
        return "Unknown error"
    }
}