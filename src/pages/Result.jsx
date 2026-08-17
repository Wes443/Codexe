import { useLocation, useNavigate } from "react-router-dom";
import styles from "../css/Result.module.css";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState} from "react";
import HomeButton from "../components/HomeButton";
import AccountBar from "../components/AccountBar";
import { NextIcon } from "../icons";

function Result() {
    const { user, userDoc, loading } = useAuth();
    const [ isGuest, setIsGuest ] = useState(true);
    const [ returnHover, setReturnHover ] = useState(false);
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
            <div className={styles["results"]}>
                <div className={styles["wpm"]}>
                    <p className={styles["header-text"]}>wpm</p>
                    <p className={styles["header-text"]} style={{color: "var(--accent-text)"}}>{stdWpm}</p>
                    <p className={styles["accent-text"]}>raw</p>
                    <p className={styles["accent-text"]}>{rawWpm}</p>
                </div>

                <div className={styles["acc"]}>
                    <p className={styles["header-text"]}>acc</p>
                    <p className={styles["header-text"]} style={{color: "var(--accent-text)"}}>{accuracy.toFixed(0)}%</p>
                    <div className={styles["acc-chars"]}>
                        <p style={{color: "var(--accent-text)", fontSize: "16px"}}>total/correct/incorrect</p>
                        <p className={styles["accent-text"]}>{correct + incorrect}/{correct}/{incorrect}</p>
                    </div>
                </div>
                
                <div className={styles["time"]}>
                    <p className={styles["header-text"]}>time</p>
                    <p className={styles["header-text"]} style={{color: "var(--accent-text)"}}>{time}s</p>
                </div>

                <div className={styles["mode"]}>
                    <p className={styles["header-text"]}>mode</p>
                    <p className={styles["accent-text"]}>~{lines}</p>
                    <p className={styles["accent-text"]}>lines</p>
                    <p className={styles["accent-text"]}>{language}</p>
                </div>
            </div>
            <div className={styles["return"]}>
                <span
                    onMouseEnter={() => setReturnHover(true)}
                    onMouseLeave={() => setReturnHover(false)}
                    onClick={() => navigate("/")}
                    style={{cursor: "pointer"}}
                >
                    <NextIcon style={{transform: "scaleX(-1)", color: returnHover ? "var(--hover-text)" : "var(--default-text)" }}/>
                </span>
                <p style={{color: "var(--default-text)", opacity: returnHover ? "100%": "0%"}}>return</p>
            </div>
        </div>
    );
}

export default Result;