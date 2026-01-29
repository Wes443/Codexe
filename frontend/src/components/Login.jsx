import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth/Authorization'

function Login() {    
    //states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    //get the user from context
    const [user] = getAuth();

    //navigation
    const nav = useNavigate();

    //navigate to dashboard if user is already signed in
    if(user){
        nav("/dashboard", {replace: true});
    }

    //functions
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            //set the user in the context
            await login({ username, password });
            //set the message
            setMessage("Login Success");
            //navigate to dashboard
            nav("/dashboard", {replace: true});

        } catch(error){
            if (error.response) {
                setMessage("Login Failed");
            } else {
                setMessage("Server Unreachable");
            }
        }
    };
    
    return (
        <form onSubmit={handleLogin}>
            <div>
                <label>Username</label>
                <input 
                    type="text"
                    name="username"
                    placeholder="*required"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
            </div>
            <div>
                <label>Password</label>
                <input 
                    type="password"
                    name="password"
                    placeholder="*required"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
            </div>
            <div>
                <button type="submit">Login</button>
                <p>{message}</p>
                <p>Don't have an account?</p>
                {/* go to the create account page */}
                <button onClick={() => nav('/create-account')}>Create Account</button>
            </div>
        </form>
    );
}

export default Login;