import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./css/global.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Setup from "./pages/Setup";
import { SetupProvider } from "./auth/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <SetupProvider>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<Setup />} />
          {/* protected routes */}
        </Routes>
      </SetupProvider>
    </BrowserRouter>
  );
}

export default App
