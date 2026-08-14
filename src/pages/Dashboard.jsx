import styles from "../css/Dashboard.module.css";
import { useAuth } from "../auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import { useEffect, useState } from "react";
import { UserIcon, LogoutIcon } from "../icons";

function Dashboard() {
    const { user, userDoc, loading } = useAuth();
    const [ isGuest, setIsGuest ] = useState(true);
    const navigate = useNavigate();

    //check if the user is signed in or a guest
    useEffect(() => {
        if(loading) return;
        if(user && userDoc) setIsGuest(false);

    }, [user, userDoc, loading]);

    //function to handle signout 
	const handleSignOut = async () => {
		await signOut(auth);
		navigate("/login");
	};

    //function to handle when the user icon is pressed
    function handleUserIcon() {
        if(isGuest){
            navigate("/login");
        }else{
            navigate("/profile");
        }
    }

    return (
        <div className={styles["window"]}>
            <HomeButton />
            
            <div className={styles["account-nav-container"]}>
                <div className={styles["user-icon"]} onClick={handleUserIcon}>
                    <UserIcon style={{width: "32", height: "32"}}/>
                </div>
                
                {!isGuest && 
                    <div className={styles["logout-icon"]} onClick={handleSignOut}>
                        <LogoutIcon style={{width: "32", height: "32"}} />
                    </div>
                }
            </div>
        </div>
    );
}

export default Dashboard;