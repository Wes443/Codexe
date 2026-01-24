import { useState, useEffect } from 'react'
import Login from './components/Login'
import CreateAccount from './components/CreateAccount'
import {Routes, Route} from 'react-router-dom'
import { refresh, getCurrentUser } from './services/userServices'

function App() {
  //states
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  //use effect for auto logging in (run once when component mounts)
  useEffect(() => {
    const autoLogin = async () => {
      try{
        const token = await refresh();
        if (token){
          const user = await getCurrentUser();
          setUser(user);
          setLoggedIn(true);
        }
      }catch (error){
        setLoggedIn(false);
      }finally{
        setLoading(false);
      }
    };
    autoLogin();
  }, []);

  //functions
  const handleLoginSuccess = (user) => {
    setUser(user);
    setLoggedIn(true);
  }

  //display loading inbetween transitions
  if (loading){
    return <p>Loading...</p>;
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
