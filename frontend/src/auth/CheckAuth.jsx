import { Navigate } from "react-router-dom";
import { AuthModule } from "./AuthModule";

function CheckAuth({ children }) {

    //return to login page if there is no user
    if(!AuthModule.getUser()){
        return <Navigate to="/" replace />;
    }

    //return the elements inside <CheckAuth>
    return children;
}

export default CheckAuth;