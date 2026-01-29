import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

function CheckAuth({ children }) {
    //get user and loading from global context
    const [user] = useAuth();

    //if there is no authorized user
    if(!user){
        return useNavigate("/", {replace: true})
    }

    //return the elements inside <CheckAuth>
    return children;
}

export default CheckAuth;