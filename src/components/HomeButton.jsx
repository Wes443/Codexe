import { useState } from "react";
import styles from "../css/Dashboard.module.css";
import { LogoIcon } from "../icons";
import { useNavigate } from "react-router-dom";

export default function HomeButton() {
    const [ hover, setHover ] = useState(false);
    const navigate = useNavigate();

    return (
        <div 
            className={styles["logo-container"]} 
            onMouseEnter={() => setHover(!hover)} 
            onMouseLeave={() => setHover(!hover)}
            onClick={() => navigate("/")}
        >
            <LogoIcon style={{width: "32", height: "32", color: hover ? "var(--hover-text)" : "var(--default-text)"}} />
            <p style={{color: hover ? "var(--hover-text)" : "var(--default-text)"}}>Codexe</p>
        </div>
    );
}