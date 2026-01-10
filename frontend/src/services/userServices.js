import api from './api';

//user services
export async function createUser(userData){
    const response = await api.post("/create-user", userData);
    return response.data;
}

export async function loginUser(credentials){ 
    const response = await api.post("/login", credentials);
    return response.data;
}
