import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const APP_ID = "dabe304c";
const APP_KEY = "b86f99d8368da19d37105b4b044b20ec";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  const fetchFavoriteRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:8000/api/favorites/${username}`);
      const favoriteRecipes = response.data;

      const recipeDetails = await Promise.all(
        favoriteRecipes.map(async (favorite) => {
          const recipeResponse = await axios.get(`https://api.edamam.com/api/recipes/v2/${favorite.recipeId}`, {
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

          return { ...recipeResponse.data.recipe, recipeId: favorite.recipeId }; // Include recipeId for deletion
        })
      );

      setRecipes(recipeDetails);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Failed to fetch favorite recipes.");
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchFavoriteRecipes();
  }, [fetchFavoriteRecipes]);

  const viewRecipe = (recipeUri) => {
    const recipeId = recipeUri.split("#recipe_")[1]; // Extract the recipe ID
    sessionStorage.setItem("recipeId", recipeId);
    navigate(`/viewrecipes`);
  };

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete("http://localhost:8000/api/favorite", { data: { username, recipeId } });
      setDeleteMessage("Recipe deleted successfully.");
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.recipeId !== recipeId));
    } catch (error) {
      setDeleteMessage(error.response ? error.response.data : "Failed to delete recipe.");
    }
  };

  return (
    <Container>
      <h1>My Favorite Recipes</h1>

      {loading && (
        <div className="loading-container">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && error && <Alert variant="danger">Error: {error}</Alert>}

      {!loading && deleteMessage && (
        <Alert variant="info" className="mt-3">
          {deleteMessage}
        </Alert>
      )}

      {!loading && !error && recipes.length === 0 && <Alert variant="info">You have no favorite recipes.</Alert>}

      {!loading && recipes.length > 0 && (
        <Row xs={1} md={3} className="g-4">
          {recipes.map((recipe) => (
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
                  <div className="d-flex justify-content-between mt-auto">
                    <Button variant="primary" onClick={() => viewRecipe(recipe.uri)}>
                      View Recipe
                    </Button>
                    <Button variant="danger" onClick={() => deleteRecipe(recipe.recipeId)}>
                      Delete
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

export default MyRecipes;
