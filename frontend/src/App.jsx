import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSuccess";
import EcoCoach from "./pages/EcoCoach";
import Community from "./pages/Community";

function App() {

  return (

    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/oauth-success" element={<OAuthSuccess />} />

      <Route path="/eco-coach" element={<EcoCoach />} />

      <Route path="/community" element={<Community />} />
    </Routes>

  );

}

export default App;