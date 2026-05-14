import axios from "axios";

const API = "http://localhost:5000/api/auth";

const api = axios.create({
    baseURL: API,
    withCredentials: true
});

export const loginUser = async(userData) => {
   return await api.post("/login",userData);
}

export const getProfile = async () => {
    return await api.get("/profile");
}

export const logoutUser = async () => {
    return await api.post("/logout");
}

export const refreshToken = async () => {
    return await api.post("/refresh");
}

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;
        if(error.response &&
           error.response.status === 401 &&
           !originalRequest._retry &&
            originalRequest.url !== "/refresh") {
            
            originalRequest._retry = true;

            try {
                await refreshToken();
                return api(originalRequest);
            } catch(refreshError) {
                console.log("Refresh token expired");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;