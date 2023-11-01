import logo from './logo.svg';
import './App.css';
import LoginButton from "./auth/login";
import LogoutButton from "./auth/logout";
import history from "./utils/history"
import {useAuth0} from "@auth0/auth0-react";

import initFontAwesome from "./utils/initFontAwesome"
initFontAwesome();
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
        <LoginButton>Login</LoginButton> <LogoutButton>Log Out</LogoutButton>
    </div>
  );
}

export default App;
