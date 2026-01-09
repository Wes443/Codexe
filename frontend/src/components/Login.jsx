import { useState } from 'react';
import { loginUser } from '../services/userServices';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const user = await loginUser({username, password});
            onLoginSuccess(user);

        }catch (error){
            setMessage("Login Failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default Login;