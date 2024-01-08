import {Collapse, Container, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Row} from "reactstrap";
import {useState} from "react";
import {NavLink as RouterNavLink} from 'react-router-dom'
import {NavLink} from 'reactstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)
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
                          <Container>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/"
                                  className="router-link-exact-active"
                                  exact
                              >
                              <Row>
                                  <FontAwesomeIcon icon={["fal","house"]} className="mr-3 menu-icon" />
                              </Row>
                              <Row>
                                    Dashboard
                              </Row>
                              </NavLink>
                          </Container>
                      </NavItem>
                      <NavItem>
                          <Container>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/contacts"
                                  exact
                                  activeClassName="router-link-exact-active">
                              <Row>
                                  <FontAwesomeIcon icon={["fal","address-book"]} className="mr-3 menu-icon" />
                              </Row>
                              <Row>
                                    Contacts
                              </Row>
                              </NavLink>
                          </Container>
                      </NavItem>
                      <NavItem>
                          <Container>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/calendar"
                                  exact
                                  activeClassName="router-link-exact-active">
                              <Row>
                                  <FontAwesomeIcon icon={["fal","calendar"]} className="mr-3 menu-icon" />
                              </Row>
                              <Row>
                                    Calendar
                              </Row>
                              </NavLink>
                          </Container>
                      </NavItem>
                      <NavItem>
                          <Container>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/todos"
                                  exact
                                  activeClassName="router-link-exact-active">
                              <Row>
                                  <FontAwesomeIcon icon={["fal","list"]} className="mr-3 menu-icon" />
                              </Row>
                              <Row>
                                    To-Dos
                              </Row>
                              </NavLink>
                          </Container>
                      </NavItem>
                      <NavItem>
                          <Container>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/documents"
                                  exact
                                  activeClassName="router-link-exact-active">
                              <Row>
                                  <FontAwesomeIcon icon={["fal","file"]} className="mr-3 menu-icon" />
                              </Row>
                              <Row>
                                    Documents
                              </Row>
                              </NavLink>
                          </Container>
                      </NavItem>
                      <NavItem>
                          <Container>
                              <NavLink
                                  tag={RouterNavLink}
                                  to="/settings"
                                  exact
                                  activeClassName="router-link-exact-active">
                                <Row>
                                  <FontAwesomeIcon icon={["fal","gear"]} className="mr-3 menu-icon" />
                                </Row>
                                <Row>
                                    Settings
                                </Row>
                              </NavLink>
                          </Container>
                      </NavItem>
                  </Nav>
              </Collapse>
              </Container>
          </Navbar>
      </div>
    );
}

export default NavBar