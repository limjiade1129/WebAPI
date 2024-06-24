import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function AppNavbar() {
  return (
    <Navbar bg="light" expand="md">
      <Navbar.Brand as={NavLink} to="/" className="navbar-brand">
        DishDeck
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav className="mr-auto">
          <Nav.Item>
            <Nav.Link as={NavLink} to="/home" activeClassName="active">
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/recipes" activeClassName="active">
              Recipes
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/myrecipes" activeClassName="active">
              My Recipes
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/about" activeClassName="active">
              About
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
