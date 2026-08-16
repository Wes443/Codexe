import { useLocation, useNavigate } from "react-router-dom";
import styles from "../css/Result.module.css";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState} from "react";
import HomeButton from "../components/HomeButton";
import AccountBar from "../components/AccountBar";

function Result() {
    const { user, userDoc, loading } = useAuth();
    const [ isGuest, setIsGuest ] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    //redirect to dashboard if no session state
    // useEffect(() => {
    //     if(!location.state){
    //         navigate("/", {replace: true});
    //     }
    // }, []);

    //check if the user is signed in or a guest
    useEffect(() => {
        if(loading) return;
        if(user && userDoc) setIsGuest(false);

    }, [user, userDoc, loading]);

    //get all the session details from the state
    // const { accuracy, stdWpm, rawWpm, language, lines, correct, incorrect, time } = location.state || {};

    //temp vars (for testing)
    const accuracy = 98.2;
    const stdWpm = 60;
    const rawWpm = 60;
    const language = "Python";
    const lines = 5;
    const correct = 25;
    const incorrect = 2;
    const time = 67;

    return (
        <div className={styles["session-container"]}>
            <HomeButton />
            <AccountBar isGuest={isGuest} />
            <p>{accuracy}</p>
            <p>{stdWpm}</p>
            <p>{rawWpm}</p>
            <p>{language}</p>
            <p>{lines}</p>
            <p>{correct}</p>
            <p>{incorrect}</p>
            <p>{time}</p>
        </div>
    );
}

export default Result;