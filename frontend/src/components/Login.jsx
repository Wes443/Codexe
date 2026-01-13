import { useState } from 'react'
import { loginUser } from '../services/userServices'
import { useNavigate } from 'react-router-dom'

function Login({ onLoginSuccess }) {
    //states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    //navigation
    const nav = useNavigate();

    //functions
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const user = await loginUser({ username, password });
            setMessage("Login Success");
            onLoginSuccess(user);

        } catch(error){
            if (error.response) {
                setMessage("Login Failed");
            } else {
                setMessage("Server Unreachable");
            }
        }
    }
    
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
                    type="text"
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