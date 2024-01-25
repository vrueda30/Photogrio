import {Collapse, Container, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem} from "reactstrap";
import {useState} from "react";
import {NavLink as RouterNavLink} from 'react-router-dom'
import {NavLink} from 'reactstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAuth0} from "@auth0/auth0-react";


export const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const {logout}  = useAuth0()
    const toggle = () => setIsOpen(!isOpen)

    return(
      <div className="nav-container p-nav-bar">
          <Navbar color="light" light expand="md" container={false}>
              <Container className="p-nav">
                  <NavbarBrand><h1>Photogrio</h1></NavbarBrand>
              <NavbarToggler onClick={toggle} />
              <Collapse isOpen={isOpen} className="justify-content-end me-5" navbar>
                  <Nav className="mr-auto" navbar>
                      <NavItem>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/"
                                  className="router-link-exact-active"
                                  exact
                              >
                              <div>
                                  <div>
                                    <FontAwesomeIcon icon={["fal","house"]} className="mr-3 menu-icon" />
                                  </div>
                                  <div>
                                    <span>Dashboard</span>
                                  </div>
                              </div>
                              </NavLink>
                      </NavItem>
                      <NavItem>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/contacts"
                                  exact
                                  activeClassName="router-link-exact-active">
                              <div>
                                  <div>
                                    <FontAwesomeIcon icon={["fal","address-book"]} className="mr-3 menu-icon" />
                                  </div>
                                  <div>
                                    <span>Contacts</span>
                                  </div>
                              </div>
                              </NavLink>
                      </NavItem>
                      <NavItem>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/calendar"
                                  exact
                                  activeClassName="router-link-exact-active">
                              <div>
                                  <div>
                                    <FontAwesomeIcon icon={["fal","calendar"]} className="mr-3 menu-icon" />
                                  </div>
                                  <div>
                                    <span>Calendar</span>
                                  </div>
                              </div>
                              </NavLink>
                      </NavItem>
                      <NavItem>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/todos"
                                  exact
                                  activeClassName="router-link-exact-active">
                              <div>
                                  <div>
                                    <FontAwesomeIcon icon={["fal","list"]} className="mr-3 menu-icon" />
                                  </div>
                                  <div>
                                    <span>To Dos</span>
                                  </div>
                              </div>
                              </NavLink>
                      </NavItem>
                      <NavItem>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/documents"
                                  exact
                                  activeClassName="router-link-exact-active">
                              <div>
                                  <div>
                                    <FontAwesomeIcon icon={["fal","file"]} className="mr-3 menu-icon" />
                                  </div>
                                  <div>
                                      <span>Documents</span>
                                  </div>
                              </div>
                              </NavLink>
                      </NavItem>
                      <NavItem>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/settings"
                                  exact
                                  activeClassName="router-link-exact-active">
                                <div>
                                    <div>
                                        <FontAwesomeIcon icon={["fal","gear"]} className="mr-3 menu-icon" />
                                    </div>
                                    <div>
                                        <span>Settings</span>
                                    </div>
                                </div>
                              </NavLink>
                      </NavItem>
                  </Nav>
                  <div className="ms-1" onClick={()=>{
                      logout({
                          logoutParams:{
                              returnTo:"https://localhost:3000/logout"
                          }
                      })
                  }}>
                      <div>
                        <FontAwesomeIcon icon={["fal","right-from-bracket"]} className="menu-icon" />
                      </div>
                      <div>
                          <span>Signout</span>
                      </div>
                  </div>
              </Collapse>
              </Container>
          </Navbar>
      </div>
    );
}

export default NavBar