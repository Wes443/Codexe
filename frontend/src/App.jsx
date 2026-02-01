import { Routes, Route } from 'react-router-dom';
import CheckAuth from './auth/CheckAuth';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/dashboard" element={<CheckAuth><Dashboard /></CheckAuth>} />
      </Routes>
    </>
  );
}

export default App
