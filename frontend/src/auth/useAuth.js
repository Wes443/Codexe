import { AuthContext } from "./Authorization";
import { useContext } from "react";

export const useAuth = () => {
    return useContext(AuthContext);
}