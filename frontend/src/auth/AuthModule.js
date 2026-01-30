let accessToken = null;
let user = null;

export const AuthModule = {
    getAccessToken: () => accessToken,

    getUser: () => user,

    setAccessToken: (token) => {
        accessToken = token;
    },

    setUser: (u) => {
        user = u;
    },

    reset: () => {
        accessToken = null;
        user = null;
    },
};