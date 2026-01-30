import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthModule } from '../auth/AuthModule';
import { login } from '../auth/Authorization';

function Login() {    
    //states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    //navigation object
    const nav = useNavigate();

    //navigate to dashboard if user is already signed in
    useEffect(() => {
        if(AuthModule.getUser()){
            nav('/dashboard', {replace: true});
        }
    }, [nav]);

    //handle the user login upon form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            //call login function 
            await login(AuthModule, { username, password });
            //set the message
            setMessage("Login Success");
            //navigate to dashboard
            nav('/dashboard', {replace: true});

        } catch(error){
            if (error.response) {
                setMessage("Login Failed");
            } else {
                setMessage("Server Unreachable");
            }

        } finally{
            //allow module to update properly
            setLoading(false); 
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
                <button onClick={() => nav('/create-account', {replace: true})}>Create Account</button>
            </div>
        </form>
    );
}

export default Login;