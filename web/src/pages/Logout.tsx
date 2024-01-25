import {Nav, NavItem, NavLink} from "reactstrap";
import {NavLink as RouterNavLink} from 'react-router-dom'

const Logout = () => {
    return(
        <div className="d-flex h-100 justify-content-center align-content-center">
            <div>
                <Nav>
                    <NavItem>
                        <NavLink tag={RouterNavLink} to="/">
                            Login
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
        </div>
    )
}

export default Logout