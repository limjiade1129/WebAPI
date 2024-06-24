import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Recipes.css";

const APP_ID = "dabe304c";
const APP_KEY = "b86f99d8368da19d37105b4b044b20ec";

const Recipes = () => {
  const [query, setQuery] = useState("chicken");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.edamam.com/search", {
        params: {
          q: query,
          app_id: APP_ID,
          app_key: APP_KEY,
        },
      });
      console.log(response.data);
      if (response.data.hits) {
        setRecipes(response.data.hits);
      } else {
        setRecipes([]);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const viewRecipes = (recipeUri) => {
    const recipeId = recipeUri.split("#recipe_")[1]; // Extract the recipe ID
    sessionStorage.setItem("recipeId", recipeId);
    navigate(`/viewrecipes`);
  };

  return (
    <Container className="recipes-container">
      <Form.Group controlId="formRecipeSearch">
        <Form.Label>Search Recipes</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter recipe name..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleSearch} disabled={loading} className="search-button">
        {loading ? "Searching..." : "Search"}
      </Button>

      <br />
      <br />

      {loading && (
        <div className="loading-container">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && error && <Alert variant="danger">Error: {error.message}</Alert>}

      {!loading && !error && recipes.length === 0 && (
        <Alert variant="info">No recipes found for "{query}". Try another search.</Alert>
      )}

      {!loading && recipes.length > 0 && (
        <Row xs={1} md={3} className="g-4">
          {recipes.map(({ recipe }) => (
            <Col key={recipe.uri}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={recipe.image}
                  alt={recipe.label}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="card-title">{recipe.label}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    <strong>Calories:</strong> {Math.round(recipe.calories)} kcal
                    <br />
                    <strong>Fats:</strong> {Math.round(recipe.totalNutrients.FAT.quantity)}{" "}
                    {recipe.totalNutrients.FAT.unit}
                  </Card.Text>
                  <div className="card-button-wrapper">
                    <Button variant="primary" onClick={() => viewRecipes(recipe.uri)}>
                      View Recipe
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Recipes;
