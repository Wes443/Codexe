import axios from 'axios';
import { getAccessToken } from '../auth/AccessToken'

//axios instance
const api = axios.create({
    baseURL: "http://localhost:8080/",
    withCredentials: true, //allow cookies to be sent
    headers: { "Content-Type" : "application/json"}
});

//Access Token Header
api.interceptors.request.use((config) => {
    //get the access token stored in memoery
    const accessToken = getAccessToken();
    //set the access token in the header
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

export default api;