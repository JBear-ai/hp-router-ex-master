import "./App.css";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import BoardList from "./pages/BoardList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/board" element={<BoardList />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile/:name" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
