import { useState } from 'react';
import { loginUser } from '../services/userServices'

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const message = await loginUser({ username, password });
            setMessage(message);

        } catch(error){
            if (error.response && error.response.data) {
                setMessage(error.response.data);
            } else {
                setMessage("Server unreachable");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
            <p>{message}</p>
        </form>
    );
}

export default Login;