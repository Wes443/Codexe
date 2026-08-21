import styles from "../css/Input.module.css"; 

export default function Input({type, placeholder, value, onChange}){

    return (
        <div className={styles["input-container"]}>
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