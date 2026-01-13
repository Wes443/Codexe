import { useState } from 'react'
import Login from './components/Login'
import CreateAccount from './components/CreateAccount'
import {Routes, Route} from 'react-router-dom'

function App() {
  //states
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  //functions
  const handleLoginSuccess = (user) => {
    setUser(user);
    setLoggedIn(true);
  }

  return (
    <>
      {!loggedIn && (
        <Routes>
          <Route path='/' element={<Login onLoginSuccess={handleLoginSuccess}/>} />
          <Route path='/create-account' element={<CreateAccount />} />
        </Routes>
      )}

      {loggedIn && (
        <p>Welcome, {user.username}!</p>
      )}
    </>
  );
}

export default App
