import { createContext, useContext, useState, useMemo } from 'react';
import createApi from '../services/api';
import { loginRequest, getCurrentUser } from '../services/userServices';

//create a context variable
const AuthContext = createContext(null);

export function Authorization( {children} ){
    //states
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    //boolean for auto login
    const hasRun = useRef(false)

    //global api instance 
    //createApi is only run when accessToken changes values
    const api = useMemo(() => createApi(() => accessToken), [accessToken]);

    //use effect for auto logging in
    useEffect(() => {
        //only refresh on first mount
        if(hasRun.current){
            return;
        }
        //after first mount, set boolean to true
        hasRun.current = true;
        //auto login function
        const autoLogin = async () => {
            try{
                //call refresh api and get the access token
                const token = await refresh(api);
                //if the access token exists
                if (token){
                    //set the new access token
                    setAccessToken(token);
                    //get the user 
                    const user = await getCurrentUser(api);
                    //set the user
                    setUser(user);  
                }

            }catch (error){
                //reset context if error
                setAccessToken(null);
                setUser(null);

            }finally{
                //set loading state to false
                setLoading(false);
            }
        };
        autoLogin();
    }, []);

    //function for logging the user in
    const login = async(credentials) => {
        //call the login api and get the access token
        const token = await loginRequest(api, credentials);
        //set the access token in context
        setAccessToken(token);
        //get the current user
        const user = await getCurrentUser();
        //set the current user in context
        setUser(user);
    }

    return (
        //set the provider of the auth context
        //share the auth context with all the children components
        <AuthContext.Provider 
            value={{
                api,
                accessToken,
                setAccessToken,
                user,
                setUser,
                loading,
                setLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

