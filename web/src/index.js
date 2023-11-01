import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Auth0Provider} from "@auth0/auth0-react";
import {getConfig} from "./config";
import history from "./utils/history"

const onRedirectCallback = (appState) => {
    history.push(
        appState && appState.returnTo ? appState.returnTo : window.location.pathname
    );
};

const config = getConfig();

const providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    onRedirectCallback,
    authorizationParams: {
        redirect_uri: window.location.origin,
        ...(config.audience ? {audience: config.audience} : null),
    },
}

const root = createRoot(document.getElementById('root'));
root.render(
      <Auth0Provider
          {...providerConfig}
        >
        <App />
      </Auth0Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
