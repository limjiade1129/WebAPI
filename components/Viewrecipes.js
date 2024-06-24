import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Alert, Spinner, Button, Row, Col, Image } from "react-bootstrap";
import "./Viewrecipes.css";

const APP_ID = "dabe304c";
const APP_KEY = "b86f99d8368da19d37105b4b044b20ec";

const ViewRecipes = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteMessage, setFavoriteMessage] = useState(null);

  useEffect(() => {
    const recipeId = sessionStorage.getItem("recipeId");
    if (!recipeId) {
      setError("Recipe ID not found in sessionStorage.");
      setLoading(false);
      return;
    }

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.edamam.com/api/recipes/v2/${recipeId}`, {
          params: {
            type: "public",
            app_id: APP_ID,
            app_key: APP_KEY,
          },
          headers: {
            accept: "application/json",
            "Accept-Language": "en",
          },
        });

        if (response.data && response.data.recipe) {
          setRecipe(response.data.recipe);
        } else {
          setError("Recipe not found");
        }
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch recipe.");
        setLoading(false);
      }
    };

    fetchRecipe();
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleFavorite = async () => {
    const recipeId = sessionStorage.getItem("recipeId");
    const username = sessionStorage.getItem("username"); // Assuming username is stored in sessionStorage
    try {
      const response = await axios.post("http://localhost:8000/api/favorite", { username, recipeId });
      setFavoriteMessage(response.data);
    } catch (error) {
      setFavoriteMessage(error.response ? error.response.data : "Failed to save favorite.");
    }
  };

  if (loading) {
    return (
      <Container className="recipe-container">
        <div className="loading-container">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="recipe-container">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container className="recipe-container">
        <Alert variant="info">Recipe not found.</Alert>
      </Container>
    );
  }

  const { label, image, ingredientLines, calories, totalNutrients } = recipe;

  return (
    <Container className="recipe-container">
      <Row>
        {/* Left Section: Image */}
        <Col md={6}>
          <Image src={image} alt={label} fluid />
        </Col>

        {/* Right Section: Title, Ingredients, Calories, Add to Favorites Button */}
        <Col md={6}>
          <h1>Recipe Details</h1>
          <p>
            <strong>Title:</strong> {label}
          </p>
          <h2>Ingredients:</h2>
          <ul>
            {ingredientLines.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <p>
            <strong>Calories:</strong> {calories.toFixed(2)}
          </p>
          <Button variant="primary" onClick={handleFavorite}>
            Add to Favorites
          </Button>
          {favoriteMessage && (
            <Alert variant="info" className="mt-3">
              {favoriteMessage}
            </Alert>
          )}
        </Col>
      </Row>

      {/* Nutritional Information Section */}
      <Row className="mt-5">
        <Col>
          <h2>Nutritional Information</h2>
          <ul>
            {totalNutrients &&
              Object.keys(totalNutrients).map((key, index) => (
                <li key={index}>
                  {totalNutrients[key].label}: {totalNutrients[key].quantity.toFixed(2)} {totalNutrients[key].unit}
                </li>
              ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewRecipes;
