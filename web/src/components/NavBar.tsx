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
              <NavbarBrand>Photogrio</NavbarBrand>
              <NavbarToggler onClick={toggle} />
              <Collapse isOpen={isOpen} navbar>
                  <Nav className="mr-auto" navbar>
                      <NavItem>
                          <Container>
                              <Row>
                                  <FontAwesomeIcon icon="home" className="mr-3 menu-icon" />
                              </Row>
                              <Row>
                          <NavLink
                              tag={RouterNavLink}
                              to="/"
                              className="router-link-exact-active"
                              exact
                              >Home</NavLink>
                              </Row>
                          </Container>
                      </NavItem>
                      <NavItem>
                          <Container>
                              <Row>
                                  <FontAwesomeIcon icon="address-book" className="mr-3 menu-icon" />
                              </Row>
                              <Row>
                                  <NavLink
                                      tag={RouterNavLink}
                                      to="/contacts"
                                      exact
                                      activeClassName="router-link-exact-active">Clients</NavLink>
                              </Row>
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