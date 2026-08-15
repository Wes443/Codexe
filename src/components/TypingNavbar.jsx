import { useState } from "react";
import styles from "../css/TypingNavbar.module.css";
import { LinesIcon } from "../icons";
import { CodeIcon } from "../icons";
import { ZenIcon } from "../icons";

export default function TypingNavbar({ lines, setLines, language, setLanguage, zen, setZen }) {
    const [ hover, setHover ] = useState("");

    return (
        <div className={styles["typing-mode-container"]}>
            <div className={styles["mode"]} onMouseEnter={() => setHover("lines")} onMouseLeave={() => setHover("")}>
                <LinesIcon />
                <p style={{color: hover === "lines" ? "var(--hover-text)" : "var(--default-text)"}}>Lines</p>
                <div className={styles["dropdown"]} style={{display: hover === "lines" ? "flex" : "none"}}>
                    <p onClick={() => setLines(5)}>~5</p>
                    <p onClick={() => setLines(10)}>~10</p>
                    <p onClick={() => setLines(15)}>~15</p>
                </div>
            </div>
            <div className={styles["mode"]} onMouseEnter={() => setHover("language")} onMouseLeave={() => setHover("")}>
                <CodeIcon />
                <p style={{color: hover === "language" ? "var(--hover-text)" : "var(--default-text)"}}>Langauge</p>
                <div className={styles["dropdown"]} style={{display: hover === "language" ? "flex" : "none"}}>
                    <p onClick={() => setLanguage("Python")}>Python</p>
                    <p onClick={() => setLanguage("Java")}>Java</p>
                    <p onClick={() => setLanguage("C++")}>C++</p>
                </div>
            </div>
            <div className={styles["zen-mode"]} onMouseEnter={() => setHover("zen")} onMouseLeave={() => setHover("")} onClick={() => setZen(!zen)}>
                <ZenIcon style={{width: "30", height: "30", color: hover === "zen" || zen ? "var(--hover-text)" : "var(--default-text)"}}/>
                <p style={{color: hover === "zen" || zen ? "var(--hover-text)" : "var(--default-text)"}}>Zen</p>
            </div>
        </div>
    );
}