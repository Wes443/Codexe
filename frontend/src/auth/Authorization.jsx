import { useState, useEffect, useRef } from 'react';
import { loginRequest, getCurrentUser, refresh } from '../services/userServices';
import { AuthModule } from './AuthModule';

export function Authorization( {children} ){
    //loading state
    const [loading, setLoading] = useState(true);

    const first = useRef(false);

    //use effect for auto logging in
    useEffect(() => {
        if (first.current) return;

        first.current = true;

        //auto login function
        const autoLogin = async () => {
            try{
                //call refresh api and get new access token
                const token = await refresh();

                //if the access token exists
                if (token){
                    //set the new access token
                    AuthModule.setAccessToken(token);
                    //get the user
                    const user = await getCurrentUser();
                    //set the user
                    AuthModule.setUser(user);  

                }

            }catch (error){
                //reset module upon error
                AuthModule.reset()

            }finally{
                //set loading state to false
                setLoading(false);
            }
        };
        autoLogin();
    }, []);

    //block the children from rendering
    if(loading){
        return <div>loading...</div>;
    }

    //return the children of <Authorization>
    return children;
}

//function for logging the user in
export const login = async(module, credentials) => {
    //call the login api and get the access token
    const token = await loginRequest(credentials);
    //set the access token
    module.setAccessToken(token);
    //get the current user
    const user = await getCurrentUser();
    //set the current user 
    module.setUser(user);
}

