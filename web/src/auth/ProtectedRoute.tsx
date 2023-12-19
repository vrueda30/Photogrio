import {withAuthenticationRequired} from "@auth0/auth0-react";
import {ReactNode} from "react";


interface Props {
    component: ReactNode,
    args: {}[]
}

const ProtectedRoute = ({component, ...args}) => {
    const Component = withAuthenticationRequired(component, args);
    return <Component />
}

export default ProtectedRoute;