import styles from "../css/Dashboard.module.css";
import { useAuth } from "../auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { user, userDoc } = useAuth();

    const navigate = useNavigate();
    
	const handleSignOut = async () => {
		await signOut(auth);
		navigate("/login");
	};

    return (
        <div>
            {userDoc && <p>{userDoc.firstName}</p>}
            {user && <button onClick={handleSignOut}>Sign Out</button>}
        </div>
    );
}

export default Dashboard;