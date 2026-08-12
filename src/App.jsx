import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./css/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
