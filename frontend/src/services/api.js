import axios from 'axios';

function createApi(accessToken){
    //axios instance
    const api = axios.create({
        baseURL: "http://localhost:8080/",
        withCredentials: true, //allow cookies to be sent
        headers: { "Content-Type" : "application/json"}
    });

    //configure access token header
    api.interceptors.request.use((config) => {
        //call the function being passed in to get the newest access token
        const token = accessToken();
        //set the access token (if there is one) in the header
        if (token) config.headers.Authorization = `Bearer ${token}`;
        //return config
        return config;
    });

    //return api instance
    return api;
}

export default createApi;
