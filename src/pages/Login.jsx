import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import styles from "../css/Login.module.css";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/Input";
import HomeButton from "../components/HomeButton";
import AccountBar from "../components/AccountBar";
import { GoogleLogo } from "../icons";
import { getUser } from "../../firebase/functions/users";

import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
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

    //function for logging in with email and password
	const handleEmailLogin = async () => {
		try {
            //if the user is creating an account, nav to setup page after
			if (creatingAcc){
                await createUserWithEmailAndPassword(auth, email, password);
                navigate("/setup")
            
            //if the user is logging in, nav to dashboard after
            }else{
                await signInWithEmailAndPassword(auth, email, password);
                navigate("/");
            } 
		} catch (err) {
			setError("Login failed.");
		}
	};

    //function for logging in with Google
	const handleGoogleLogin = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const firebaseUser = await signInWithPopup(auth, provider);

            //get the userDoc from the firebase user after auth
            const userDoc = await getUser(firebaseUser.user.uid);

            //if there is no doc, then nav to setup, otherwise nav to dashboard
            if(!userDoc){
                navigate("/setup");
            }else{
                navigate("/");
            }
		} catch (err) {
			setError("Google sign-in failed.");
		}
	};

    //return early if auth is still loading or if the user is already logged in
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
                    icon="mail"
                />

                <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon="lock"
                />
                <button onClick={handleEmailLogin}>{creatingAcc ? "Sign Up" : "Login"}</button>

                <p style={{color: "var(--default-text)", fontSize: "16px", cursor: "default"}}>Or</p>

                <button onClick={handleGoogleLogin}>
                    <GoogleLogo />
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