import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/TypingText.module.css";
import { CursorIcon, ClockIcon } from "../icons";

export default function TypingText({ lines, language, zen }) {
    const [input, setInput] = useState("");
    const [mistakes, setMistakes] = useState(0);
    const [text, setText] = useState("");
    const [focus, setFocus] = useState(true);
    const [seconds, setSeconds] = useState(0);
    const [watchRunning, setWatchRunning] = useState(false);
    const [mode, setMode] = useState("");
    const inputRef = useRef(null);
    const typingAreaRef = useRef(null);
    
    const navigate = useNavigate();

    const MAX_TIME = 999;
    const NUM_TYPING_CODE = 3;

    //run on initial mount
    useEffect(() => {
        inputRef.current.focus();

        function handleUnfocus(event) {
            //check if the ref element exists and if the click was outside the element
            if (typingAreaRef.current && !typingAreaRef.current.contains(event.target)){
                setFocus(false);
            }
        }

        document.addEventListener("mousedown", handleUnfocus);

        return () => {document.removeEventListener("mousedown", handleUnfocus);};

    }, []);

    //run when the text length changes
    useEffect(() => {
        //get the text length
        const size = lines === 5 ? "short" : lines === 10 ? "medium" : "long";

        //update the typing text
        fetch(`typing-code/${language.toLowerCase()}/${size}/${getRandomInt()}.txt`)
        .then((res) => res.text())
        .then((data) => {setText(data.replace(/\r\n/g, "\n"))});

    }, [lines]);

    //run when the language changes
    useEffect(() => {
        //get the text length
        const size = lines === 5 ? "short" : lines === 10 ? "medium" : "long";

        //update the typing text
        fetch(`typing-code/${language.toLowerCase()}/${size}/${getRandomInt()}.txt`)
        .then((res) => res.text())
        .then((data) => {setText(data.replace(/\r\n/g, "\n"))});

    }, [language]);

    //run when the mode changes
    useEffect(() => {
        if(zen){
            setMode("Zen");
            return;
        }else {
            setMode(`~${lines} lines ${language}`);
        }

        //clear user input
        setInput("");

    }, [lines, language, zen]);

    //run when the timer status changes
    useEffect(() => {
        //return if the watch is not running
        if(!watchRunning) return;

        //increment the watch every 1000ms (1s)
        const interval = setInterval(() => {
            setSeconds(prev => {
                //reset the timer if maxed
                if (prev >= MAX_TIME){
                    clearInterval(interval);
                    setWatchRunning(false);
                    return MAX_TIME;
                }

                return prev + 1;
            });
        },  1000);

        //reset the timer
        return () => clearInterval(interval);
    }, [watchRunning]);

    //function to get a random number (1 - MAX_TYPING_CODE)
    function getRandomInt() {
        return Math.floor(Math.random() * NUM_TYPING_CODE) + 1;
    }

    //function to manually focus input box
    const focusInput = () => {
        inputRef.current.focus();
        setFocus(true);
    };

    //function to handle normal key presses within the typing box
    const handleKeyPress = (e) => {
        //get the current user input
        let value = e.target.value;

        //if not in zen mode
        if (!zen){
            //start the watch
            if (!watchRunning) setWatchRunning(true);
    
            //auto tab
            if (value[value.length - 1] === "\n" && value.length > input.length){
                //consume all the tabs after a newline
                let i = value.length;
                while (i + 1 < text.length && text[i] === "\t") {
                    value += "\t";
                    i++;
                }
            }

            //calculate errors
            let errors = 0;
            for (let i = 0; i < value.length; i++) {
                if (value[i] !== text[i]) {
                    errors++;
                }
            }

            //if the user reaches the end of the text
            if(value.length === text.length){
                //stop the timer
                setWatchRunning(false);
                handleSession(errors, value);
            }

            //update the use states
            setInput(value);
            setMistakes(errors);
        
        //if in zen mode 
        }else{
            //stop the stopwatch
            if(watchRunning){
                setWatchRunning(false);
                setSeconds(0);
            }

            setInput(value);

            let nlines = 0;
            for (let i = 0; i < value.length; i++){
                if(value[i] == '\n'){
                    nlines++;
                }
            }

            if(nlines >= 14){
                setInput(input);
            }

            if(nlines >= 13 && (value.length - value.lastIndexOf("\n") >= 48)){
                setInput(input);
            }
            
            //46 * 14
            if(value.length >= 644) setInput(input);
        }
    };

    //function to handle special key presses within the typing box
    const handleSpecialKeyPress = (e) => {
        //pressing tab
        if (e.key === "Tab"){
            //prevent default tab behavior
            e.preventDefault();

            //add tab to user input
            const value = input + "\t";
            
            //calculat the errors
            let errors = 0;
            for (let i = 0; i < value.length; i++) {
                if (value[i] !== text[i]) {
                    errors++;
                }
            }  

            //update the use states
            setInput(value);
            setMistakes(errors);
        }

        //unfocus typing area when pressng esc
        if (e.key === "Escape"){
            setFocus(false);
        }
    };

    return (
        <div className={styles["typing-container"]}>
            <div className={styles["text-info-container"]}>
                {!zen && <span className={styles["watch"]}>
                    <ClockIcon style={{width: "20", height: "20"}}/>
                    <p style={{color: "var(--accent-text)"}}>{seconds}</p>
                    <p style={{color: "var(--hover-text)"}}>|</p>
                </span>}
                <p className={styles["current-mode"]}>mode: {mode}</p>
            </div>
            
            <div className={styles["text-container"]}>
                <pre className={styles["text"]} onClick={focusInput} ref={typingAreaRef} >
                    {/* blur overlay when typing area is unfocused */}
                    {!focus && <div className={styles["blur-overlay"]}>
                        <CursorIcon style={{width: "24", height: "24", color: "var(--hover-text)"}}/>
                        <p>click to focus</p>
                    </div>}

                    {/* iterate through and display each character in the text */}
                    {!zen && text.split("").map((char, index) => {
                        let color = "var(--default-text)";
                        let cursor = "cursor-hidden";
                        
                        //if the user typed the current char
                        if (index < input.length) {
                            //check if the current character typed matches the text
                            if (input[index] === char){
                                color = "var(--hover-text)"
                            }else {
                                if(char === " "){ char = '_'; }
                                color = "var(--error-text)";
                            }
                        }
                        
                        //reveal the cursor 
                        if (focus && index === input.length) {
                            cursor = "cursor-visible";
                        }

                        //display the text and cursor
                        return (
                            <span key={index} style={{color: color}}>
                                <span className={styles[cursor]}></span>{char}
                            </span>
                        );
                    })}
                </pre>
            </div>

            <p style={{margin: "10px"}}>test</p>
            
            { /* invisible input box */}
            <textarea
                className={styles["invisible-input"]}
                ref = {inputRef}
                value={input}
                onKeyDown={handleSpecialKeyPress}
                onChange={handleKeyPress}
            />
        </div>
    );
}