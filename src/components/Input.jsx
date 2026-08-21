import { MailIcon, LockIcon } from "../icons";
import styles from "../css/Input.module.css"; 

export default function Input({type, placeholder, value, onChange, icon}){

    return (
        <div className={styles["input-container"]}>
            {icon === "mail" && <MailIcon style={{width: "24px", height: "24px"}}/>}
            {icon === "lock" && <LockIcon style={{width: "24px", height: "24px"}}/>}
            <input
                className={styles["input"]}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange} 
            />
        </div>
    );
}