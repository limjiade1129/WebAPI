const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI =
  "mongodb+srv://jiade:testing123@clusterreact.easjxty.mongodb.net/webapi?retryWrites=true&w=majority&appName=ClusterReact";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Favorite Schema
const favoriteSchema = new mongoose.Schema({
  username: String,
  recipeId: String,
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

// Login Routes
app.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      if (user.password === password) {
        res.json("exist");
      } else {
        res.json("wrong password");
      }
    } else {
      res.json("notexist");
    }
  } catch (error) {
    res.status(500).json("Error: " + error.message);
  }
});

//Sign up
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      res.json("exist");
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      res.json("notexist");
    }
  } catch (error) {
    res.status(500).json("Error: " + error.message);
  }
});

// Route to add favorite recipe
app.post("/api/favorite", async (req, res) => {
  const { username, recipeId } = req.body;

  try {
    const favorite = new Favorite({ username, recipeId });
    await favorite.save();
    res.json("Favorite added successfully");
  } catch (error) {
    res.status(500).json("Error: " + error.message);
  }
});

// Route to get favorite recipes for a user
app.get("/api/favorites/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const favorites = await Favorite.find({ username });
    res.json(favorites);
  } catch (error) {
    res.status(500).json("Error: " + error.message);
  }
});

// Route to delete a favorite recipe for a user
app.delete("/api/favorite", async (req, res) => {
  const { username, recipeId } = req.body;

  try {
    await Favorite.findOneAndDelete({ username, recipeId });
    res.json("Favorite deleted successfully");
  } catch (error) {
    res.status(500).json("Error: " + error.message);
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
