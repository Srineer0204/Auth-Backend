import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if(originalRequest && 
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/auth/refresh" &&
    originalRequest.url !== "/auth/login" &&
    originalRequest.url !== "/auth/register" 
        ) {

            originalRequest._retry = true;
            try {
                await api.post("/auth/refresh");
                return api(originalRequest);
            } catch(refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;