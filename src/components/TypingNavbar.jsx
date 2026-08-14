import { useState } from "react";
import styles from "../css/TypingNavbar.module.css";
import { LinesIcon } from "../icons";
import { CodeIcon } from "../icons";
import { ZenIcon } from "../icons";

export default function TypingNavbar({ lines, setLines, language, setLanguage, zen, isZen }) {
    const [ hover, setHover ] = useState("");

    return (
        <div className={styles["typing-mode-container"]}>
            <div className={styles["mode"]} onMouseEnter={() => setHover("lines")} onMouseLeave={() => setHover("")}>
                <LinesIcon />
                <p style={{color: hover === "lines" ? "var(--hover-text)" : "var(--default-text)"}}>Lines</p>
                <div className={styles["dropdown"]} style={{display: hover === "lines" ? "flex" : "none"}}>
                    <p>~5</p>
                    <p>~10</p>
                    <p>~15</p>
                </div>
            </div>
            <div className={styles["mode"]} onMouseEnter={() => setHover("language")} onMouseLeave={() => setHover("")}>
                <CodeIcon />
                <p style={{color: hover === "language" ? "var(--hover-text)" : "var(--default-text)"}}>Langauge</p>
                <div className={styles["dropdown"]} style={{display: hover === "language" ? "flex" : "none"}}>
                    <p>Python</p>
                    <p>Java</p>
                    <p>C++</p>
                </div>
            </div>
            <div className={styles["zen-mode"]} onMouseEnter={() => setHover("zen")} onMouseLeave={() => setHover("")}>
                <ZenIcon style={{width: "30", height: "30"}}/>
                <p style={{color: hover === "zen" ? "var(--hover-text)" : "var(--default-text)"}}>Zen</p>
            </div>
        </div>
    );
}