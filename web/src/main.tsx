import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './photogrio.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import {getConfig} from "./auth/authconfig.ts";

import initFontAwesome from "./utils/initFontAwesome.tsx";
import ErrorPage from "./pages/error-page.tsx";
import AuthProviderWithCallback from "./auth/AuthProviderWithCallback.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx"
import {Contacts} from "./pages/Contact/Contacts.tsx";
import {EditContact} from "./pages/Contact/EditContact.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";


initFontAwesome();

const config = getConfig();



const providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
        redirect_uri: window.location.origin,
        ...(config.audience ? { audience: config.audience } : null ),
        cacheMode: "on"
    },
}
const router = createBrowserRouter([
    {
        element: <AuthProviderWithCallback {...providerConfig}><ProtectedRoute component={Layout} /></AuthProviderWithCallback>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/test",
                element: <App />
            },
            {
                path: "/contacts",
                element: <Contacts />
            },
            {
                path: "/contact/:contactId",
                element: <EditContact />
            },
            {
                path: "/calendar",
                element: <CalendarPage />
            }
        ]
    },
    {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorPage />
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
