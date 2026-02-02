import { Routes, Route } from 'react-router-dom';
import CheckAuth from './auth/CheckAuth';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard';

//import global stylesheet
import './css/global.css';

function App() {
  return (
    <div id='App'>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/dashboard" element={<CheckAuth><Dashboard /></CheckAuth>} />
      </Routes>
    </div>
  );
}

export default App
