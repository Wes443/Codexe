import api from './api'
import {setAccessToken, clearAccessToken} from '../auth/AccessToken'

//create user
export async function createUser(userData){
    const response = await api.post("/auth/create-user", userData);
    return response.data;
}

//get current user based on access token
export async function getCurrentUser() {
    const response = await api.get("/me");
    return response.data;
}

//log the user in and return the user object
export async function loginUser(credentials){
    //response from backend
    const response = await api.post("/auth/login", credentials);
    //get the access token from the response
    const accessToken = response.data;
    //store the access token in memoery
    setAccessToken(accessToken);
    //get the user based on the access token
    const user = await getCurrentUser();
    //return the user
    return user;
}

//get a new access token upon page refresh
export async function refresh(){
    //response from backend
    const response = await api.post("/auth/refresh");
    //get access token
    const accessToken = response.data;
    //store the access token in memoery
    setAccessToken(accessToken);
    //return the access token
    return response.data;
}

//log the user out
export async function logout(){
    //response from backend
    const response = await api.post('/auth/logout');
    //cler the acces token from memory
    clearAccessToken();
}
