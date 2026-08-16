import styles from "../css/Dashboard.module.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { UserIcon, LogoutIcon } from "../icons";

export default function AccountBar({isGuest}) {
    const navigate = useNavigate();
    
    //function to handle signout 
	const handleSignOut = async () => {
		await signOut(auth);
        //reload page 
        navigate(0);
	};

    //function to handle when the user icon is pressed
    function handleUserIcon() {
        if(isGuest){
            navigate("/login");
        }else{
            navigate("/profile");
        }
    }

    return(
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
    );
}