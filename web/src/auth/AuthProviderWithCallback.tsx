import {Auth0Provider} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";

const AuthProviderWithCallback = ({children, ...props}) => {
    const navigate = useNavigate();
    const onRedirectCallback = () => {
        //navigate((appState && appState.returnTo) || window.location.pathname)
        navigate("/")
    }
    return (
        <Auth0Provider onRedirectCallback={onRedirectCallback} domain={props.domain} clientId={props.clientId} {...props}>
            {children}
        </Auth0Provider>
    )
}

export default AuthProviderWithCallback;