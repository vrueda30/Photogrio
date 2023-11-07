import {Auth0Provider} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";

const AuthProviderWithCallback = ({children, ...props}) => {
    const navigate = useNavigate();
    const onRedirectCallback = (appState) => {
        navigate((appState && appState.returnTo) || window.location.pathname)
    }
    return (
        <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
            {children}
        </Auth0Provider>
    )
}

export default AuthProviderWithCallback;