// import './App.css'
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Recipes from "./components/Recipes";
import Viewrecipes from "./components/Viewrecipes";
import MyRecipes from "./components/Myrecipes.js";
import About from "./components/About.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/viewrecipes" element={<Viewrecipes />} />
          <Route path="/myrecipes" element={<MyRecipes />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
