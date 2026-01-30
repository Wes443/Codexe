import api from "./api";

//create user
export async function createUser(userData){
    const response = await api.post("/auth/create-user", userData);
    return response.data;
}

//get current user based on access token
export async function getCurrentUser() {
    //response from backend
    const response = await api.get("/me");
    //return the user object
    return response.data;
}

//log the user in and return the user object
export async function loginRequest(credentials){
    //response from backend
    const response = await api.post("/auth/login", credentials);
    //return the new access token
    return response.data;
}

//get a new access token upon page refresh
export async function refresh(){
    //response from backend
    const response = await api.post("/auth/refresh");
    //return the new access token
    return response.data;
}

//log the user out
export async function logout(){
    //response from backend
    const response = await api.post('/auth/logout');
    //return response
    return response.data;
}
