import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./css/global.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Result from "./pages/Result";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/session-results" element={<Result />} />
          {/* protected routes */}
        </Routes>
    </BrowserRouter>
  );
}

export default App
