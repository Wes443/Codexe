import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import styles from "../css/Login.module.css";
import { useAuth } from "../auth/AuthContext";
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider, 
} from "firebase/auth";

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [creatingAcc, setCreatingAcc] = useState(false);
    const { user, userDoc, loading } = useAuth();

    //redirect to login page if already signed in
    useEffect(() => {
		if(loading) return;
        if(user && userDoc) navigate("/");
    }, [loading, user, userDoc]);

	const handleEmailLogin = async () => {
		try {
			if (creatingAcc) await createUserWithEmailAndPassword(auth, email, password);
			else await signInWithEmailAndPassword(auth, email, password);
			navigate("/");

		} catch (err) {
			setError("Login failed.");
		}
	};

	const handleGoogleLogin = async () => {
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			navigate("/");
		} catch (err) {
			setError("Google sign-in failed.");
		}
	};

    if(loading || user || userDoc) return;

    return (
        <div>
            <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleEmailLogin}>{creatingAcc ? "Sign Up" : "Login"}</button>
            <button onClick={handleGoogleLogin}>Login with Google</button>
            <p>{creatingAcc ? "Already have an account?" : "Don't have an account?"}{" "}<span style={{textDecoration: "underline"}}onClick={() => setCreatingAcc(!creatingAcc)}>{creatingAcc ? "Login" : "Sign Up"}</span></p>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;