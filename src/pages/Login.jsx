import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import styles from "../css/Login.module.css";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/Input";
import HomeButton from "../components/HomeButton";
import AccountBar from "../components/AccountBar";
import { GoogleLogo } from "../icons";
import { updateUser, getUser } from "../../firebase/functions/users";
import { Timestamp } from "firebase/firestore";

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
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
            
		} catch (err) {
			setError("Login failed.");
		}
	};

    const handleCreateAcc = async() => {
        try{
            //check if any of the fields are empty
            if([email, password, firstName, lastName].some(value => !value.trim())){
                setError("Some fields are missing.");
                return;
            }

            //create a firebase user and get the user uid
            const firebaseUser = await createUserWithEmailAndPassword(auth, email, password);
            const userUid = firebaseUser.user.uid;
            
            //create a userDoc
            const status = await updateUser(userUid, {
                uid: userUid,
                firstName: firstName,
                lastName: lastName,
                joinDate: Timestamp.now(),
                email: email,
            });

            //navigate to dashboard upon success, otherwise return an error
            if(status){
                navigate("/");
            }else{
                setError("Failed to create account.");
                return;
            }
        }catch(error){
            setError("Failed to create account.");
            return;
        }
    }

    //function for logging in with Google
	const handleGoogleLogin = async () => {
		try {
			const provider = new GoogleAuthProvider();

            //get the firebase user and userDoc
			const firebaseUser = await signInWithPopup(auth, provider);
            const userDoc = await getUser(firebaseUser.user.uid);
            
            //if there is no userDoc
            if(!userDoc){
                //get the displayName
                const name = firebaseUser.user.displayName?.trim() ?? "";
                const parts = name ? name.split(/\s+/) : [];
                const fName = parts[0] ?? "";
                const lName = parts.slice(1).join(" ");

                //create a userDoc
                const status = await updateUser(firebaseUser.user.uid, {
                    uid: firebaseUser.user.uid,
                    firstName: fName,
                    lastName: lName,
                    joinDate: Timestamp.now(),
                    email: firebaseUser.user.email,
                });  

                //return an error if failed to create userDoc
                if(!status){
                    setError("Failed to create account.");
                    return;
                }              
            }
            navigate("/");
		} catch (error) {
			setError("Google sign-in failed.");
            return;
		}
	};

    //return early if auth is still loading or if the user is already logged in
    if(loading || user || userDoc) return;

    return (
        <div className={styles["window"]}>
            <HomeButton />
            <AccountBar isGuest={true} />
            <div className={styles["content"]}>
                {creatingAcc && <Input
                    type="text"
                    placeholder="first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />}

                {creatingAcc && <Input
                    type="text"
                    placeholder="last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />}

                <Input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={creatingAcc ? handleCreateAcc : handleEmailLogin}>{creatingAcc ? "Sign Up" : "Login"}</button>

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