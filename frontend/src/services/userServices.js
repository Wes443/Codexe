//create user
export async function createUser(api, userData){
    const response = await api.post("/auth/create-user", userData);
    return response.data;
}

//get current user based on access token
export async function getCurrentUser(api) {
    //response from backend
    const response = await api.get("/me");
    //return the user object
    return response.data;
}

//log the user in and return the user object
export async function loginRequest(api, credentials){
    //response from backend
    const response = await api.post("/auth/login", credentials);
    //return the new access token
    return response.data;
}

//get a new access token upon page refresh
export async function refresh(api){
    //response from backend
    const response = await api.post("/auth/refresh");
    //return the new access token
    return response.data;
}

//log the user out
export async function logout(api){
    //response from backend
    const response = await api.post('/auth/logout');
    //return response
    return response.data;
}
