import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import styles from "../css/Login.module.css";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/Input";
import HomeButton from "../components/HomeButton";
import AccountBar from "../components/AccountBar";

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
        <div className={styles["window"]}>
            <HomeButton />
            <AccountBar isGuest={true} />
            <div className={styles["content"]}>
                <Input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon="user"
                />

                <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon="lock"
                />
                <button onClick={handleEmailLogin}>{creatingAcc ? "Sign Up" : "Login"}</button>

                <p style={{color: "var(--hover-text)", fontSize: "16px", cursor: "default"}}>Or</p>

                <button onClick={handleGoogleLogin}>
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path
                            fill="var(--default-text"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="var(--default-text"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="var(--default-text"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                            fill="var(--default-text"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Login with Google
                </button>
                <div className={styles["toggle"]}>
                    <p>{creatingAcc ? "Already have an account?" : "Don't have an account?"}</p>
                    <p className={styles["click-text"]} onClick={() => setCreatingAcc(!creatingAcc)}>{creatingAcc ? "Login" : "Sign Up"}</p>
                </div>

                {error && <p className={styles["error"]}>{error}</p>}
            </div>
        </div>
    );
}

export default Login;