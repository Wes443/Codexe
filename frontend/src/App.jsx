import { useState, useEffect, useRef } from 'react'
import Login from './components/Login'
import CreateAccount from './components/CreateAccount'
import { Routes, Route } from 'react-router-dom'
import { refresh, getCurrentUser } from './services/userServices'

function App() {
  console.log("App mounted", performance.now());
  //states
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  //boolean for auto login
  const hasRun = useRef(false);

  //use effect for auto logging in
  useEffect(() => {
    //prevent refresh from running every mount
    if(hasRun.current){
      return;
    }
    //after first mount, set boolean to true
    hasRun.current = true;
    //auto login function
    const autoLogin = async () => {
      try{
        //call refresh api and get the access token
        const token = await refresh();
        //if the access token exists
        if (token){
          //set login state to true
          setLoggedIn(true);
          //get the user and set the state
          const user = await getCurrentUser();
          setUser(user);
          
        }
      }catch (error){
        //set login state to false
        setLoggedIn(false);
      }finally{
        //set loading state to false
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

  return (
    <div>
      {loading && <p>Loading...</p>}

      {!loading && !loggedIn && (
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={ handleLoginSuccess } />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      )}

      {!loading && loggedIn && (
        <p>Welcome, {user.username}!</p>
      )}
    </div>
  );
}

export default App
