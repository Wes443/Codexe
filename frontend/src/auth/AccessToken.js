//variable only accessible within this module
let accessToken = null;

//setter function
export function setAccessToken(token) {
    accessToken = token;
}

//getter function
export function getAccessToken() {
    return accessToken;
}

//clear access token
export function clearAccessToken(){
    accessToken = null;
}