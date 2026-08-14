import styles from "../css/Dashboard.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import HomeButton from "../components/HomeButton";
import AccountBar from "../components/AccountBar";
import TypingNavbar from "../components/TypingNavbar";

function Dashboard() {
    const { user, userDoc, loading } = useAuth();
    const [ isGuest, setIsGuest ] = useState(true);
    const [ lines, setLines ] = useState(5);
    const [ language, setLanguage ] = useState("Python");
    const [ zen, setZen ] = useState(false);

    //check if the user is signed in or a guest
    useEffect(() => {
        if(loading) return;
        if(user && userDoc) setIsGuest(false);

    }, [user, userDoc, loading]);

    return (
        <div className={styles["window"]}>
            <HomeButton />
            <AccountBar isGuest={isGuest}/>
            <TypingNavbar />
        </div>
    );
}

export default Dashboard;