import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { updateUser } from "../../firebase/functions/users";
import { useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import styles from "../css/Setup.module.css";
import { auth } from "../../firebase/firebase";
import { User } from "../../firebase/types";

function Setup() {
    const { user, userDoc, loading } = useAuth();
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const navigate = useNavigate();

    //redirect to login page if no user
    //redirect to dashboard if user and userDoc exists
    useEffect(() => {
        if(loading) return;
        if(!user) navigate("/login");
        if(userDoc) navigate("/");
    }, [loading, user, userDoc]);

    //function to handle setup completion 
    const handleSubmit = async() => {

        if(!firstName) return;
        
        const status = await updateUser(user.uid, {
            uid: user.uid,
			firstName: firstName,
			lastName: lastName,
			email: user.email,
			joinDate: Timestamp.now(),
        });

        if(status){
            navigate("/");
        }else{
            return;
        }
    }

    return(
        <div>
            <input 
                type="text"
                placeholder="e.g. Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />

            <input 
                type="text"
                placeholder="e.g. Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />

            <button onClick={handleSubmit}>submit</button>
        </div>
    );
}

export default Setup;