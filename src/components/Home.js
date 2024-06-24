import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import "./Home.css"; // Make sure to import your CSS file

function RecipesCard() {
  return (
    <div className="card-container" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/download.jpeg)` }}>
      <Container className="d-flex flex-column justify-content-center align-items-center h-100">
        <h1 className="text-center text-light">Welcome to DishDeck !!!</h1>
        <Link to="/recipes" className="btn btn-primary mt-3">
          Explore Recipes
        </Link>
      </Container>
    </div>
  );
}

export default RecipesCard;
