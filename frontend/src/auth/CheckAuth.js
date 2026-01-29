import { useNavigate } from "react-router-dom";
import getAuth from '.'

function CheckAuth({ children }) {
    //get user and loading from global context
    const [user, loading] = getAuth();
    //if the context is loading
    if(loading){
        return <p>Loading...</p>
    }

    //if there is no authorized user
    if(!user){
        return useNavigate("/", {replace: true})
    }

    //return the elements inside <CheckAuth>
    return children;
}

export default CheckAuth;