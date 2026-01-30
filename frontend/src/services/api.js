import axios from 'axios';
import { AuthModule } from '../auth/AuthModule';

//axios api instance
const api = axios.create({
    baseURL: "http://localhost:8080/",
    withCredentials: true, //allow cookies to be sent
    headers: { "Content-Type" : "application/json"}
});

//configure access token header
api.interceptors.request.use((config) => {
    //get the access token from the module
    const token = AuthModule.getAccessToken();
    //set the access token (if there is one) in the header
    if (token){
        //get the access token from context
        config.headers.Authorization = `Bearer ${token}`;
    }
    //return config
    return config;
});

export default api;







